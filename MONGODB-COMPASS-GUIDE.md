# MongoDB Compass Guide - View Your Data

MongoDB Compass is a visual tool that lets you browse, query, and manage your MongoDB data with a user-friendly interface.

## Step 1: Get Your MongoDB Connection String

1. **Check your `.env` file** in the project root
2. Look for `MONGODB_URI` - it should look something like:
   ```
   MONGODB_URI=mongodb://localhost:27017/wanderlust
   ```
   or
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name
   ```

## Step 2: Open MongoDB Compass

1. Launch **MongoDB Compass** from your applications
2. You'll see a connection screen

## Step 3: Connect to Your Database

### Option A: If using Local MongoDB
1. In Compass, you'll see a connection string field
2. Enter: `mongodb://localhost:27017`
3. Click **"Connect"**
4. Select your database from the list (usually `wanderlust` or the name in your connection string)

### Option B: If using MongoDB Atlas (Cloud)
1. Copy your full connection string from `.env` file
2. Paste it into Compass connection field
3. Click **"Connect"**
4. You'll be connected to your cloud database

### Option C: Manual Connection
1. Click **"Fill in connection fields individually"**
2. Enter:
   - **Hostname**: `localhost` (or your server address)
   - **Port**: `27017` (default)
   - **Authentication**: If required, enter username/password
3. Click **"Connect"**

## Step 4: Browse Your Collections

Once connected, you'll see:

### Database Structure
```
📁 wanderlust (or your database name)
  📄 users          (collection)
  📄 bookings       (collection)
  📄 payments       (collection)
  📄 notifications  (collection)
  📄 sessions       (collection - for login sessions)
```

### View Data in a Collection

1. **Click on a collection** (e.g., `users`)
2. You'll see all documents in that collection
3. Each document shows as a JSON object

**Example - Users Collection:**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "password": "$2a$10$...",  // hashed password
  "createdAt": ISODate("2024-01-15T10:30:00.000Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00.000Z")
}
```

**Example - Bookings Collection:**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "userId": ObjectId("507f1f77bcf86cd799439011"),
  "destination": "Paris, France",
  "checkIn": ISODate("2024-02-01T00:00:00.000Z"),
  "checkOut": ISODate("2024-02-05T00:00:00.000Z"),
  "adults": 2,
  "children": 1,
  "infants": 0,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "status": "pending",
  "createdAt": ISODate("2024-01-15T10:35:00.000Z")
}
```

## Step 5: Useful Features in Compass

### Filter Data
1. Click the **"Filter"** button (funnel icon)
2. Enter a filter query, for example:
   ```json
   { "status": "pending" }
   ```
   This shows only pending bookings

### Sort Data
1. Click on any field header to sort
2. Click again to reverse sort order

### Search
1. Use the search bar at the top
2. Type any text to search across all fields

### View Document Details
1. Click on any document to expand it
2. See all fields and their values
3. Edit values directly (be careful!)

### Count Documents
- At the top of each collection, you'll see: **"X documents"**
- This shows how many records are in that collection

## Common Collections You'll See

### 1. `users` Collection
- All registered users
- Contains: name, email, password (hashed), role, timestamps

### 2. `bookings` Collection
- All travel bookings
- Contains: destination, dates, travelers, contact info, status

### 3. `payments` Collection
- Payment transactions
- Contains: amount, payment method, status, booking reference

### 4. `notifications` Collection
- User notifications
- Contains: title, message, type, read status

### 5. `sessions` Collection
- Active login sessions (if using MongoDB session store)
- Contains: session data, expiration time

## Tips for Using Compass

### ✅ Do's:
- **Browse and view** your data safely
- **Use filters** to find specific records
- **Export data** if needed (right-click collection → Export Collection)
- **Check document structure** to understand your data model

### ⚠️ Don'ts:
- **Don't delete** collections unless you know what you're doing
- **Don't modify** `_id` fields
- **Don't change** password hashes manually
- **Be careful** when editing documents directly

## Troubleshooting

### Can't Connect?

1. **Check if MongoDB is running:**
   - Local: Check if MongoDB service is running
   - Atlas: Check your internet connection

2. **Check connection string:**
   - Make sure it matches your `.env` file
   - For Atlas, ensure IP is whitelisted

3. **Authentication issues:**
   - Verify username/password
   - Check if database user has proper permissions

### Can't See Your Data?

1. **Check database name:**
   - Make sure you're looking at the correct database
   - Database name is usually in your connection string

2. **Check if data exists:**
   - Run `npm run check-db` to verify data is in database
   - Check server console logs for save confirmations

3. **Refresh Compass:**
   - Click the refresh button (circular arrow icon)
   - Data might have been added recently

## Quick Reference

### Connection String Formats:

**Local MongoDB:**
```
mongodb://localhost:27017/wanderlust
```

**MongoDB Atlas (Cloud):**
```
mongodb+srv://username:password@cluster.mongodb.net/wanderlust?retryWrites=true&w=majority
```

### Common Queries in Compass Filter:

**Find pending bookings:**
```json
{ "status": "pending" }
```

**Find admin users:**
```json
{ "role": "admin" }
```

**Find bookings by user email:**
```json
{ "email": "john@example.com" }
```

**Find recent bookings (last 7 days):**
```json
{ "createdAt": { "$gte": ISODate("2024-01-08T00:00:00.000Z") } }
```

## Visual Guide

When you open a collection in Compass, you'll see:

```
┌─────────────────────────────────────────┐
│  bookings (25 documents)                │
│  [Filter] [Sort] [Search...]            │
├─────────────────────────────────────────┤
│  ┌───────────────────────────────────┐ │
│  │ {                                 │ │
│  │   "_id": "...",                   │ │
│  │   "destination": "Paris",         │ │
│  │   "status": "pending",            │ │
│  │   ...                             │ │
│  │ }                                 │ │
│  └───────────────────────────────────┘ │
│  ┌───────────────────────────────────┐ │
│  │ { ... next document ... }         │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Next Steps

1. **Connect Compass** to your database
2. **Browse collections** to see your data
3. **Use filters** to find specific records
4. **Compare** what you see with `npm run check-db` output
5. **Verify** that new data appears after creating bookings/users

This is the easiest way to visually inspect your MongoDB data!

