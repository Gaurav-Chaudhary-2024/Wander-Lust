// ====================================
// Create Admin User Script
// ====================================

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

async function createAdmin() {
  try {
    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      console.error("❌ MONGODB_URI not found in .env file");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Get admin details from command line arguments or use defaults
    const args = process.argv.slice(2);
    const email = args[0] || "admin@wanderlust.com";
    const password = args[1] || "admin123";
    const name = args[2] || "Admin User";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email, role: "admin" });
    if (existingAdmin) {
      console.log("⚠️  Admin user already exists with this email:", email);
      console.log("   To create a new admin, use a different email.");
      await mongoose.connection.close();
      process.exit(0);
    }

    // Check if user exists (but not admin)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Update existing user to admin
      existingUser.role = "admin";
      await existingUser.save();
      console.log("✅ Updated existing user to admin:");
      console.log(`   Email: ${email}`);
      console.log(`   Name: ${existingUser.name}`);
      console.log(`   Role: ${existingUser.role}`);
    } else {
      // Create new admin user
      const admin = new User({
        name,
        email,
        password, // Will be hashed by pre-save hook
        role: "admin",
        isActive: true,
      });

      await admin.save();
      console.log("✅ Admin user created successfully:");
      console.log(`   Email: ${email}`);
      console.log(`   Name: ${name}`);
      console.log(`   Password: ${password}`);
      console.log(`   Role: ${admin.role}`);
    }

    console.log("\n📝 You can now login with these credentials.");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the script
createAdmin();

