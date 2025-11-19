const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../models/User");
const Destination = require("../models/Destination");
const Review = require("../models/Review");

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/wanderlust")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  });

const users = [
  {
    name: "Admin User",
    email: "admin@wanderlust.com",
    password: "admin123",
    phone: "+1 (555) 000-0001",
    role: "admin",
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    phone: "+1 (555) 123-4567",
  },
  {
    name: "Sarah Johnson",
    email: "sarah@example.com",
    password: "password123",
    phone: "+1 (555) 234-5678",
  },
];

const destinations = [
  {
    name: "Maldives",
    city: "Malé",
    country: "Maldives",
    description:
      "Paradise islands with crystal clear waters and overwater bungalows",
    price: 2499,
    duration: "7 days",
    rating: 4.9,
    bestTime: "November - April",
    activities: ["Snorkeling", "Diving", "Spa", "Water Sports"],
    images: [
      "https://images.unsplash.com/photo-1717723548012-a36bda812962?w=800",
      "https://images.unsplash.com/photo-1627270074457-296814074bb6?w=800",
    ],
    featured: true,
    isActive: true,
  },
  {
    name: "Switzerland",
    city: "Zermatt",
    country: "Switzerland",
    description:
      "Breathtaking Alpine peaks and world-class skiing destinations",
    price: 1899,
    duration: "5 days",
    rating: 4.8,
    bestTime: "December - March, June - September",
    activities: ["Skiing", "Hiking", "Mountain Railways", "Photography"],
    images: [
      "https://images.unsplash.com/photo-1617256955938-598efba0ea5e?w=800",
    ],
    featured: true,
    isActive: true,
  },
  {
    name: "France",
    city: "Paris",
    country: "France",
    description:
      "The city of love with iconic landmarks and world-class cuisine",
    price: 1599,
    duration: "4 days",
    rating: 4.7,
    bestTime: "April - June, September - November",
    activities: ["Museums", "Fine Dining", "Architecture", "Shopping"],
    images: ["https://images.unsplash.com/photo-1553411702-525b1113475e?w=800"],
    featured: false,
    isActive: true,
  },
  {
    name: "Japan",
    city: "Tokyo",
    country: "Japan",
    description:
      "Modern metropolis blending traditional culture with cutting-edge technology",
    price: 2199,
    duration: "6 days",
    rating: 4.8,
    bestTime: "March - May, September - November",
    activities: [
      "Temple Visits",
      "Food Tours",
      "Cherry Blossoms",
      "Technology",
    ],
    images: [
      "https://images.unsplash.com/photo-1682949387184-2982a800908f?w=800",
    ],
    featured: true,
    isActive: true,
  },
  {
    name: "Greece",
    city: "Santorini",
    country: "Greece",
    description:
      "Stunning volcanic island with white-washed buildings and incredible sunsets",
    price: 1799,
    duration: "5 days",
    rating: 4.8,
    bestTime: "April - June, September - October",
    activities: [
      "Sunset Viewing",
      "Wine Tasting",
      "Beach Hopping",
      "Photography",
    ],
    images: [
      "https://images.unsplash.com/photo-1633909198480-85595aa21285?w=800",
    ],
    featured: false,
    isActive: true,
  },
];

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    await User.deleteMany({});
    await Destination.deleteMany({});
    await Review.deleteMany({});
    console.log("✅ Cleared existing data");

    const createdUsers = await User.create(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    const createdDestinations = await Destination.create(destinations);
    console.log(`✅ Created ${createdDestinations.length} destinations`);

    const reviews = [
      {
        user: createdUsers[1]._id,
        destination: createdDestinations[0]._id,
        rating: 5,
        title: "Amazing Paradise Experience!",
        comment:
          "The Maldives exceeded all expectations. Crystal clear waters, luxurious overwater bungalow!",
        isApproved: true,
        isFeatured: true,
      },
      {
        user: createdUsers[2]._id,
        destination: createdDestinations[1]._id,
        rating: 5,
        title: "Breathtaking Swiss Alps",
        comment:
          "Switzerland is absolutely stunning! The mountain views and ski facilities were unforgettable.",
        isApproved: true,
        isFeatured: true,
      },
    ];

    const createdReviews = await Review.create(reviews);
    console.log(`✅ Created ${createdReviews.length} reviews`);

    for (const destination of createdDestinations) {
      await destination.updateRating();
    }
    console.log("✅ Updated destination ratings");

    console.log("\n🎉 Database seeding completed!");
    console.log("\n📝 Sample Credentials:");
    console.log("Admin: admin@wanderlust.com / admin123");
    console.log("User: john@example.com / password123");
    console.log("User: sarah@example.com / password123");
  } catch (error) {
    console.error("❌ Seeding error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n✅ Database closed");
    process.exit(0);
  }
}

seedDatabase();
