const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: { type: Number, required: true, min: 0 },
    minPurchaseAmount: { type: Number, default: 0 },
    maxDiscountAmount: { type: Number }, // For percentage discounts
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    usageLimit: { type: Number }, // Total times coupon can be used
    usageCount: { type: Number, default: 0 },
    userLimit: { type: Number, default: 1 }, // Times a single user can use
    applicableDestinations: [{ type: String }], // Empty = all destinations
    isActive: { type: Boolean, default: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Indexes
couponSchema.index({ code: 1 });
couponSchema.index({ validFrom: 1, validUntil: 1 });
couponSchema.index({ isActive: 1 });

// Method to check if coupon is valid
couponSchema.methods.isValid = function () {
  const now = new Date();
  return (
    this.isActive &&
    now >= this.validFrom &&
    now <= this.validUntil &&
    (!this.usageLimit || this.usageCount < this.usageLimit)
  );
};

module.exports = mongoose.model("Coupon", couponSchema);

