// ====================================
// Fixed Server.js - Booking Error Solution
// ====================================

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { engine } = require("express-handlebars");
const path = require("path");
const os = require("os");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const nodemailer = require("nodemailer");
const sharp = require("sharp");
const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");

// Sentry Error Tracking (only in production or if DSN is provided)
let Sentry;
if (process.env.SENTRY_DSN) {
  Sentry = require("@sentry/node");
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: 1.0,
  });
}

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0'; // Listen on all network interfaces

// Sentry Request Handler (must be first)
if (Sentry) {
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "public/uploads");
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files (jpeg, jpg, png, gif, webp) and PDF files are allowed!"));
    }
  },
});

// Email transporter configuration
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify email configuration
if (process.env.SMTP_USER) {
  emailTransporter.verify(function (error, success) {
    if (error) {
      console.log("⚠️  Email service not configured:", error.message);
    } else {
      console.log("✅ Email service ready");
    }
  });
}

// Email sending helper function
async function sendEmail(to, subject, html) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("⚠️  Email not sent - SMTP credentials not configured");
    console.log(`   Would send to: ${to}`);
    console.log(`   Subject: ${subject}`);
    return;
  }

  try {
    const mailOptions = {
      from: `"WanderLust Travel" <${process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      html: html,
    };

    const info = await emailTransporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
    throw error;
  }
}

// Generate booking confirmation email HTML
function generateBookingConfirmationEmail(booking) {
  const checkIn = new Date(booking.checkIn).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const checkOut = new Date(booking.checkOut).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1B263B 0%, #D4AF37 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; color: #1B263B; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .btn { display: inline-block; padding: 12px 24px; background: #1B263B; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✈️ Booking Confirmed!</h1>
          <p>Your travel adventure awaits</p>
        </div>
        <div class="content">
          <p>Dear ${booking.firstName || "Valued Customer"},</p>
          <p>We're excited to confirm your booking with WanderLust Travel!</p>
          
          <div class="booking-details">
            <h2 style="color: #1B263B; margin-top: 0;">Booking Details</h2>
            <div class="detail-row">
              <span class="detail-label">Destination:</span>
              <span>${booking.destination || "N/A"}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Check-in:</span>
              <span>${checkIn}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Check-out:</span>
              <span>${checkOut}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Travelers:</span>
              <span>${booking.adults || 0} Adults${booking.children > 0 ? `, ${booking.children} Children` : ""}${booking.infants > 0 ? `, ${booking.infants} Infants` : ""}</span>
            </div>
            <div class="detail-row" style="border-bottom: none;">
              <span class="detail-label">Status:</span>
              <span style="color: #10b981; font-weight: bold;">APPROVED</span>
            </div>
          </div>

          <p>Your booking has been approved and confirmed. We'll be in touch soon with more details about your trip.</p>
          
          <a href="${process.env.SITE_URL || "http://localhost:3001"}/dashboard" class="btn">View Booking Details</a>
        </div>
        <div class="footer">
          <p>Thank you for choosing WanderLust Travel!</p>
          <p>If you have any questions, please contact us at support@wanderlust.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Generate payment receipt email HTML
function generatePaymentReceiptEmail(payment) {
  const paymentDate = new Date(payment.paymentDate || payment.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1B263B 0%, #D4AF37 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .payment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; color: #1B263B; }
        .amount { font-size: 24px; color: #10b981; font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .btn { display: inline-block; padding: 12px 24px; background: #1B263B; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💳 Payment Receipt</h1>
          <p>Your payment has been approved</p>
        </div>
        <div class="content">
          <p>Dear ${payment.user?.name || "Valued Customer"},</p>
          <p>Thank you for your payment! Your transaction has been approved and processed.</p>
          
          <div class="payment-details">
            <h2 style="color: #1B263B; margin-top: 0;">Payment Details</h2>
            <div class="detail-row">
              <span class="detail-label">Transaction ID:</span>
              <span>${payment.transactionId || payment._id}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Amount:</span>
              <span class="amount">$${payment.amount?.toLocaleString() || "0.00"}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Payment Method:</span>
              <span>${payment.paymentMethod || "Credit Card"}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span>${paymentDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span style="color: #10b981; font-weight: bold;">APPROVED</span>
            </div>
            ${payment.booking?.destination ? `
            <div class="detail-row" style="border-bottom: none;">
              <span class="detail-label">Booking:</span>
              <span>${payment.booking.destination}</span>
            </div>
            ` : ""}
          </div>

          <p>Your payment has been successfully processed. You can view your booking details in your dashboard.</p>
          
          <a href="${process.env.SITE_URL || "http://localhost:3001"}/dashboard" class="btn">View Dashboard</a>
        </div>
        <div class="footer">
          <p>Thank you for choosing WanderLust Travel!</p>
          <p>If you have any questions, please contact us at support@wanderlust.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Session middleware with MongoDB store for persistence
app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      "wanderlust-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: process.env.MONGODB_URI 
      ? MongoStore.create({
          mongoUrl: process.env.MONGODB_URI,
          ttl: 24 * 60 * 60, // 24 hours
          autoRemove: 'native',
        })
      : undefined, // Fallback to memory store if no MongoDB
    cookie: {
      secure: false, // Set to false for local network access (HTTP)
      httpOnly: true, // Prevent XSS attacks
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax', // CSRF protection - works for same-site requests
    },
    name: 'wanderlust.sid', // Custom session name
  })
);

// Handlebars setup
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      eq: (a, b) => a === b,
      substring: (str, start, end) => {
        if (!str) return "";
        return str.substring(start, end);
      },
      uppercase: (str) => {
        if (!str) return "";
        return str.toUpperCase();
      },
    },
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// MongoDB Connection (with better error handling and optimizations)
let mongoConnected = false;

if (process.env.MONGODB_URI) {
  const mongooseOptions = {
    maxPoolSize: 10, // Maintain up to 10 socket connections
    minPoolSize: 2, // Maintain at least 2 socket connections
    serverSelectionTimeoutMS: 5000, // How long to try selecting a server
    socketTimeoutMS: 45000, // How long to wait for a socket to be available
    maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
  };

  mongoose
    .connect(process.env.MONGODB_URI, mongooseOptions)
    .then(() => {
      console.log("✅ MongoDB Connected Successfully");
      console.log("   Connection Pool: Min 2, Max 10 connections");
      mongoConnected = true;
      
      // Create indexes for better query performance
      createDatabaseIndexes();
    })
    .catch((err) => {
      console.error("❌ MongoDB Connection Error:", err.message);
      console.warn(
        "⚠️  Server running without database - bookings will be logged only"
      );
    });
} else {
  console.warn("⚠️  No MONGODB_URI in .env - Server running without database");
}

// Create database indexes for optimized queries
async function createDatabaseIndexes() {
  try {
    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ deviceFingerprint: 1 });
    await User.collection.createIndex({ role: 1 });
    
    // Booking indexes
    await Booking.collection.createIndex({ userId: 1 });
    await Booking.collection.createIndex({ status: 1 });
    await Booking.collection.createIndex({ createdAt: -1 });
    await Booking.collection.createIndex({ userId: 1, status: 1 }); // Compound index
    
    // Payment indexes (note: user and booking indexes are already defined in schema)
    // Only create indexes that aren't already in the schema
    await Payment.collection.createIndex({ paymentStatus: 1 });
    // user and booking indexes are handled by schema definitions
    
    // Testimonial indexes
    await Testimonial.collection.createIndex({ status: 1 });
    await Testimonial.collection.createIndex({ createdAt: -1 });
    await Testimonial.collection.createIndex({ user: 1 });
    
    console.log("✅ Database indexes created successfully");
  } catch (error) {
    console.error("⚠️  Error creating indexes:", error.message);
  }
}

// ====================================
// MODELS
// ====================================

// User Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  deviceFingerprint: { type: String }, // IP + User Agent hash for device-based security
  registeredIP: { type: String }, // IP address at registration
  registeredUserAgent: { type: String }, // User agent at registration
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// Booking Model
const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  destination: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  adults: { type: Number, required: true, min: 1 },
  children: { type: Number, default: 0 },
  infants: { type: Number, default: 0 },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  specialRequests: String,
  status: { type: String, enum: ["pending", "approved", "rejected", "cancelled", "completed"], default: "pending" },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approvedAt: { type: Date },
  rejectionReason: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model("Booking", bookingSchema);

// Import additional models
const Payment = require("./models/Payment");
const Wishlist = require("./models/Wishlist");
const Notification = require("./models/Notification");
const TravelPackage = require("./models/TravelPackage");
const UserProfile = require("./models/UserProfile");
const Testimonial = require("./models/Testimonial");
const fs = require("fs");

// Helper function to check if request is from localhost
function isLocalhost(req) {
  const ip = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
  return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1' || ip === 'localhost' || req.headers.host?.includes('localhost');
}

// Helper function to get device fingerprint
function getDeviceFingerprint(req) {
  const ip = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  // Create a simple hash from IP + User Agent
  const crypto = require('crypto');
  const hash = crypto.createHash('md5').update(`${ip}-${userAgent}`).digest('hex');
  return hash;
}

// Helper function to get client IP
function getClientIP(req) {
  return req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
}

// Helper function to get user agent
function getUserAgent(req) {
  return req.headers['user-agent'] || 'unknown';
}

// Load testimonials from JSON file
function loadTestimonialsFromJSON() {
  try {
    const jsonPath = path.join(__dirname, 'testimonials.json');
    if (fs.existsSync(jsonPath)) {
      const data = fs.readFileSync(jsonPath, 'utf8');
      const json = JSON.parse(data);
      const all = [];
      if (json.featured) {
        json.featured.forEach(t => {
          all.push({
            ...t,
            source: 'json',
            destination: t.destination || 'Worldwide Adventure',
            createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date in past year
          });
        });
      }
      if (json.stories) {
        json.stories.forEach(t => {
          all.push({
            ...t,
            source: 'json',
            destination: t.destination || 'Worldwide Adventure',
            createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date in past year
          });
        });
      }
      return all;
    }
  } catch (error) {
    console.error("Error loading testimonials.json:", error);
  }
  return [];
}

const SAMPLE_TESTIMONIALS = [
  {
    name: "Eleanor Rigby",
    rating: 5,
    review:
      "WanderLust made our honeymoon in the Maldives magical. Every detail was flawless!",
    destination: "Maldives",
    date: "2 days ago",
  },
  {
    name: "Arthur Penhaligon",
    rating: 5,
    review:
      "Their Patagonia trekking expedition was meticulously planned and breathtaking.",
    destination: "Patagonia",
    date: "1 week ago",
  },
  {
    name: "Sophia Chen",
    rating: 5,
    review:
      "My solo Southeast Asia journey felt safe and immersive thanks to WanderLust.",
    destination: "Southeast Asia",
    date: "2 weeks ago",
  },
  {
    name: "Marcus Thorne",
    rating: 4,
    review:
      "The family vacation to Disney World was flawless. Kids still talk about it!",
    destination: "Orlando, USA",
    date: "1 month ago",
  },
];

// ====================================
// MIDDLEWARE
// ====================================

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    // For API routes, return JSON error; for web routes, redirect
    if (req.path.startsWith("/api/")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }
    res.redirect("/auth");
  }
};

// Admin middleware
const isAdmin = (req, res, next) => {
  // First check if user is authenticated
  if (!req.session.userId || !req.session.user) {
    if (req.path.startsWith("/api/")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }
    return res.redirect("/auth");
  }

  // Then check if user is admin
  if (req.session.user.role === "admin") {
    next();
  } else {
    // For API routes, return JSON error; for web routes, redirect
    if (req.path.startsWith("/api/")) {
      return res.status(403).json({
        success: false,
        message: "Admin access required. Your role: " + (req.session.user.role || "none"),
      });
    }
    res.status(403).render("error", {
      title: "Access Denied - WanderLust",
      error: "You do not have permission to access this page",
      isAuthenticated: !!req.session.userId,
      user: req.session.user,
    });
  }
};

// ====================================
// ROUTES
// ====================================

// Helper function to generate structured data
function generateStructuredData(type, data) {
  const baseUrl = process.env.SITE_URL || `http://localhost:${PORT}`;
  
  if (type === "organization") {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      "name": "WanderLust Travel Agency",
      "description": "Your trusted partner for unforgettable travel experiences",
      "url": baseUrl,
      "logo": `${baseUrl}/images/logo.png`,
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-234-567-8900",
        "contactType": "customer service",
        "email": "info@wanderlust.com"
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "US"
      }
    });
  }
  
  if (type === "website") {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "WanderLust Travel Agency",
      "url": baseUrl,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${baseUrl}/destinations?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    });
  }
  
  return null;
}

