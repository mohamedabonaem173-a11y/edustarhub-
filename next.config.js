/** @type {import('next').NextConfig} */
const nextConfig = {
  // This setting is CRITICAL for Vercel deployment when you have API routes
  // and need to prevent Vercel from forcing a static export.
  output: 'standalone',

  async redirects() {
    return [
      {
        source: '/:path*',
        destination: 'https://edustarhub-8u36-git-main-mohamedabonaem173-a11ys-projects.vercel.app/:path*',
        permanent: false, // false = temporary 302, true = permanent 301
      },
    ]
  },
};

module.exports = nextConfig;
