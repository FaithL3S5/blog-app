const nextConfig = {
  reactStrictMode: true, // Enable React strict mode for improved error handling
};

// Configuration object tells the next-pwa plugin
const withPWA = require("next-pwa")({
  dest: "public", // Destination directory for the PWA files
  register: true, // Register the PWA service worker
  skipWaiting: true, // Skip waiting for service worker activation
});

// Export the combined configuration for Next.js with PWA support
module.exports = withPWA(nextConfig);
