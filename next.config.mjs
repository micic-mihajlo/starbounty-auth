/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  transpilePackages: [
    'passkey-kit',
    'passkey-kit-sdk',
    'passkey-factory-sdk',
    'sac-sdk',
  ],
  output: "standalone",
}

export default nextConfig
