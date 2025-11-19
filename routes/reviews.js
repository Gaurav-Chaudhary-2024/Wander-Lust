const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication required" });
  }
  next();
}

router.post("/", isAuthenticated, async (req, res) => {
  try {
    const review = new Review({ ...req.body, user: req.session.user.id });
    await review.save();
    await review.populate("user destination");
    res
      .status(201)
      .json({ success: true, message: "Review submitted", review });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to submit review" });
  }
});

router.get("/destination/:destinationId", async (req, res) => {
  try {
    const reviews = await Review.find({
      destination: req.params.destinationId,
      isApproved: true,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch reviews" });
  }
});

module.exports = router;