// Home page
app.get("/", (req, res) => {
  const baseUrl = process.env.SITE_URL || `http://localhost:${PORT}`;
  const structuredData = generateStructuredData("website");
  
  res.render("index", {
    title: "WanderLust - See the World, Live the Adventure",
    page: "home",
    isAuthenticated: !!req.session.userId,
    user: req.session.user,
    metaDescription: "Explore breathtaking destinations and create unforgettable memories with WanderLust Travel Agency. Book your dream vacation today!",
    metaKeywords: "travel, vacation, booking, destinations, tours, travel agency",
    ogTitle: "WanderLust - See the World, Live the Adventure",
    ogDescription: "Explore breathtaking destinations and create unforgettable memories",
    ogImage: `${baseUrl}/images/hero-maldives.jpg`,
    ogUrl: baseUrl,
    structuredData: structuredData,
    mapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "",
  });
});

// Destinations page
app.get("/destinations", (req, res) => {
  const baseUrl = process.env.SITE_URL || `http://localhost:${PORT}`;
  res.render("destinations", {
    title: "Destinations - WanderLust Travel Agency",
    page: "destinations",
    isAuthenticated: !!req.session.userId,
    user: req.session.user,
    metaDescription: "Explore 24 handpicked destinations around the world. From tropical beaches to mountain peaks, find your perfect travel destination.",
    metaKeywords: "destinations, travel destinations, vacation spots, world travel, tourist destinations",
    ogTitle: "Discover Your Next Adventure - WanderLust Destinations",
    ogDescription: "24 handpicked destinations around the world waiting to be explored",
    ogImage: `${baseUrl}/images/destinations-hero.jpg`,
    ogUrl: `${baseUrl}/destinations`,
    mapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "",
  });
});

