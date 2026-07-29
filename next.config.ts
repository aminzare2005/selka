import type { NextConfig } from "next";

function minioRemotePattern() {
  const explicit = process.env.MINIO_PUBLIC_URL?.trim();
  if (explicit) {
    try {
      const url = new URL(explicit);
      return {
        protocol: url.protocol.replace(":", "") as "http" | "https",
        hostname: url.hostname,
        port: url.port || undefined,
        pathname: "/**" as const,
      };
    } catch {
      return null;
    }
  }

  const endPoint = process.env.MINIO_ENDPOINT?.trim();
  if (!endPoint) return null;

  const useSSL = process.env.MINIO_USE_SSL === "true";
  const port = process.env.MINIO_PORT ?? (useSSL ? "443" : "9000");

  return {
    protocol: (useSSL ? "https" : "http") as "http" | "https",
    hostname: endPoint,
    port: port === "443" || port === "80" ? undefined : port,
    pathname: "/**" as const,
  };
}

const remotePattern = minioRemotePattern();

const nextConfig: NextConfig = {
  transpilePackages: ["@selka/theme-sdk"],
  images: {
    remotePatterns: remotePattern ? [remotePattern] : [],
  },
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
