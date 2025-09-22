/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'res.cloudinary.com'], // Add any other domains you'll use for images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // Configure static generation behavior
  output: 'standalone',
  // Disable static optimization for admin pages during build
  async rewrites() {
    return []
  },
  // Configure build behavior
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // Add build timeout configuration
  experimental: {
    // Remove invalid option and add valid ones if needed
    serverComponentsExternalPackages: [],
  },
  // Configure ESLint to be less strict during build
  eslint: {
    // Only run ESLint on specific directories during production builds
    dirs: ['app', 'components', 'lib', 'hooks'],
    // Allow production builds to complete even if there are ESLint errors
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig