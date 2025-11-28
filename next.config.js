/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensures API routes and server-side code work properly on Vercel
  output: 'standalone',

  // You can add other Next.js settings here if needed
  reactStrictMode: true,
};

module.exports = nextConfig;
