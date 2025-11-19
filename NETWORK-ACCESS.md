# 🌐 Network Access Guide - Access from Other Devices

## Quick Answer

**Yes!** Your WanderLust site can be accessed from other devices on the same network.

## How to Access from Other Devices

### Step 1: Start the Server

Make sure your server is running:
```bash
npm start
# or
npm run dev
```

### Step 2: Find Your Computer's IP Address

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter (usually Wi-Fi or Ethernet).

**Mac/Linux:**
```bash
ifconfig
# or
ip addr show
```

**Or check the server console** - it will display your network IP address when the server starts!

### Step 3: Access from Other Devices

1. **Make sure both devices are on the same Wi-Fi network**
2. On the other device (phone, tablet, another computer), open a web browser
3. Enter: `http://YOUR_IP_ADDRESS:3001`
   - Example: `http://192.168.1.100:3001`

### Step 4: Firewall Configuration

If you can't access the site, you may need to allow the port through your firewall:

**Windows Firewall:**
1. Open Windows Defender Firewall
2. Click "Advanced settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → Next
5. Select "TCP" and enter port `3001`
6. Allow the connection
7. Apply to all profiles
8. Name it "WanderLust Server"

**Mac Firewall:**
1. System Preferences → Security & Privacy → Firewall
2. Click "Firewall Options"
3. Add Node.js or allow incoming connections for the port

## Troubleshooting

### Can't Access from Other Device

1. **Check Network:** Both devices must be on the same Wi-Fi network
2. **Check Firewall:** Make sure port 3001 is allowed
3. **Check IP Address:** Make sure you're using the correct IP (check server console)
4. **Try Different Browser:** Some browsers block local network access

### Connection Refused

- Make sure the server is running
- Check that you're using the correct port (3001 by default)
- Verify the IP address hasn't changed (IPs can change on Wi-Fi)

### Can Access but Site Doesn't Load Properly

- Make sure MongoDB is accessible (if using remote MongoDB)
- Check that all static files are being served correctly
- Verify session cookies are working (may need to adjust `sameSite` settings)

## Security Notes

⚠️ **Important:** This setup allows access from your local network only. For production:

1. Use HTTPS (SSL certificate)
2. Set up proper authentication
3. Use environment variables for sensitive data
4. Consider using a reverse proxy (nginx)
5. Deploy to a cloud service (Heroku, AWS, etc.)

## Testing from Mobile

1. Connect your phone to the same Wi-Fi
2. Find your computer's IP (shown in server console)
3. Open mobile browser: `http://YOUR_IP:3001`
4. Test all features (login, booking, etc.)

## Production Deployment

For public internet access, consider:
- **Heroku** - Easy deployment
- **AWS EC2** - Full control
- **DigitalOcean** - Simple VPS
- **Vercel/Netlify** - For static + serverless
- **Railway** - Modern deployment platform

