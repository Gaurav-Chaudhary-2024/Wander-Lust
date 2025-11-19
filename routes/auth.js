const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ success: false, message: "Email exists" });

    const user = new User({ name, email, password, phone });
    await user.save();

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    res.json({
      success: true,
      message: "Registration successful",
      user: req.session.user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, isActive: true });
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    res.json({
      success: true,
      message: "Login successful",
      user: req.session.user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res.status(500).json({ success: false, message: "Logout failed" });
    res.json({ success: true, message: "Logout successful" });
  });
});

module.exports = router;
