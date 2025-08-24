import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  compiler: {
    removeConsole: false,
  },
  // 启用standalone输出模式，用于Docker部署
  output: 'standalone',
};

export default nextConfig;
