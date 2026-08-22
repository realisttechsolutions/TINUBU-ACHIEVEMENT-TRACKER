/** @type {import('next').NextConfig} */
const staging = process.env.NEXT_PUBLIC_APP_ENV?.trim().toLowerCase() === 'staging';

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  serverExternalPackages: ['@electric-sql/pglite', 'pg', '@google-cloud/cloud-sql-connector'],
  webpack(config, { dev }) {
    // The production output is the deployable artifact; a persistent webpack
    // cache is unnecessary in constrained local/CI staging certification jobs.
    if (!dev) config.cache = false;
    return config;
  },
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
  async headers() {
    return staging
      ? [
          {
            source: '/:path*',
            headers: [
              {
                key: 'X-Robots-Tag',
                value: 'noindex, nofollow, noarchive, nosnippet, noimageindex',
              },
            ],
          },
        ]
      : [];
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
