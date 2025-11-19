# Database Verification Guide

This guide helps you verify that data entered by users is being stored and read from MongoDB.

## Quick Check Methods

### Method 1: Use the Check Database Script (Easiest)

Run this command to see all data in your database:

```bash
npm run check-db
```

This will show you:
- Total number of users, bookings, payments, and notifications
- Recent entries with details
- Database connection information

### Method 2: Check Server Console Logs

When data is saved or read, the server now logs detailed information:

**When a user registers:**
```
✅ User registered and saved to database:
   User ID: 507f1f77bcf86cd799439011
   Name: John Doe
   Email: john@example.com
   Role: user
   Created At: 2024-01-15T10:30:00.000Z
✅ Verified: User exists in database
```

**When a booking is created:**
```
📝 Booking request received: { destination: 'Paris', ... }
📝 MongoDB Connected: true
✅ Booking saved to database:
   Booking ID: 507f1f77bcf86cd799439012
   Destination: Paris
   Status: pending
   User ID: 507f1f77bcf86cd799439011
   Created At: 2024-01-15T10:35:00.000Z
✅ Verified: Booking exists in database
```

**When bookings are fetched:**
```
📖 Fetching bookings for user: 507f1f77bcf86cd799439011
✅ Found 3 bookings in database
   1. Paris - pending (ID: 507f1f77bcf86cd799439012)
   2. Maldives - approved (ID: 507f1f77bcf86cd799439013)
   3. Tokyo - pending (ID: 507f1f77bcf86cd799439014)
```

### Method 3: Use MongoDB Compass (Visual Tool)

1. **Download MongoDB Compass** (if not installed):
   - Visit: https://www.mongodb.com/try/download/compass
   - Install the application

2. **Connect to your database:**
   - Open MongoDB Compass
   - Paste your `MONGODB_URI` from `.env` file
   - Click "Connect"

3. **Browse your data:**
   - Click on your database name
   - You'll see collections: `users`, `bookings`, `payments`, `notifications`, etc.
   - Click on any collection to see the data
   - You can filter, sort, and search data

### Method 4: Use MongoDB Shell (Command Line)

If you have MongoDB installed locally or have shell access:

```bash
# Connect to MongoDB
mongosh "your-mongodb-uri"

# Or if using local MongoDB
mongosh

# Switch to your database
use wanderlust

# Count documents
db.users.countDocuments()
db.bookings.countDocuments()

# View all users
db.users.find().pretty()

# View all bookings
db.bookings.find().pretty()

# View recent bookings
db.bookings.find().sort({createdAt: -1}).limit(5).pretty()

# Find specific user
db.users.findOne({email: "admin@wanderlust.com"})

# Find bookings by status
db.bookings.find({status: "pending"}).pretty()
```

### Method 5: Check Database Connection Status

The server logs show connection status on startup:

```
🚀 ================================
✅ Server running on http://localhost:3001
📊 Database: Connected ✅
🌍 Environment: development
================================
```

If you see "Not Connected ⚠️", data won't be saved to MongoDB.

## Testing Data Storage

### Test 1: Create a User Account

1. Go to `/auth` page
2. Register a new account
3. Check server console - you should see:
   ```
   ✅ User registered and saved to database
   ✅ Verified: User exists in database
   ```
4. Run `npm run check-db` - you should see the new user

### Test 2: Create a Booking

1. Log in to your account
2. Go to `/booking` page
3. Fill out and submit a booking
4. Check server console - you should see:
   ```
   📝 Booking request received
   ✅ Booking saved to database
   ✅ Verified: Booking exists in database
   ```
5. Run `npm run check-db` - you should see the new booking

### Test 3: View Your Bookings

1. Go to `/dashboard`
2. Check server console - you should see:
   ```
   📖 Fetching bookings for user: [user-id]
   ✅ Found X bookings in database
   ```
3. The bookings should appear on your dashboard

## Troubleshooting

### Issue: "Database not connected"

**Check:**
1. Is `MONGODB_URI` set in your `.env` file?
2. Is the MongoDB URI correct?
3. Can you connect to MongoDB from another tool?

**Solution:**
- Verify your `.env` file has: `MONGODB_URI=your-connection-string`
- Test the connection string in MongoDB Compass
- Check if MongoDB service is running (if local)

### Issue: Data not appearing after save

**Check:**
1. Look at server console - do you see "✅ Verified: [item] exists in database"?
2. If not, there might be a save error

**Solution:**
- Check server console for error messages
- Verify the data model matches what you're trying to save
- Check if required fields are provided

### Issue: Can't read data

**Check:**
1. Is MongoDB connected? (Check startup logs)
2. Are you querying the correct collection?
3. Are filters correct? (e.g., userId matches)

**Solution:**
- Run `npm run check-db` to see if data exists
- Check server console for query logs
- Verify session/userId is correct

## Understanding the Logs

### Successful Save:
```
✅ [Item] saved to database
✅ Verified: [Item] exists in database
```
This means data was successfully written and verified.

### Successful Read:
```
📖 Fetching [items] for [criteria]
✅ Found X [items] in database
```
This means data was successfully read from the database.

### Error Indicators:
```
❌ [Error message]
⚠️  Warning message
```
These indicate problems that need attention.

## Best Practices

1. **Always check server console** when testing
2. **Use `npm run check-db`** regularly to verify data
3. **Use MongoDB Compass** for visual inspection
4. **Check logs** for "Verified" messages after saves
5. **Test with real data** to ensure everything works

## Quick Reference Commands

```bash
# Check database contents
npm run check-db

# Create admin user
npm run create-admin

# Seed database with sample data
npm run seed

# Start server (watch console for logs)
npm start

# Start server in development mode
npm run dev
```

