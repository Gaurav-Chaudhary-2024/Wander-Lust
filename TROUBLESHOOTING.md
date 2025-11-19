# Troubleshooting Guide

## Common Issues and Solutions

### Header/Navigation Bar Not Showing

**Issue:** The header appears to be missing or invisible.

**Solution:**
The header is intentionally hidden with CSS and animated in using JavaScript. This is a design feature for a smooth entrance animation.

**What's happening:**
1. Initial state: `opacity: 0` and `transform: translateY(-100px)`
2. JavaScript in `main.js` animates it to visible after 100ms
3. CSS fallback animation ensures it shows after 1 second even if JavaScript is slow

**If header is still not visible:**

1. **Check JavaScript is loading:**
   - Open browser console (F12)
   - Look for any JavaScript errors
   - Ensure `main.js` is loaded

2. **Check file paths:**
   - Verify `js/main.js` path is correct
   - Ensure `css/styles.css` path is correct

3. **Clear browser cache:**
   - Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
   - Clear cache and reload

4. **Disable browser extensions:**
   - Ad blockers might interfere
   - Privacy extensions might block scripts

5. **Try a different browser:**
   - Test in Chrome, Firefox, or Edge
   - Ensure JavaScript is enabled

**Quick Fix (if needed):**
If the header still doesn't show, you can add this inline style to make it immediately visible:

```html
<header class="header" id="header" style="opacity: 1 !important; transform: translateY(0) !important;">
```

### Mobile Menu Not Working

**Issue:** Clicking the hamburger menu doesn't open the mobile menu.

**Solution:**
- Ensure `main.js` is loaded
- Check console for JavaScript errors
- The mobile menu requires the `mobileMenuBtn` and `mobileMenu` elements with correct IDs

### Carousel Not Rotating

**Issue:** Hero carousel images don't change.

**Solution:**
- Verify `carousel.js` is loaded
- Check that images are loading (check Network tab in DevTools)
- Ensure the `heroImages` element exists in the HTML

### Forms Not Submitting

**Issue:** Contact form or booking form doesn't submit.

**Solution:**
- Forms use `preventDefault()` to avoid page reload
- Check browser console for validation errors
- All forms are set up for demo purposes (no real backend)
- Success messages appear as alerts

### Images Not Loading

**Issue:** Destination or hero images fail to load.

**Solution:**
- Check internet connection (images load from Unsplash CDN)
- Verify image URLs are not blocked by firewall/network
- Check browser console for 404 or network errors

### Styling Looks Broken

**Issue:** Page doesn't look right, elements are misaligned.

**Solution:**
1. **Check CSS file is loading:**
   - View page source
   - Click on CSS file links
   - Ensure they load properly

2. **Verify file structure:**
   ```
   html-version/
   ├── index.html
   ├── css/
   │   ├── styles.css
   │   └── animations.css
   └── js/
       └── main.js
   ```

3. **Check for CSS conflicts:**
   - Look for browser extension styles
   - Try incognito/private mode

### Animations Not Working

**Issue:** Elements don't fade in or animate on scroll.

**Solution:**
- Check `animations.js` is loaded
- Intersection Observer API is used (requires modern browser)
- Verify browser supports Intersection Observer

### Mobile Responsive Issues

**Issue:** Layout breaks on mobile devices.

**Solution:**
- Check viewport meta tag is present:
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ```
- Test in different mobile viewports (DevTools)
- Ensure CSS media queries are loading

## Browser Compatibility

### Minimum Requirements
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Not Supported
- Internet Explorer (any version)
- Very old mobile browsers

## Performance Issues

### Page Loads Slowly

**Solutions:**
1. **Image optimization:**
   - Images load from Unsplash CDN
   - Check network speed
   - Consider preloading critical images

2. **JavaScript optimization:**
   - Ensure scripts load in correct order
   - Check for console errors

3. **CSS optimization:**
   - Verify CSS files are not blocked
   - Check for render-blocking resources

## Testing Checklist

Before submitting your project, test:

- [ ] Header appears and animates in
- [ ] All navigation links work
- [ ] Mobile menu opens and closes
- [ ] Hero carousel rotates automatically
- [ ] Destination carousels work with arrows
- [ ] All forms validate input
- [ ] Contact form submission shows success
- [ ] Booking form updates summary in real-time
- [ ] Auth page tabs switch properly
- [ ] All images load correctly
- [ ] Footer links are present
- [ ] Responsive on mobile (< 640px)
- [ ] Responsive on tablet (640-1024px)
- [ ] Works on desktop (> 1024px)
- [ ] No console errors
- [ ] Smooth scroll animations

## Development Tips

### Opening HTML Files

**Best practice:**
Use a local web server instead of opening HTML files directly:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (with http-server)
npx http-server
```

Then open: `http://localhost:8000/html-version/index.html`

**Why?** Some features work better with proper HTTP protocol.

### Browser DevTools

Essential shortcuts:
- **F12** - Open DevTools
- **Ctrl+Shift+C** - Element inspector
- **Ctrl+Shift+M** - Responsive mode
- **Ctrl+Shift+R** - Hard refresh
- **F5** - Refresh page

### Debugging JavaScript

Add this to any JavaScript file for debugging:
```javascript
console.log('Script loaded successfully');
```

Check console (F12 → Console tab) to verify scripts are running.

## Still Having Issues?

1. **Check all file paths** - Make sure relative paths are correct
2. **View page source** - Verify HTML structure is intact
3. **Check console** - Look for any error messages
4. **Test in incognito** - Rule out extension conflicts
5. **Try another browser** - Verify it's not browser-specific

## Contact

If you continue to experience issues, make sure:
- All files are in the correct directory structure
- File names match exactly (case-sensitive on some systems)
- You're opening `index.html` not another file
- Browser JavaScript is enabled
- No network/firewall blocking external resources

---

**Note:** This is a static HTML/CSS/JavaScript website. For production use, you would need:
- Backend server (Node.js, PHP, etc.)
- Database (Supabase, MySQL, etc.)
- Proper form handling
- Email service integration
- Payment processing (for bookings)
