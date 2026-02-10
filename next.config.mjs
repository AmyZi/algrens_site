
/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: path.join(__dirname),
  },
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
};

export default nextConfig;
