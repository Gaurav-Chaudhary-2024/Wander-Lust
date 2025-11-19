const express = require("express");
const router = express.Router();
const Destination = require("../models/Destination");

router.get("/", async (req, res) => {
  try {
    const destinations = await Destination.find({ isActive: true });
    res.json({ success: true, destinations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, destination });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch" });
  }
});

module.exports = router;
