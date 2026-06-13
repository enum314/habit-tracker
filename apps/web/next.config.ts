import "./src/env/client";
import "./src/env/server";

import path from "node:path";
import { fileURLToPath } from "node:url";
import { NextConfig } from "next";

const monorepoRoot = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
);

function getFrameAncestorsPolicy(appUrl: string): string {
  const url = new URL(appUrl);
  const { hostname, protocol } = url;

  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    /^\d+\.\d+\.\d+\.\d+$/.test(hostname)
  ) {
    return "frame-ancestors 'self'";
  }

  const baseDomain =
    hostname.split(".").length >= 2
      ? hostname.split(".").slice(-2).join(".")
      : hostname;
  const originScheme = protocol === "http:" ? "http:" : "https:";

  return `frame-ancestors 'self' ${originScheme}//*.${baseDomain} ${originScheme}//${baseDomain}`;
}

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["@acme/components", "@acme/marketing", "@acme/seo"],
  cacheComponents: true,
  experimental: {
    turbopackFileSystemCacheForDev: false,
    optimizePackageImports: ["lucide-react", "react-icons"],
  },
  images: {
    remotePatterns: [],
  },
  devIndicators: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Content-Security-Policy",
            value: getFrameAncestorsPolicy(
              process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
            ),
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
  output: "standalone",
  outputFileTracingRoot: monorepoRoot,
  ...(process.env.VERCEL_URL ? { output: undefined } : {}),
};

export default config;
