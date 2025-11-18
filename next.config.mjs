
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',               
  experimental: {
    serverActions: {
      bodySizeLimit: '35mb',
    },
  },
};

export default nextConfig;

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   experimental: {
//     serverActions: {
//       bodySizeLimit: '35mb',
//     }
//   },
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   output: 'standalone',   
// };

// export default nextConfig;