// About page
app.get("/about", (req, res) => {
  const baseUrl = process.env.SITE_URL || `http://localhost:${PORT}`;
  const structuredData = generateStructuredData("organization");
  res.render("about", {
    title: "About Us - WanderLust Travel Agency",
    page: "about",
    isAuthenticated: !!req.session.userId,
    user: req.session.user,
    metaDescription: "Learn about WanderLust Travel Agency - Crafting unforgettable journeys for over 15 years. Meet our team and discover our mission.",
    metaKeywords: "about us, travel agency, company history, team, mission",
    ogTitle: "About WanderLust - Your Trusted Travel Partner",
    ogDescription: "Crafting unforgettable journeys for over 15 years",
    ogImage: `${baseUrl}/images/about-hero.jpg`,
    ogUrl: `${baseUrl}/about`,
    structuredData: structuredData,
  });
});

// Contact page
app.get("/contact", (req, res) => {
  const baseUrl = process.env.SITE_URL || `http://localhost:${PORT}`;
  res.render("contact", {
    title: "Contact Us - WanderLust Travel Agency",
    page: "contact",
    isAuthenticated: !!req.session.userId,
    user: req.session.user,
    metaDescription: "Get in touch with WanderLust Travel Agency. We're here to help you plan your perfect vacation. Contact us today!",
    metaKeywords: "contact, travel agency contact, customer service, support",
    ogTitle: "Contact WanderLust - We're Here to Help",
    ogDescription: "Get in touch with us to plan your perfect vacation",
    ogImage: `${baseUrl}/images/contact-hero.jpg`,
    ogUrl: `${baseUrl}/contact`,
  });
});

// Testimonials page
app.get("/testimonials", (req, res) => {
  res.render("testimonials", {
    title: "Testimonials - WanderLust",
    page: "testimonials",
    isAuthenticated: !!req.session.userId,
    user: req.session.user,
  });
});

// Auth page
app.get("/auth", (req, res) => {
  if (req.session.userId) {
    return res.redirect("/dashboard");
  }
  res.render("auth", {
    title: "Login - WanderLust",
    page: "auth",
    isAuthenticated: false,
  });
});

// Booking page
app.get("/booking", (req, res) => {
  res.render("booking", {
    title: "Book Your Trip - WanderLust",
    page: "booking",
    isAuthenticated: !!req.session.userId,
    user: req.session.user,
  });
});

// Payment page
app.get("/payment", isAuthenticated, (req, res) => {
  const bookingId = req.query.bookingId;
  if (!bookingId) {
    return res.redirect("/dashboard");
  }
  res.render("payment", {
    title: "Complete Payment - WanderLust",
    page: "payment",
    isAuthenticated: true,
    user: req.session.user,
    bookingId,
  });
});

// Dashboard page
app.get("/dashboard", isAuthenticated, async (req, res) => {
  try {
    let bookings = [];

    if (mongoConnected) {
      bookings = await Booking.find({ userId: req.session.userId })
        .sort({ createdAt: -1 })
        .limit(10);
    }

    res.render("dashboard", {
      title: "Dashboard - WanderLust",
      page: "dashboard",
      isAuthenticated: true,
      user: req.session.user,
      bookings,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.render("error", {
      title: "Error - WanderLust",
      error: "Failed to load dashboard",
    });
  }
});

// Refresh user session (to update role if changed in database)
app.get("/api/auth/refresh", isAuthenticated, async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
      });
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update session with latest user data
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || "user",
    };

    res.json({
      success: true,
      message: "Session refreshed",
      user: req.session.user,
    });
  } catch (error) {
    console.error("Refresh session error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to refresh session",
    });
  }
});

// Admin Dashboard page
app.get("/admin", isAuthenticated, isAdmin, async (req, res) => {
  try {
    let stats = {
      totalBookings: 0,
      pendingBookings: 0,
      approvedBookings: 0,
      rejectedBookings: 0,
      totalUsers: 0,
    };

    if (mongoConnected) {
      stats.totalBookings = await Booking.countDocuments();
      stats.pendingBookings = await Booking.countDocuments({ status: "pending" });
      stats.approvedBookings = await Booking.countDocuments({ status: "approved" });
      stats.rejectedBookings = await Booking.countDocuments({ status: "rejected" });
      stats.totalUsers = await User.countDocuments({ role: "user" });
    }

    res.render("admin", {
      title: "Admin Dashboard - WanderLust",
      page: "admin",
      isAuthenticated: true,
      user: req.session.user,
      stats,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.render("error", {
      title: "Error - WanderLust",
      error: "Failed to load admin dashboard",
      isAuthenticated: true,
      user: req.session.user,
    });
  }
});

// ====================================
// API ROUTES
// ====================================

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: "Database not available. Please try again later.",
      });
    }

    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get device information
    const deviceFingerprint = getDeviceFingerprint(req);
    const registeredIP = getClientIP(req);
    const registeredUserAgent = getUserAgent(req);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      deviceFingerprint,
      registeredIP,
      registeredUserAgent,
    });

    await user.save();
    
    console.log("✅ User registered and saved to database:");
    console.log("   User ID:", user._id);
    console.log("   Name:", user.name);
    console.log("   Email:", user.email);
    console.log("   Role:", user.role || "user");
    console.log("   Created At:", user.createdAt);
    
    // Verify it was saved
    const savedUser = await User.findById(user._id);
    if (savedUser) {
      console.log("✅ Verified: User exists in database");
    } else {
      console.error("❌ Warning: User not found after save!");
    }

    // Set session
    req.session.userId = user._id;
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || "user",
    };

    res.json({
      success: true,
      message: "Registration successful",
      user: {
        name: user.name,
        email: user.email,
        role: user.role || "user",
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: "Database not available. Please try again later.",
      });
    }

    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Device-based security: Check if device matches registration device (only for network devices, not localhost)
    if (!isLocalhost(req)) {
      const currentDeviceFingerprint = getDeviceFingerprint(req);
      if (user.deviceFingerprint && user.deviceFingerprint !== currentDeviceFingerprint) {
        return res.status(403).json({
          success: false,
          message: "Security: This account can only be accessed from the device it was registered on. Please use the original device or contact support.",
        });
      }
    }

    // Set session - IMPORTANT: Fetch role from database
    req.session.userId = user._id;
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || "user", // Ensure role is included
    };

    console.log("✅ Login successful:");
    console.log("   User ID:", user._id);
    console.log("   Name:", user.name);
    console.log("   Email:", user.email);
    console.log("   Role:", user.role || "user");
    console.log("   User loaded from database:", !!user);

    res.json({
      success: true,
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        role: user.role || "user",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
});

