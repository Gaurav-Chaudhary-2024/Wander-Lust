# Example API Routes for New MongoDB Features

## 1. Payment Routes

```javascript
// POST /api/payments
// Create a payment for a booking
app.post("/api/payments", isAuthenticated, async (req, res) => {
  try {
    const { bookingId, amount, paymentMethod, paymentDetails } = req.body;
    
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.userId.toString() !== req.session.userId) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    
    const payment = new Payment({
      booking: bookingId,
      user: req.session.userId,
      amount,
      paymentMethod,
      paymentDetails,
      transactionId: generateTransactionId(),
    });
    
    await payment.save();
    
    // Update booking payment status
    booking.paymentStatus = "paid";
    await booking.save();
    
    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/payments
// Get user's payment history
app.get("/api/payments", isAuthenticated, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.session.userId })
      .populate("booking")
      .sort({ createdAt: -1 });
    
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

## 2. Wishlist Routes

```javascript
// POST /api/wishlist
// Add destination to wishlist
app.post("/api/wishlist", isAuthenticated, async (req, res) => {
  try {
    const { destination, notes, priority, targetDate, budget } = req.body;
    
    const wishlistItem = new Wishlist({
      user: req.session.userId,
      destination,
      notes,
      priority,
      targetDate,
      budget,
    });
    
    await wishlistItem.save();
    res.json({ success: true, wishlistItem });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Already in wishlist" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/wishlist
// Get user's wishlist
app.get("/api/wishlist", isAuthenticated, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.session.userId })
      .sort({ createdAt: -1 });
    
    res.json({ success: true, wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/wishlist/:id
// Remove from wishlist
app.delete("/api/wishlist/:id", isAuthenticated, async (req, res) => {
  try {
    const wishlistItem = await Wishlist.findOneAndDelete({
      _id: req.params.id,
      user: req.session.userId,
    });
    
    if (!wishlistItem) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    
    res.json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

## 3. Notification Routes

```javascript
// GET /api/notifications
// Get user's notifications
app.get("/api/notifications", isAuthenticated, async (req, res) => {
  try {
    const { unreadOnly = false } = req.query;
    
    const query = { user: req.session.userId };
    if (unreadOnly) query.isRead = false;
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50);
    
    const unreadCount = await Notification.countDocuments({
      user: req.session.userId,
      isRead: false,
    });
    
    res.json({ success: true, notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/notifications/:id/read
// Mark notification as read
app.put("/api/notifications/:id/read", isAuthenticated, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.session.userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    
    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/notifications/mark-all-read
// Mark all notifications as read
app.post("/api/notifications/mark-all-read", isAuthenticated, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.session.userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

## 4. Travel Package Routes

```javascript
// GET /api/packages
// Get all travel packages
app.get("/api/packages", async (req, res) => {
  try {
    const { destination, category, minPrice, maxPrice, featured } = req.query;
    
    const query = { isActive: true };
    if (destination) query.destination = destination;
    if (category) query.category = category;
    if (featured === "true") query.isFeatured = true;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    const packages = await TravelPackage.find(query)
      .sort({ isFeatured: -1, createdAt: -1 });
    
    res.json({ success: true, packages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/packages/:id
// Get single package
app.get("/api/packages/:id", async (req, res) => {
  try {
    const package = await TravelPackage.findById(req.params.id);
    
    if (!package || !package.isActive) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }
    
    res.json({ success: true, package });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

## 5. User Profile Routes

```javascript
// GET /api/profile
// Get user profile
app.get("/api/profile", isAuthenticated, async (req, res) => {
  try {
    let profile = await UserProfile.findOne({ user: req.session.userId })
      .populate("user", "name email");
    
    if (!profile) {
      // Create default profile if doesn't exist
      profile = new UserProfile({ user: req.session.userId });
      await profile.save();
    }
    
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/profile
// Update user profile
app.put("/api/profile", isAuthenticated, async (req, res) => {
  try {
    const profile = await UserProfile.findOneAndUpdate(
      { user: req.session.userId },
      req.body,
      { new: true, upsert: true }
    );
    
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

## 6. Newsletter Routes

```javascript
// POST /api/newsletter/subscribe
// Subscribe to newsletter
app.post("/api/newsletter/subscribe", async (req, res) => {
  try {
    const { email, name, preferences } = req.body;
    
    const subscription = await Newsletter.findOneAndUpdate(
      { email },
      {
        email,
        name,
        preferences: preferences || {},
        isActive: true,
        subscribedAt: new Date(),
        user: req.session?.userId,
      },
      { upsert: true, new: true }
    );
    
    res.json({ success: true, message: "Subscribed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/newsletter/unsubscribe
// Unsubscribe from newsletter
app.post("/api/newsletter/unsubscribe", async (req, res) => {
  try {
    const { email, token } = req.body;
    
    await Newsletter.findOneAndUpdate(
      { email, unsubscribeToken: token },
      { isActive: false, unsubscribedAt: new Date() }
    );
    
    res.json({ success: true, message: "Unsubscribed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

## 7. Coupon Routes

```javascript
// POST /api/coupons/validate
// Validate a coupon code
app.post("/api/coupons/validate", async (req, res) => {
  try {
    const { code, destination, amount } = req.body;
    
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    
    if (!coupon || !coupon.isValid()) {
      return res.status(400).json({ success: false, message: "Invalid coupon" });
    }
    
    // Check if applicable to destination
    if (coupon.applicableDestinations.length > 0 && 
        !coupon.applicableDestinations.includes(destination)) {
      return res.status(400).json({ 
        success: false, 
        message: "Coupon not applicable to this destination" 
      });
    }
    
    // Check minimum purchase
    if (amount < coupon.minPurchaseAmount) {
      return res.status(400).json({ 
        success: false, 
        message: `Minimum purchase of $${coupon.minPurchaseAmount} required` 
      });
    }
    
    // Calculate discount
    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (amount * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount) {
        discount = Math.min(discount, coupon.maxDiscountAmount);
      }
    } else {
      discount = coupon.discountValue;
    }
    
    res.json({ 
      success: true, 
      coupon: {
        code: coupon.code,
        discount,
        discountType: coupon.discountType,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

