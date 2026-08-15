/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
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