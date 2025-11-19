const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    duration: { type: String, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    bestTime: { type: String, required: true },
    activities: [{ type: String }],
    images: [{ type: String }],
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

destinationSchema.methods.updateRating = async function () {
  const Review = mongoose.model("Review");
  const stats = await Review.aggregate([
    { $match: { destination: this._id, isApproved: true } },
    {
      $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } },
    },
  ]);
  if (stats.length > 0) {
    this.rating = Math.round(stats[0].avgRating * 10) / 10;
    this.totalReviews = stats[0].count;
  }
  await this.save();
};

module.exports = mongoose.model("Destination", destinationSchema);