// Logout
app.post("/api/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }
    res.json({
      success: true,
      message: "Logout successful",
    });
  });
});

// Get available accounts for switching (returns existing accounts from database)
app.get("/api/auth/accounts", isAuthenticated, async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
      });
    }

    const accounts = [];
    
    // Add current user
    const currentUser = await User.findById(req.session.userId);
    if (currentUser) {
      accounts.push({
        id: currentUser._id.toString(),
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role || "user",
        isCurrent: true,
      });
    }

    // Get admin account (if exists and not current user)
    const adminUser = await User.findOne({ role: "admin" });
    if (adminUser && adminUser._id.toString() !== req.session.userId.toString()) {
      accounts.push({
        id: adminUser._id.toString(),
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role || "user",
        isCurrent: false,
      });
    }

    // Get other regular users (not current user, not admin)
    // For localhost: show all accounts
    // For network devices: only show accounts from same device
    let otherUsersQuery = {
      _id: { $ne: req.session.userId },
      role: { $ne: "admin" },
    };
    
    // If not localhost, restrict to same device
    if (!isLocalhost(req)) {
      const currentDeviceFingerprint = getDeviceFingerprint(req);
      otherUsersQuery.deviceFingerprint = currentDeviceFingerprint;
    }
    
    const otherUsers = await User.find(otherUsersQuery)
      .limit(10)
      .select("name email role");

    otherUsers.forEach(user => {
      accounts.push({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role || "user",
        isCurrent: false,
      });
    });

    // Return all available accounts (no limit, no sample creation)
    res.json({
      success: true,
      accounts: accounts,
    });
  } catch (error) {
    console.error("Get accounts error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve accounts",
    });
  }
});

// Switch to another account
app.post("/api/auth/switch/:accountId", isAuthenticated, async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
      });
    }

    const targetUserId = req.params.accountId;

    // Find the target user
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    // Device-based security: Check if device matches registration device (only for network devices, not localhost)
    if (!isLocalhost(req)) {
      const currentDeviceFingerprint = getDeviceFingerprint(req);
      if (targetUser.deviceFingerprint && targetUser.deviceFingerprint !== currentDeviceFingerprint) {
        return res.status(403).json({
          success: false,
          message: "Security: This account can only be accessed from the device it was registered on. Please use the original device or contact support.",
        });
      }
    }

    // Update session to switch to target user
    req.session.userId = targetUser._id;
    req.session.user = {
      id: targetUser._id,
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role || "user",
    };

    console.log("✅ Account switched:");
    console.log("   From:", req.session.user?.email || "Unknown");
    console.log("   To:", targetUser.email);
    console.log("   Role:", targetUser.role || "user");

    res.json({
      success: true,
      message: "Account switched successfully",
      user: req.session.user,
    });
  } catch (error) {
    console.error("Switch account error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to switch account",
    });
  }
});

// Create booking - FIXED VERSION
app.post("/api/bookings", async (req, res) => {
  try {
    console.log("📝 Booking request received:", req.body);
    console.log("📝 MongoDB Connected:", mongoConnected);

    // Validate required fields
    const requiredFields = [
      "destination",
      "checkIn",
      "checkOut",
      "adults",
      "firstName",
      "lastName",
      "email",
      "phone",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // If MongoDB is not connected, log and return success message
    if (!mongoConnected) {
      console.log("⚠️  Booking logged (no database):", req.body);
      return res.json({
        success: true,
        message:
          "Booking received successfully! (Database temporarily unavailable - your booking has been logged)",
        booking: {
          ...req.body,
          id: Date.now(),
          status: "pending",
          createdAt: new Date(),
        },
      });
    }

    // Create booking in database
    const bookingData = {
      ...req.body,
      userId: req.session.userId || null,
      status: "pending",
      createdAt: new Date(),
    };

    const booking = new Booking(bookingData);
    await booking.save();

    console.log("✅ Booking saved to database:");
    console.log("   Booking ID:", booking._id);
    console.log("   Destination:", booking.destination);
    console.log("   Status:", booking.status);
    console.log("   User ID:", booking.userId || "Guest");
    console.log("   Created At:", booking.createdAt);
    
    // Verify it was saved by reading it back
    const savedBooking = await Booking.findById(booking._id);
    if (savedBooking) {
      console.log("✅ Verified: Booking exists in database");
    } else {
      console.error("❌ Warning: Booking not found after save!");
    }

    // Create notification for booking confirmation
    if (req.session.userId && mongoConnected) {
      try {
        const notification = new Notification({
          user: req.session.userId,
          type: "booking_confirmed",
          title: "Booking Confirmed!",
          message: `Your booking to ${bookingData.destination} has been confirmed. Check-in: ${new Date(bookingData.checkIn).toLocaleDateString()}`,
          relatedBooking: booking._id,
          link: "/dashboard",
          priority: "high",
        });
        await notification.save();
      } catch (notifError) {
        console.error("Failed to create notification:", notifError);
        // Don't fail the booking if notification fails
      }
    }

    res.json({
      success: true,
      message: "Booking created successfully!",
      booking: {
        id: booking._id,
        ...bookingData,
      },
    });
  } catch (error) {
    console.error("❌ Booking error:", error);

    // Return detailed error for debugging
    res.status(500).json({
      success: false,
      message: "Failed to create booking. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get user bookings
app.get("/api/bookings", isAuthenticated, async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.json({
        success: true,
        bookings: [],
        message: "Database not connected",
      });
    }

    console.log("📖 Fetching bookings for user:", req.session.userId);
    const bookings = await Booking.find({ userId: req.session.userId }).sort({
      createdAt: -1,
    });

    console.log(`✅ Found ${bookings.length} bookings in database`);
    bookings.forEach((booking, index) => {
      console.log(`   ${index + 1}. ${booking.destination} - ${booking.status} (ID: ${booking._id})`);
    });

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve bookings",
    });
  }
});

// Get single booking
app.get("/api/bookings/:id", isAuthenticated, async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
      });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.session.userId,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve booking",
    });
  }
});

// Update booking
app.put("/api/bookings/:id", isAuthenticated, async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
      });
    }

    // Find booking and verify ownership
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.session.userId,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Validate required fields
    const { destination, checkIn, checkOut, adults } = req.body;
    if (!destination || !checkIn || !checkOut || !adults || adults < 1) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields or invalid data",
      });
    }

    // Update booking
    booking.destination = req.body.destination;
    booking.checkIn = new Date(req.body.checkIn);
    booking.checkOut = new Date(req.body.checkOut);
    booking.adults = parseInt(req.body.adults) || 1;
    booking.children = parseInt(req.body.children) || 0;
    booking.infants = parseInt(req.body.infants) || 0;

    await booking.save();

    res.json({
      success: true,
      message: "Booking updated successfully",
      booking,
    });
  } catch (error) {
    console.error("Update booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update booking",
    });
  }
});

