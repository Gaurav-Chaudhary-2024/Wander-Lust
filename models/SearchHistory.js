const mongoose = require("mongoose");

const searchHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    searchQuery: { type: String, required: true },
    destination: { type: String },
    filters: {
      priceRange: {
        min: Number,
        max: Number,
      },
      duration: Number,
      category: String,
      rating: Number,
    },
    resultsCount: { type: Number, default: 0 },
    clickedResult: { type: String }, // If user clicked on a result
    sessionId: { type: String }, // For anonymous users
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

// Indexes for analytics
searchHistorySchema.index({ user: 1, createdAt: -1 });
searchHistorySchema.index({ destination: 1, createdAt: -1 });
searchHistorySchema.index({ searchQuery: 1, createdAt: -1 });
searchHistorySchema.index({ createdAt: -1 });

module.exports = mongoose.model("SearchHistory", searchHistorySchema);

