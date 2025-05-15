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
  webpack: (config, { isServer }) => {
    // stellar-sdk uses sodium-native, which can cause issues with webpack
    // Mark sodium-native as external to prevent webpack from trying to bundle it
    if (isServer) {
      config.externals = [...config.externals, 'sodium-native'];
    }
    return config;
  },
}

export default nextConfig
