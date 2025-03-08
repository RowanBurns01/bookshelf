/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'books.google.com',
        pathname: '/books/content/**',
      },
      {
        protocol: 'https',
        hostname: 'books.google.com',
        pathname: '/googlebooks/images/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/7.x/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/api/**',
      },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false }
    return config
  },
}

module.exports = nextConfig
