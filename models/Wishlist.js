const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    destinationDetails: {
      name: String,
      description: String,
      price: Number,
      image: String,
    },
    notes: { type: String },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    targetDate: { type: Date },
    budget: { type: Number },
  },
  { timestamps: true }
);

// Ensure user can't add same destination twice
wishlistSchema.index({ user: 1, destination: 1 }, { unique: true });

module.exports = mongoose.model("Wishlist", wishlistSchema);

