/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force Next.js to ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // ...other config options...
};

module.exports = nextConfig;