// Delete/Cancel booking
app.delete("/api/bookings/:id", isAuthenticated, async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
      });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.session.userId,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Update status to cancelled instead of deleting
    booking.status = "cancelled";
    await booking.save();

    res.json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
    });
  }
});

// Contact form submission
app.post("/api/contact", async (req, res) => {
  try {
    console.log("Contact form received:", req.body);

    // Here you would typically send an email or save to database
    res.json({
      success: true,
      message: "Thank you for contacting us! We will get back to you soon.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again.",
    });
  }
});

// ====================================
// ERROR HANDLING (MOVED TO END - AFTER ALL ROUTES)
// ====================================
// Note: Error handlers are now at the very end of the file, after admin routes

// ====================================
// WISHLIST ROUTES
// ====================================

// Add to wishlist
app.post("/api/wishlist", isAuthenticated, async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
      });
    }

    const { destination, notes, priority, targetDate, budget } = req.body;

    const wishlistItem = new Wishlist({
      user: req.session.userId,
      destination,
      notes,
      priority: priority || "medium",
      targetDate,
      budget,
    });

    await wishlistItem.save();
    res.json({ success: true, wishlistItem });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "This destination is already in your wishlist",
      });
    }
    console.error("Wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add to wishlist",
    });
  }
});

// Get user's wishlist
app.get("/api/wishlist", isAuthenticated, async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.json({ success: true, wishlist: [] });
    }

    const wishlist = await Wishlist.find({ user: req.session.userId }).sort({
      createdAt: -1,
    });

    res.json({ success: true, wishlist });
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve wishlist",
    });
  }
});

// Remove from wishlist
app.delete("/api/wishlist/:id", isAuthenticated, async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
      });
    }

    const wishlistItem = await Wishlist.findOneAndDelete({
      _id: req.params.id,
      user: req.session.userId,
    });

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    res.json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    console.error("Delete wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove from wishlist",
    });
  }
});

// ====================================
// NOTIFICATION ROUTES
// ====================================

// Get user's notifications
app.get("/api/notifications", isAuthenticated, async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.json({ success: true, notifications: [], unreadCount: 0 });
    }

    const { unreadOnly } = req.query;
    const query = { user: req.session.userId };
    if (unreadOnly === "true") query.isRead = false;

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      user: req.session.userId,
      isRead: false,
    });

    res.json({ success: true, notifications, unreadCount });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve notifications",
    });
  }
});

// Mark notification as read
app.put("/api/notifications/:id/read", isAuthenticated, async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
      });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.session.userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({ success: true, notification });
  } catch (error) {
    console.error("Mark notification read error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update notification",
    });
  }
});

// Mark all notifications as read
app.post("/api/notifications/mark-all-read", isAuthenticated, async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
      });
    }

    await Notification.updateMany(
      { user: req.session.userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark all read error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update notifications",
    });
  }
});

// ====================================
// USER PROFILE ROUTES
// ====================================

// Get user profile
app.get("/api/profile", isAuthenticated, async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
      });
    }

    let profile = await UserProfile.findOne({ user: req.session.userId }).populate(
      "user",
      "name email"
    );

    if (!profile) {
      // Create default profile if doesn't exist
      profile = new UserProfile({ user: req.session.userId });
      await profile.save();
    }

    res.json({ success: true, profile });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve profile",
    });
  }
});

// Update user profile
app.put("/api/profile", isAuthenticated, async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
      });
    }

    const profile = await UserProfile.findOneAndUpdate(
      { user: req.session.userId },
      req.body,
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ success: true, profile });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
});

// ====================================
// PAYMENT ROUTES
// ====================================

// Create payment (hollow payment gateway - just stores data)
app.post("/api/payments", isAuthenticated, async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
      });
    }

    const { bookingId, amount, paymentMethod, paymentDetails } = req.body;

    // Validate booking exists and belongs to user
    const booking = await Booking.findOne({
      _id: bookingId,
      userId: req.session.userId,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if booking is approved
    if (booking.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Booking must be approved before payment",
      });
    }

    // Check if payment already exists for this booking
    const existingPayment = await Payment.findOne({ booking: bookingId });
    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: "Payment already exists for this booking",
        payment: existingPayment,
      });
    }

    // Generate transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create payment with pending status (waiting for admin approval)
    const payment = new Payment({
      booking: bookingId,
      user: req.session.userId,
      amount,
      paymentMethod,
      paymentDetails,
      transactionId,
      paymentStatus: "pending", // Changed to pending - needs admin approval
      paymentDate: new Date(),
    });

    await payment.save();

    console.log("💳 Payment submitted (pending approval):");
    console.log("   Payment ID:", payment._id);
    console.log("   Transaction ID:", transactionId);
    console.log("   Amount: $", amount);
    console.log("   Method:", paymentMethod);
    console.log("   Status: pending (awaiting admin approval)");

    // Create notification for user
    try {
      const notification = new Notification({
        user: req.session.userId,
        type: "payment_submitted",
        title: "Payment Submitted",
        message: `Payment of $${amount} for booking to ${booking.destination} has been submitted and is pending admin approval.`,
        relatedBooking: bookingId,
        link: "/dashboard",
      });
      await notification.save();
    } catch (notifError) {
      console.error("Failed to create payment notification:", notifError);
    }

    res.json({ 
      success: true, 
      message: "Payment submitted successfully. Waiting for admin approval.",
      payment 
    });
  } catch (error) {
    console.error("Create payment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process payment",
    });
  }
});

// Get user's payment history
app.get("/api/payments", isAuthenticated, async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.json({ success: true, payments: [] });
    }

    const payments = await Payment.find({ user: req.session.userId })
      .populate("booking")
      .sort({ createdAt: -1 });

    res.json({ success: true, payments });
  } catch (error) {
    console.error("Get payments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve payments",
    });
  }
});

// Get payment by booking ID
app.get("/api/payments/booking/:bookingId", isAuthenticated, async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
      });
    }

    const payment = await Payment.findOne({
      booking: req.params.bookingId,
      user: req.session.userId,
    }).populate("booking");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.json({ success: true, payment });
  } catch (error) {
    console.error("Get payment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve payment",
    });
  }
});

// ====================================
// TRAVEL PACKAGES ROUTES
// ====================================

