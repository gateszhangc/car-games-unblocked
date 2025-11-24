/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 禁用 TypeScript 校验
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
