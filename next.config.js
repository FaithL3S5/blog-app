// terser plugin
const TerserPlugin = require("terser-webpack-plugin");

// Configuration object tells the next-pwa plugin
const withPWA = require("next-pwa")({
  dest: "public", // Destination directory for the PWA files
  register: true, // Register the PWA service worker
  skipWaiting: true, // Skip waiting for service worker activation
});

const nextConfig = {
  reactStrictMode: true, // Enable React strict mode for improved error handling

  // Enable automatic font optimization
  optimizeFonts: true,

  // Enable webpack minification
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};

// Export the combined configuration for Next.js with PWA support
module.exports = withPWA(nextConfig);