// Get all travel packages
app.get("/api/packages", async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.json({ success: true, packages: [] });
    }

    const { destination, category, minPrice, maxPrice, featured } = req.query;

    const query = { isActive: true };
    if (destination) query.destination = destination;
    if (category) query.category = category;
    if (featured === "true") query.isFeatured = true;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const packages = await TravelPackage.find(query).sort({
      isFeatured: -1,
      createdAt: -1,
    });

    res.json({ success: true, packages });
  } catch (error) {
    console.error("Get packages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve packages",
    });
  }
});

// Get single package
app.get("/api/packages/:id", async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
      });
    }

    const package = await TravelPackage.findById(req.params.id);

    if (!package || !package.isActive) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    res.json({ success: true, package });
  } catch (error) {
    console.error("Get package error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve package",
    });
  }
});

// Testimonials API
app.get("/api/testimonials", async (req, res) => {
  try {
    const allTestimonials = [];

    // Load from JSON file
    const jsonTestimonials = loadTestimonialsFromJSON();
    jsonTestimonials.forEach(t => {
      allTestimonials.push({
        id: `json-${Date.now()}-${Math.random()}`,
        name: t.name || "Happy Traveler",
        destination: t.destination || "Worldwide Adventure",
        rating: t.rating || 5,
        review: t.review || "",
        createdAt: t.createdAt || new Date(),
        avatar: t.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(
          t.name || "Happy Traveler"
        )}&background=2563eb&color=fff`,
        source: 'json',
      });
    });

    // Load from database if connected (optimized query)
    if (mongoConnected) {
      const dbTestimonials = await Testimonial.find({ status: "approved" })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean() // Use lean() for better performance
        .exec(); // Explicitly execute query

      dbTestimonials.forEach((testimonial) => {
        allTestimonials.push({
          id: testimonial._id.toString(),
          name: testimonial.name || "Happy Traveler",
          destination: testimonial.destination || "Worldwide Adventure",
          rating: testimonial.rating,
          review: testimonial.review,
          createdAt: testimonial.createdAt,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            testimonial.name || "Happy Traveler"
          )}&background=2563eb&color=fff`,
          source: 'database',
        });
      });
    } else {
      // Fallback to sample data if no database
      SAMPLE_TESTIMONIALS.forEach(t => {
        allTestimonials.push({
          ...t,
          id: `sample-${Date.now()}-${Math.random()}`,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            t.name || "Happy Traveler"
          )}&background=2563eb&color=fff`,
          source: 'sample',
        });
      });
    }

    // Sort by creation date (newest first)
    allTestimonials.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ success: true, testimonials: allTestimonials });
  } catch (error) {
    console.error("Get testimonials error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load testimonials",
    });
  }
});

app.post("/api/testimonials", isAuthenticated, async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: "Database connection required to submit testimonials",
      });
    }

    const { rating, review, destination } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5 stars",
      });
    }

    if (!review || review.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: "Please write at least 20 characters about your experience",
      });
    }

    const testimonial = await Testimonial.create({
      user: req.session.userId,
      name: req.session.user?.name || "WanderLust Traveler",
      email: req.session.user?.email,
      destination: destination?.trim(),
      rating,
      review: review.trim(),
      status: "pending", // Changed to pending for admin approval
    });

    res.json({
      success: true,
      message: "Thank you for sharing your experience!",
      testimonial: {
        id: testimonial._id,
        name: testimonial.name,
        destination: testimonial.destination,
        rating: testimonial.rating,
        review: testimonial.review,
        createdAt: testimonial.createdAt,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          testimonial.name
        )}&background=2563eb&color=fff`,
      },
    });
  } catch (error) {
    console.error("Create testimonial error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit testimonial",
    });
  }
});

// ====================================
// ADMIN ROUTES
// ====================================

// Get all bookings (admin only) - MUST be before 404 handler
app.get("/api/admin/bookings", isAuthenticated, isAdmin, async (req, res) => {
  try {
    // Debug logging
    console.log("Admin bookings request - User:", req.session.user?.email, "Role:", req.session.user?.role);
    
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
      });
    }

    const { status, page = 1, limit = 50 } = req.query;
    const query = {};
    if (status && status !== "") {
      query.status = status;
    }

    // Get bookings - try with populate, fallback to simple query if it fails
    let bookings;
    try {
      bookings = await Booking.find(query)
        .populate("userId", "name email")
        .populate("approvedBy", "name email")
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .lean();
    } catch (populateError) {
      console.warn("Populate failed, using simple query:", populateError.message);
      // Fallback: get bookings without populate
      bookings = await Booking.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .lean();
    }

    const total = await Booking.countDocuments(query);

    // Transform bookings to ensure consistent structure
    const transformedBookings = bookings.map(booking => {
      const transformed = {
        ...booking,
        _id: booking._id ? booking._id.toString() : booking._id,
      };
      
      // Handle userId - could be ObjectId, populated object, or null
      if (booking.userId) {
        if (typeof booking.userId === 'object' && booking.userId._id) {
          // Populated user object
          transformed.userId = {
            _id: booking.userId._id.toString(),
            name: booking.userId.name,
            email: booking.userId.email,
          };
        } else if (typeof booking.userId === 'object' && booking.userId.toString) {
          // Just ObjectId
          transformed.userId = booking.userId.toString();
        } else {
          transformed.userId = booking.userId;
        }
      } else {
        transformed.userId = null;
      }
      
      // Handle approvedBy similarly
      if (booking.approvedBy) {
        if (typeof booking.approvedBy === 'object' && booking.approvedBy._id) {
          transformed.approvedBy = {
            _id: booking.approvedBy._id.toString(),
            name: booking.approvedBy.name,
            email: booking.approvedBy.email,
          };
        } else if (typeof booking.approvedBy === 'object' && booking.approvedBy.toString) {
          transformed.approvedBy = booking.approvedBy.toString();
        } else {
          transformed.approvedBy = booking.approvedBy;
        }
      } else {
        transformed.approvedBy = null;
      }
      
      return transformed;
    });

    res.json({
      success: true,
      bookings: transformedBookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get admin bookings error:", error);
    console.error("Error details:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve bookings",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Approve booking (admin only)
app.post("/api/admin/bookings/:id/approve", isAuthenticated, isAdmin, async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
      });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = "approved";
    booking.approvedBy = req.session.userId;
    booking.approvedAt = new Date();
    await booking.save();

    // Create notification for user
    if (booking.userId) {
      try {
        const notification = new Notification({
          user: booking.userId,
          type: "booking_approved",
          title: "Booking Approved!",
          message: `Your booking to ${booking.destination} has been approved. Check-in: ${new Date(booking.checkIn).toLocaleDateString()}`,
          relatedBooking: booking._id,
          link: "/dashboard",
          priority: "high",
        });
        await notification.save();
      } catch (notifError) {
        console.error("Failed to create notification:", notifError);
      }

      // Send confirmation email
      if (booking.email) {
        try {
          const emailHtml = generateBookingConfirmationEmail(booking);
          await sendEmail(
            booking.email,
            `Booking Confirmed - ${booking.destination}`,
            emailHtml
          );
        } catch (emailError) {
          console.error("Failed to send booking confirmation email:", emailError);
        }
      }
    }

    res.json({
      success: true,
      message: "Booking approved successfully",
      booking,
    });
  } catch (error) {
    console.error("Approve booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to approve booking",
    });
  }
});

