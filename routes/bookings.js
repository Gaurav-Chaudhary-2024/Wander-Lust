const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

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
    const booking = new Booking({ ...req.body, user: req.session.user.id });
    await booking.save();
    await booking.populate("destination");
    res
      .status(201)
      .json({ success: true, message: "Booking created", booking });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to create booking" });
  }
});

router.get("/my-bookings", isAuthenticated, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.session.user.id })
      .populate("destination")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch bookings" });
  }
});

router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.session.user.id },
      { status: "cancelled" },
      { new: true }
    );
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }
    res.json({ success: true, message: "Booking cancelled", booking });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to cancel booking" });
  }
});

module.exports = router;
