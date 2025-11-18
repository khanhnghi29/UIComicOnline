import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '35mb', // Tăng giới hạn lên 10 MB (tùy chỉnh nếu cần)
    }
  },
  eslint: {
    // BỎ QUA TOÀN BỘ LỖI ESLINT KHI BUILD (chỉ dùng cho production/deploy)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Nếu sau này còn lỗi TypeScript thì cũng bỏ qua (tùy chọn)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
