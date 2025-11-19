const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: false, // We'll create a compound index instead
    },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "debit_card", "paypal", "bank_transfer", "cash"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "approved", "failed", "refunded"],
      default: "pending",
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    transactionId: { type: String, unique: true, sparse: true },
    paymentDate: { type: Date },
    refundAmount: { type: Number, default: 0 },
    refundDate: { type: Date },
    refundReason: { type: String },
    paymentDetails: {
      cardLast4: String,
      cardBrand: String,
      billingAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
      },
    },
    notes: { type: String },
  },
  { timestamps: true }
);

// Index for faster queries
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ booking: 1 });
// transactionId already has unique index from schema definition, no need for duplicate

module.exports = mongoose.model("Payment", paymentSchema);

