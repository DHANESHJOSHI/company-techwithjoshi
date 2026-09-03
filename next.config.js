/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/themes/:path*',
        destination: '/api/project-preview/themes/:path*',
      },
      {
        source: '/storage/:path*',
        destination: '/api/project-preview/storage/:path*',
      },
      {
        source: '/cache/:path*',
        destination: '/api/project-preview/cache/:path*',
      },
    ];
  },
};

module.exports = nextConfig;