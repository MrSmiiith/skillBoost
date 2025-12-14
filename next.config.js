/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['skillboost.merzougrayane.com'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
}

module.exports = nextConfig