// Reject booking (admin only)
app.post("/api/admin/bookings/:id/reject", isAuthenticated, isAdmin, async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
      });
    }

    const { reason } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = "rejected";
    booking.approvedBy = req.session.userId;
    booking.approvedAt = new Date();
    if (reason) booking.rejectionReason = reason;
    await booking.save();

    // Create notification for user
    if (booking.userId) {
      try {
        const notification = new Notification({
          user: booking.userId,
          type: "booking_rejected",
          title: "Booking Rejected",
          message: `Your booking to ${booking.destination} has been rejected.${reason ? ` Reason: ${reason}` : ""}`,
          relatedBooking: booking._id,
          link: "/dashboard",
          priority: "high",
        });
        await notification.save();
      } catch (notifError) {
        console.error("Failed to create notification:", notifError);
      }
    }

    res.json({
      success: true,
      message: "Booking rejected successfully",
      booking,
    });
  } catch (error) {
    console.error("Reject booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reject booking",
    });
  }
});

// Admin Testimonials Management
app.get("/api/admin/testimonials", isAuthenticated, isAdmin, async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
      });
    }

    const { status } = req.query;
    const query = {};
    if (status && status !== "") {
      query.status = status;
    }

    const testimonials = await Testimonial.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, testimonials });
  } catch (error) {
    console.error("Get admin testimonials error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve testimonials",
    });
  }
});

app.put("/api/admin/testimonials/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
      });
    }

    const { name, destination, rating, review, status } = req.body;
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    if (name) testimonial.name = name;
    if (destination !== undefined) testimonial.destination = destination;
    if (rating) testimonial.rating = rating;
    if (review) testimonial.review = review;
    if (status) testimonial.status = status;

    await testimonial.save();

    res.json({
      success: true,
      message: "Testimonial updated successfully",
      testimonial,
    });
  } catch (error) {
    console.error("Update testimonial error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update testimonial",
    });
  }
});

app.delete("/api/admin/testimonials/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
      });
    }

    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    res.json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    console.error("Delete testimonial error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete testimonial",
    });
  }
});

app.post("/api/admin/testimonials/:id/approve", isAuthenticated, isAdmin, async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
      });
    }

    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    testimonial.status = "approved";
    await testimonial.save();

    res.json({
      success: true,
      message: "Testimonial approved successfully",
      testimonial,
    });
  } catch (error) {
    console.error("Approve testimonial error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to approve testimonial",
    });
  }
});

app.post("/api/admin/testimonials/:id/reject", isAuthenticated, isAdmin, async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
      });
    }

    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    testimonial.status = "rejected";
    await testimonial.save();

    res.json({
      success: true,
      message: "Testimonial rejected successfully",
      testimonial,
    });
  } catch (error) {
    console.error("Reject testimonial error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reject testimonial",
    });
  }
});

// Get admin stats
app.get("/api/admin/stats", isAuthenticated, isAdmin, async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
      });
    }

    const stats = {
      totalBookings: await Booking.countDocuments(),
      pendingBookings: await Booking.countDocuments({ status: "pending" }),
      approvedBookings: await Booking.countDocuments({ status: "approved" }),
      rejectedBookings: await Booking.countDocuments({ status: "rejected" }),
      cancelledBookings: await Booking.countDocuments({ status: "cancelled" }),
      completedBookings: await Booking.countDocuments({ status: "completed" }),
      totalUsers: await User.countDocuments({ role: "user" }),
      totalAdmins: await User.countDocuments({ role: "admin" }),
      pendingPayments: await Payment.countDocuments({ paymentStatus: "pending" }),
      approvedPayments: await Payment.countDocuments({ paymentStatus: "approved" }),
      totalPayments: await Payment.countDocuments(),
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve stats",
    });
  }
});

// Get all payments (admin only)
app.get("/api/admin/payments", isAuthenticated, isAdmin, async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
      });
    }

    const { status, page = 1, limit = 50 } = req.query;
    const query = {};
    if (status && status !== "") {
      query.paymentStatus = status;
    }

    const payments = await Payment.find(query)
      .populate("user", "name email")
      .populate("booking", "destination checkIn checkOut")
      .populate("approvedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    const total = await Payment.countDocuments(query);

    res.json({
      success: true,
      payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get admin payments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve payments",
    });
  }
});

// Approve payment (admin only)
app.post("/api/admin/payments/:id/approve", isAuthenticated, isAdmin, async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
      });
    }

    const payment = await Payment.findById(req.params.id).populate("user booking");
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    payment.paymentStatus = "approved";
    payment.approvedBy = req.session.userId;
    payment.approvedAt = new Date();
    await payment.save();

    console.log("✅ Payment approved by admin:");
    console.log("   Payment ID:", payment._id);
    console.log("   Transaction ID:", payment.transactionId);
    console.log("   Amount: $", payment.amount);
    console.log("   Approved by:", req.session.user?.email);

    // Create notification for user
    if (payment.user) {
      try {
        const notification = new Notification({
          user: payment.user._id,
          type: "payment_approved",
          title: "Payment Approved!",
          message: `Your payment of $${payment.amount} for booking to ${payment.booking?.destination || "your booking"} has been approved.`,
          relatedBooking: payment.booking?._id,
          link: "/dashboard",
          priority: "high",
        });
        await notification.save();
      } catch (notifError) {
        console.error("Failed to create payment approval notification:", notifError);
      }

      // Send payment receipt email
      if (payment.user.email) {
        try {
          const emailHtml = generatePaymentReceiptEmail(payment);
          await sendEmail(
            payment.user.email,
            `Payment Receipt - Transaction ${payment.transactionId || payment._id}`,
            emailHtml
          );
        } catch (emailError) {
          console.error("Failed to send payment receipt email:", emailError);
        }
      }
    }

    res.json({
      success: true,
      message: "Payment approved successfully",
      payment,
    });
  } catch (error) {
    console.error("Approve payment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to approve payment",
    });
  }
});

// ====================================
// FILE UPLOAD ROUTES
// ====================================

// Upload profile picture
app.post("/api/upload/profile-picture", isAuthenticated, upload.single("profilePicture"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Convert to WebP if it's an image
    if (req.file.mimetype.startsWith("image/")) {
      const webpPath = req.file.path.replace(/\.[^/.]+$/, ".webp");
      await sharp(req.file.path)
        .webp({ quality: 80 })
        .toFile(webpPath);
      
      // Delete original if WebP conversion successful
      const fs = require("fs");
      fs.unlinkSync(req.file.path);
      req.file.path = webpPath;
      req.file.filename = req.file.filename.replace(/\.[^/.]+$/, ".webp");
    }

    // Update user profile with image URL
    const imageUrl = `/uploads/${req.file.filename}`;
    
    // Update user model
    await User.findByIdAndUpdate(req.session.userId, {
      profilePicture: imageUrl,
    });

    res.json({
      success: true,
      message: "Profile picture uploaded successfully",
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload file",
    });
  }
});

