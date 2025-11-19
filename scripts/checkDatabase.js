// ====================================
// Database Check Script
// ====================================
// This script helps you verify if data is being stored in MongoDB

require("dotenv").config();
const mongoose = require("mongoose");

// Import models
const User = require("../models/User");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Notification = require("../models/Notification");

async function checkDatabase() {
  try {
    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      console.error("❌ MONGODB_URI not found in .env file");
      process.exit(1);
    }

    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Check Users
    const userCount = await User.countDocuments();
    console.log(`📊 Users in database: ${userCount}`);
    if (userCount > 0) {
      const users = await User.find().select("name email role createdAt").limit(5);
      console.log("   Recent users:");
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.email}) - Role: ${user.role || "user"} - Created: ${user.createdAt}`);
      });
    }

    // Check Bookings
    const bookingCount = await Booking.countDocuments();
    console.log(`\n📊 Bookings in database: ${bookingCount}`);
    if (bookingCount > 0) {
      const bookings = await Booking.find()
        .select("destination checkIn checkOut status createdAt")
        .sort({ createdAt: -1 })
        .limit(5);
      console.log("   Recent bookings:");
      bookings.forEach((booking, index) => {
        console.log(`   ${index + 1}. ${booking.destination} - Status: ${booking.status} - Check-in: ${new Date(booking.checkIn).toLocaleDateString()} - Created: ${booking.createdAt}`);
      });
    }

    // Check Payments
    try {
      const paymentCount = await Payment.countDocuments();
      console.log(`\n📊 Payments in database: ${paymentCount}`);
      if (paymentCount > 0) {
        const payments = await Payment.find()
          .select("amount paymentStatus createdAt")
          .sort({ createdAt: -1 })
          .limit(5);
        console.log("   Recent payments:");
        payments.forEach((payment, index) => {
          console.log(`   ${index + 1}. $${payment.amount} - Status: ${payment.paymentStatus} - Created: ${payment.createdAt}`);
        });
      }
    } catch (error) {
      console.log("\n⚠️  Could not check payments:", error.message);
    }

    // Check Notifications
    try {
      const notificationCount = await Notification.countDocuments();
      console.log(`\n📊 Notifications in database: ${notificationCount}`);
      if (notificationCount > 0) {
        const notifications = await Notification.find()
          .select("title type isRead createdAt")
          .sort({ createdAt: -1 })
          .limit(5);
        console.log("   Recent notifications:");
        notifications.forEach((notif, index) => {
          console.log(`   ${index + 1}. ${notif.title} (${notif.type}) - Read: ${notif.isRead} - Created: ${notif.createdAt}`);
        });
      }
    } catch (error) {
      console.log("\n⚠️  Could not check notifications:", error.message);
    }

    // Database connection info
    console.log("\n📡 Database Connection Info:");
    console.log(`   Database Name: ${mongoose.connection.name}`);
    console.log(`   Host: ${mongoose.connection.host}`);
    console.log(`   Port: ${mongoose.connection.port}`);
    console.log(`   Ready State: ${mongoose.connection.readyState === 1 ? "Connected ✅" : "Disconnected ❌"}`);

    await mongoose.connection.close();
    console.log("\n✅ Database check completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error checking database:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

checkDatabase();

