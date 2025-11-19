const mongoose = require("mongoose");

const travelPackageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    destination: { type: String, required: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number }, // For discounts
    duration: { type: Number, required: true }, // Days
    durationUnit: { type: String, enum: ["days", "weeks"], default: "days" },
    maxTravelers: { type: Number, default: 50 },
    minTravelers: { type: Number, default: 1 },
    included: [{ type: String }], // What's included
    excluded: [{ type: String }], // What's not included
    itinerary: [
      {
        day: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String },
        activities: [{ type: String }],
      },
    ],
    images: [{ type: String }],
    highlights: [{ type: String }],
    category: {
      type: String,
      enum: [
        "adventure",
        "beach",
        "cultural",
        "family",
        "honeymoon",
        "luxury",
        "budget",
        "group",
      ],
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalBookings: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    startDate: { type: Date },
    endDate: { type: Date },
    bookingDeadline: { type: Date },
    cancellationPolicy: { type: String },
    termsAndConditions: { type: String },
  },
  { timestamps: true }
);

// Indexes
travelPackageSchema.index({ destination: 1, isActive: 1 });
travelPackageSchema.index({ isFeatured: 1, createdAt: -1 });
travelPackageSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model("TravelPackage", travelPackageSchema);

