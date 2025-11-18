
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', 
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },              
  experimental: {
    serverActions: {
      bodySizeLimit: '35mb',
    },
  },
};

export default nextConfig;

