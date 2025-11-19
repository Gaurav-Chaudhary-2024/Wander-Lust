# 🚀 Setup Guide for New Features

## New Features Added

1. ✅ **Image Optimization** - WebP format, lazy loading, CDN support
2. ✅ **Email System** - Booking confirmations, payment receipts, newsletters
3. ✅ **SEO** - Meta tags, structured data (JSON-LD), sitemap
4. ✅ **Error Tracking** - Sentry integration
5. ✅ **File Uploads** - Profile pictures, documents
6. ✅ **Interactive Maps** - Google Maps/Mapbox integration
7. ✅ **Personalization** - Recommendations engine, saved preferences

---

## 📦 Installation

### 1. Install New Dependencies

```bash
npm install
```

This will install:
- `nodemailer` - Email sending
- `multer` - File uploads
- `@sentry/node` - Error tracking
- `sharp` - Image processing (WebP conversion)
- `sitemap` - Sitemap generation

---

## ⚙️ Environment Variables

Add these to your `.env` file:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/wanderlust

# Server Configuration
PORT=3001
HOST=0.0.0.0
NODE_ENV=development
SITE_URL=http://localhost:3001

# Session Secret
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Google Maps API Key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Sentry Error Tracking (Optional)
SENTRY_DSN=your-sentry-dsn-here
```

---

## 📧 Email Setup

### Gmail Setup:
1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Generate an "App Password" for mail
4. Use the app password in `SMTP_PASS`

### Other Email Providers:
- **SendGrid**: Use `smtp.sendgrid.net` as host
- **Mailgun**: Use `smtp.mailgun.org` as host
- **Outlook**: Use `smtp-mail.outlook.com` as host

---

## 🗺️ Google Maps Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Maps JavaScript API"
4. Create an API key
5. Add the key to `.env` as `GOOGLE_MAPS_API_KEY`

**Note**: For production, restrict the API key to your domain.

---

## 🐛 Sentry Setup (Optional)

1. Sign up at [sentry.io](https://sentry.io)
2. Create a new project (Node.js)
3. Copy your DSN
4. Add to `.env` as `SENTRY_DSN`

If not configured, the app will run without error tracking.

---

## 📁 File Uploads

The uploads directory is automatically created at `public/uploads/`.

**Supported file types:**
- Images: JPG, PNG, GIF, WebP
- Documents: PDF

**File size limit:** 5MB per file

**Note**: Images are automatically converted to WebP format for optimization.

---

## ✅ Features Overview

### 1. Image Optimization
- ✅ WebP format with fallback
- ✅ Lazy loading (already implemented)
- ✅ Automatic format detection
- ✅ CDN-ready URLs

### 2. Email System
- ✅ Booking confirmation emails
- ✅ Payment receipt emails
- ✅ HTML email templates
- ✅ Automatic sending on approval

### 3. SEO
- ✅ Meta tags on all pages
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Structured data (JSON-LD)
- ✅ XML sitemap (`/sitemap.xml`)
- ✅ Robots.txt (`/robots.txt`)

### 4. Error Tracking
- ✅ Sentry integration
- ✅ Automatic error reporting
- ✅ Production-ready monitoring

### 5. File Uploads
- ✅ Profile picture upload
- ✅ Document upload
- ✅ WebP conversion
- ✅ File validation

### 6. Interactive Maps
- ✅ Google Maps integration
- ✅ Destination markers
- ✅ Info windows
- ✅ Auto-fit bounds

### 7. Personalization
- ✅ Recommendation engine
- ✅ User preferences
- ✅ Travel history analysis
- ✅ Personalized suggestions

---

## 🧪 Testing

### Test Email:
1. Configure SMTP in `.env`
2. Make a booking
3. Admin approves booking
4. Check email inbox

### Test File Upload:
1. Go to Dashboard
2. Click "Upload Picture"
3. Select an image
4. Verify it appears

### Test Maps:
1. Go to Destinations page
2. Verify map loads
3. Click markers to see info

### Test Recommendations:
1. Make some bookings
2. Go to Dashboard
3. See personalized recommendations

---

## 📝 API Endpoints Added

### File Uploads
- `POST /api/upload/profile-picture` - Upload profile picture
- `POST /api/upload/document` - Upload document

### Personalization
- `GET /api/recommendations` - Get personalized recommendations
- `POST /api/preferences` - Save user preferences

### SEO
- `GET /sitemap.xml` - XML sitemap
- `GET /robots.txt` - Robots file

---

## 🎯 Next Steps

1. **Configure Email**: Set up SMTP credentials
2. **Get Maps API Key**: Enable Google Maps API
3. **Set Up Sentry** (Optional): For error tracking
4. **Test Features**: Verify everything works
5. **Deploy**: Update production environment variables

---

## ⚠️ Important Notes

- **Email**: Without SMTP configuration, emails will be logged but not sent
- **Maps**: Without API key, maps won't load (graceful fallback)
- **Sentry**: Optional - app works without it
- **File Uploads**: Ensure `public/uploads/` directory has write permissions

---

## 🐛 Troubleshooting

### Email not sending?
- Check SMTP credentials
- Verify firewall allows port 587
- Check spam folder

### Maps not loading?
- Verify API key is correct
- Check browser console for errors
- Ensure Maps JavaScript API is enabled

### File upload fails?
- Check `public/uploads/` exists
- Verify write permissions
- Check file size (max 5MB)

### Recommendations not showing?
- User needs to have booking history
- Check browser console for errors
- Verify database connection

---

**All features are production-ready and include proper error handling!**

