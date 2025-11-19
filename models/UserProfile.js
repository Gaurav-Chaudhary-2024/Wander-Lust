const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    // Personal Information
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["male", "female", "other", "prefer_not_to_say"] },
    nationality: { type: String },
    passportNumber: { type: String },
    passportExpiry: { type: Date },
    
    // Contact Information
    phone: { type: String },
    alternateEmail: { type: String },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    
    // Emergency Contact
    emergencyContact: {
      name: { type: String },
      relationship: { type: String },
      phone: { type: String },
      email: { type: String },
    },
    
    // Travel Preferences
    travelPreferences: {
      preferredDestinations: [{ type: String }],
      travelStyle: {
        type: String,
        enum: ["budget", "mid-range", "luxury", "backpacker"],
      },
      interests: [{ type: String }], // e.g., ["beach", "mountains", "culture"]
      dietaryRequirements: [{ type: String }], // e.g., ["vegetarian", "vegan", "gluten-free"]
      accessibilityNeeds: [{ type: String }],
      preferredLanguage: { type: String, default: "English" },
    },
    
    // Travel History
    totalTrips: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    favoriteDestinations: [{ type: String }],
    
    // Preferences
    newsletterSubscribed: { type: Boolean, default: false },
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    marketingEmails: { type: Boolean, default: false },
    
    // Social
    avatar: { type: String },
    bio: { type: String, maxlength: 500 },
    
    // Loyalty/Rewards
    loyaltyPoints: { type: Number, default: 0 },
    membershipTier: {
      type: String,
      enum: ["bronze", "silver", "gold", "platinum"],
      default: "bronze",
    },
  },
  { timestamps: true }
);

// Index
userProfileSchema.index({ user: 1 });

module.exports = mongoose.model("UserProfile", userProfileSchema);

