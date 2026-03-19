import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  allowedDevOrigins: [
    'preview-chat-2cef2acb-834a-4ed2-9dc0-a0a63f7cea32.space.z.ai',
  ],
};

export default nextConfig;
