/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/economic-reforms',
        destination: '/sectors/economy',
        permanent: true,
      },
      {
        source: '/security-progress',
        destination: '/sectors/security',
        permanent: true,
      },
      {
        source: '/infrastructure',
        destination: '/sectors/infrastructure',
        permanent: true,
      },
      {
        source: '/social-services',
        destination: '/sectors/social-services',
        permanent: true,
      },
      {
        source: '/policy-timeline',
        destination: '/timeline',
        permanent: true,
      },
      {
        source: '/map',
        destination: '/impact-map',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
