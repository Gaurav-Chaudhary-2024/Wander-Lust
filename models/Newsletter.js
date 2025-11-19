const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    subscribedAt: { type: Date, default: Date.now },
    unsubscribedAt: { type: Date },
    unsubscribeToken: { type: String },
    preferences: {
      weeklyNewsletter: { type: Boolean, default: true },
      specialOffers: { type: Boolean, default: true },
      destinationUpdates: { type: Boolean, default: true },
    },
    source: { type: String }, // Where they subscribed from
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Index
newsletterSchema.index({ email: 1 });
newsletterSchema.index({ isActive: 1 });

module.exports = mongoose.model("Newsletter", newsletterSchema);

