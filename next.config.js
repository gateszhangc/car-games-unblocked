/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 确保 data 目录被包含在构建中
  experimental: {
    outputFileTracingIncludes: {
      '/': ['./data/**/*'],
    },
  },
};

module.exports = nextConfig;
