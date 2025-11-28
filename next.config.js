/** @type {import('next').NextConfig} */
const nextConfig = {
  // This setting is CRITICAL for Vercel deployment when you have API routes
  // and need to prevent Vercel from forcing a static export.
  output: 'standalone', 
};

module.exports = nextConfig;