/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'export',
  images: {
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
  basePath: '/algrens_site',
  assetPrefix: '/algrens_site',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
