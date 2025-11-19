// Quick script to get your computer's IP address for network access
const os = require('os');

const networkInterfaces = os.networkInterfaces();
const PORT = process.env.PORT || 3001;

console.log('\n🌐 Network IP Addresses:\n');
console.log('Use one of these addresses from your tablet:\n');

let found = false;
for (const interfaceName in networkInterfaces) {
  const interfaces = networkInterfaces[interfaceName];
  if (Array.isArray(interfaces)) {
    for (const iface of interfaces) {
      const isIPv4 = iface.family === 'IPv4' || iface.family === 4;
      if (isIPv4 && !iface.internal) {
        console.log(`   ✅ ${interfaceName}:`);
        console.log(`      http://${iface.address}:${PORT}`);
        console.log('');
        found = true;
      }
    }
  }
}

if (!found) {
  console.log('   ⚠️  No network interfaces found.');
  console.log('   Make sure you are connected to Wi-Fi or hotspot.\n');
}

console.log('📱 On your tablet, open a browser and enter one of the URLs above.\n');

