/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  transpilePackages: ['@ant-design', '@ant-design/icons', '@ant-design/cssinjs'],
};

module.exports = nextConfig;