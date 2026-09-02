/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.susercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.shopee.vn',
      },
      {
        protocol: 'https',
        hostname: '**.shopeemobile.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};

module.exports = nextConfig;
