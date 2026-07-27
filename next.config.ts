import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@selka/theme-sdk"],
  async rewrites() {
    return [
      { source: "/@:slug", destination: "/s/:slug" },
      { source: "/@:slug/:path*", destination: "/s/:slug/:path*" },
    ];
  },
  async redirects() {
    return [
      { source: "/s/:slug", destination: "/@:slug", permanent: true },
      { source: "/s/:slug/:path*", destination: "/@:slug/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
