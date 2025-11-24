/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 确保 data 目录被包含在构建中
  experimental: {
    outputFileTracingIncludes: {
      '/': ['./data/**/*'],
    },
  },
  // 禁用 TypeScript 和 ESLint 校验
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
