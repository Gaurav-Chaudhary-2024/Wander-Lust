# Admin Guide - WanderLust Travel Agency

## Overview
The admin system allows authorized administrators to manage bookings, approve/reject booking requests, and view site statistics.

## Creating an Admin Account

### Method 1: Using the Create Admin Script
Run the following command to create an admin user:

```bash
npm run create-admin
```

This will create an admin with default credentials:
- **Email**: admin@wanderlust.com
- **Password**: admin123
- **Name**: Admin User

### Method 2: Custom Admin Account
You can create a custom admin account by providing arguments:

```bash
npm run create-admin <email> <password> <name>
```

Example:
```bash
npm run create-admin admin@example.com mypassword123 "John Admin"
```

### Method 3: Using the Seed Script
The seed script (`npm run seed`) also creates an admin user with the same default credentials.

## Admin Features

### 1. Admin Dashboard
- **URL**: `/admin`
- **Access**: Only users with `role: "admin"` can access
- **Features**:
  - View site statistics (total bookings, pending, approved, rejected, users)
  - View all bookings in a table format
  - Filter bookings by status
  - Approve or reject bookings

### 2. Booking Management
Admins can:
- **View all bookings** from all users
- **Approve bookings** - Changes status to "approved" and notifies the user
- **Reject bookings** - Changes status to "rejected" with optional reason and notifies the user
- **Filter bookings** by status (pending, approved, rejected, cancelled, completed)

### 3. Statistics Dashboard
The admin dashboard displays:
- Total Bookings
- Pending Bookings
- Approved Bookings
- Rejected Bookings
- Total Users

## Admin API Endpoints

All admin endpoints require authentication and admin role:

### Get All Bookings
```
GET /api/admin/bookings?status=pending&page=1&limit=20
```

### Approve Booking
```
POST /api/admin/bookings/:id/approve
```

### Reject Booking
```
POST /api/admin/bookings/:id/reject
Body: { "reason": "Optional rejection reason" }
```

### Get Admin Stats
```
GET /api/admin/stats
```

## Navigation

When logged in as an admin, you'll see:
- **Admin button** in the header (green button with ⚙️ icon)
- **Admin Dashboard** link in mobile menu
- Access to both regular dashboard (`/dashboard`) and admin dashboard (`/admin`)

## Security

- Admin routes are protected by `isAdmin` middleware
- Only users with `role: "admin"` can access admin features
- Regular users are redirected to an error page if they try to access admin routes
- Admin actions are logged (approvedBy, approvedAt fields)

## User Notifications

When an admin approves or rejects a booking:
- A notification is automatically created for the user
- The user will see the notification in their dashboard
- Notifications include the booking details and status change

## Troubleshooting

### Can't Access Admin Dashboard
1. Verify your user has `role: "admin"` in the database
2. Check that you're logged in
3. Try logging out and logging back in to refresh the session

### Admin Button Not Showing
1. Clear your browser cache
2. Log out and log back in
3. Check that `req.session.user.role === "admin"` in the session

### Creating Admin Fails
1. Ensure MongoDB is connected
2. Check that MONGODB_URI is set in `.env`
3. Verify the email doesn't already exist (or use a different email)

## Best Practices

1. **Change Default Password**: Always change the default admin password after first login
2. **Use Strong Passwords**: Admin accounts should have strong, unique passwords
3. **Limit Admin Accounts**: Only create admin accounts for trusted personnel
4. **Review Bookings Regularly**: Check pending bookings regularly to maintain good customer service
5. **Provide Rejection Reasons**: Always provide clear reasons when rejecting bookings

## Example Workflow

1. User creates a booking → Status: "pending"
2. Admin views booking in admin dashboard
3. Admin reviews booking details
4. Admin approves or rejects:
   - **Approve**: Status → "approved", user gets notification
   - **Reject**: Status → "rejected", user gets notification with reason
5. User sees updated status in their dashboard

