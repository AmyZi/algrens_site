/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ahlgrens.eu',
        port: '',
        pathname: '/web/wp-content/uploads/**',
      },
    ],
  },
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    staticGenerationMaxConcurrency: 2,   // default is higher
    staticGenerationRetryCount: 3,       // retries a failed page before failing the build
  },
};

export default nextConfig;
