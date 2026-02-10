/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'export',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
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
};

export default nextConfig;