// Upload document
app.post("/api/upload/document", isAuthenticated, upload.single("document"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const documentUrl = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: "Document uploaded successfully",
      documentUrl: documentUrl,
      filename: req.file.originalname,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload document",
    });
  }
});

// ====================================
// SEO ROUTES
// ====================================

// Generate sitemap
app.get("/sitemap.xml", async (req, res) => {
  try {
    res.header("Content-Type", "application/xml");
    res.header("Content-Encoding", "gzip");

    const smStream = new SitemapStream({ hostname: process.env.SITE_URL || `http://localhost:${PORT}` });
    const pipeline = smStream.pipe(createGzip());

    // Add static pages
    smStream.write({ url: "/", changefreq: "daily", priority: 1.0 });
    smStream.write({ url: "/destinations", changefreq: "weekly", priority: 0.9 });
    smStream.write({ url: "/about", changefreq: "monthly", priority: 0.8 });
    smStream.write({ url: "/contact", changefreq: "monthly", priority: 0.7 });
    smStream.write({ url: "/testimonials", changefreq: "weekly", priority: 0.8 });
    smStream.write({ url: "/auth", changefreq: "monthly", priority: 0.5 });

    smStream.end();
    pipeline.pipe(res).on("error", (e) => {
      throw e;
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.status(500).send("Error generating sitemap");
  }
});

// Robots.txt
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(`User-agent: *
Allow: /
Sitemap: ${process.env.SITE_URL || `http://localhost:${PORT}`}/sitemap.xml
`);
});

// ====================================
// PERSONALIZATION ROUTES
// ====================================

// Get personalized recommendations
app.get("/api/recommendations", isAuthenticated, async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
      });
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get user's booking history
    const userBookings = await Booking.find({ userId: req.session.userId })
      .select("destination")
      .lean();

    // Get user's wishlist
    const Wishlist = require("./models/Wishlist");
    const wishlist = await Wishlist.find({ user: req.session.userId })
      .select("destination")
      .lean();

    // Analyze preferences
    const visitedDestinations = userBookings.map(b => b.destination);
    const wishlistDestinations = wishlist.map(w => w.destination);

    // Get recommendations based on similar destinations
    const TravelPackage = require("./models/TravelPackage");
    const recommendations = await TravelPackage.find({
      isActive: true,
      destination: { $nin: visitedDestinations },
    })
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(6)
      .lean();

    res.json({
      success: true,
      recommendations: recommendations,
      visitedDestinations: visitedDestinations,
      wishlistDestinations: wishlistDestinations,
    });
  } catch (error) {
    console.error("Get recommendations error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get recommendations",
    });
  }
});

// Save user preferences
app.post("/api/preferences", isAuthenticated, async (req, res) => {
  try {
    if (!mongoConnected) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
      });
    }

    const { travelStyle, budgetRange, preferredDestinations, interests } = req.body;

    let profile = await UserProfile.findOne({ user: req.session.userId });

    if (!profile) {
      profile = new UserProfile({
        user: req.session.userId,
        travelPreferences: {
          travelStyle,
          preferredDestinations: preferredDestinations || [],
          interests: interests || [],
        },
      });
    } else {
      if (travelStyle) profile.travelPreferences.travelStyle = travelStyle;
      if (preferredDestinations) profile.travelPreferences.preferredDestinations = preferredDestinations;
      if (interests) profile.travelPreferences.interests = interests;
    }

    await profile.save();

    res.json({
      success: true,
      message: "Preferences saved successfully",
      preferences: profile.travelPreferences,
    });
  } catch (error) {
    console.error("Save preferences error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save preferences",
    });
  }
});

// ====================================
// ERROR HANDLING (MUST BE LAST)
// ====================================

// 404 handler - MUST be after all routes
app.use((req, res) => {
  // For API routes, return JSON
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({
      success: false,
      message: "API endpoint not found: " + req.path,
    });
  }
  // For web routes, render 404 page
  res.status(404).render("404", {
    title: "404 - Page Not Found",
    isAuthenticated: !!req.session.userId,
    user: req.session.user,
  });
});

// Sentry Error Handler (must be before other error handlers)
if (Sentry) {
  app.use(Sentry.Handlers.errorHandler());
}

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  
  // Send to Sentry if configured
  if (Sentry) {
    Sentry.captureException(err);
  }
  
  // For API routes, return JSON error
  if (req.path.startsWith("/api/")) {
    return res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
    });
  }
  // For web routes, render error page
  res.status(500).render("error", {
    title: "Error - WanderLust",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
    isAuthenticated: !!req.session.userId,
    user: req.session.user,
  });
});

// ====================================
// START SERVER
// ====================================

const server = app.listen(PORT, HOST, () => {
  try {
    const networkInterfaces = os.networkInterfaces();
    let localIP = 'localhost';
    
    // Find local IP address
    if (networkInterfaces) {
      for (const interfaceName in networkInterfaces) {
        const interfaces = networkInterfaces[interfaceName];
        if (Array.isArray(interfaces)) {
          for (const iface of interfaces) {
            // Skip internal (loopback) and non-IPv4 addresses
            // Handle both 'IPv4' string and 4 number (Node.js version dependent)
            const isIPv4 = iface.family === 'IPv4' || iface.family === 4;
            if (isIPv4 && !iface.internal) {
              localIP = iface.address;
              break;
            }
          }
        }
        if (localIP !== 'localhost') break;
      }
    }
    
    console.log("\n🚀 ================================");
    console.log(`✅ Server running on:`);
    console.log(`   Local:   http://localhost:${PORT}`);
    if (localIP !== 'localhost') {
      console.log(`   Network: http://${localIP}:${PORT}`);
      console.log(`   Access from other devices using: http://${localIP}:${PORT}`);
    } else {
      console.log(`   Network: Not available (check network connection)`);
    }
    console.log(
      `📊 Database: ${mongoConnected ? "Connected ✅" : "Not Connected ⚠️"}`
    );
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log("================================\n");
  } catch (error) {
    // Fallback if network detection fails
    console.log("\n🚀 ================================");
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`⚠️  Could not detect network IP: ${error.message}`);
    console.log(
      `📊 Database: ${mongoConnected ? "Connected ✅" : "Not Connected ⚠️"}`
    );
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log("================================\n");
  }
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("💤 Server closed");
    mongoose.connection.close(false, () => {
      console.log("💤 MongoDB connection closed");
      process.exit(0);
    });
  });
});

process.on("SIGINT", () => {
  console.log("\n👋 SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("💤 Server closed");
    mongoose.connection.close(false, () => {
      console.log("💤 MongoDB connection closed");
      process.exit(0);
    });
  });
});
