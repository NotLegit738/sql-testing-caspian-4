import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Load remote URLs in the browser; Vercel's optimizer often cannot fetch postimg.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.postimg.cc",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;