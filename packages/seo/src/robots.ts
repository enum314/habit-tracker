import type { MetadataRoute } from "next";

export interface CreateRobotsMetadataOptions {
  appUrl: string;
  sitemapUrl: string;
  disallow?: string[];
  blockAiBots?: boolean;
}

export function createRobotsMetadata({
  appUrl,
  sitemapUrl,
  disallow = ["/api"],
  blockAiBots = true,
}: CreateRobotsMetadataOptions): MetadataRoute.Robots {
  const rules: MetadataRoute.Robots["rules"] = [
    {
      userAgent: "*",
      allow: "/",
      disallow,
    },
  ];

  if (blockAiBots) {
    rules.push(
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "ChatGPT-User", disallow: "/" },
      { userAgent: "CCBot", disallow: "/" }
    );
  }

  return {
    rules,
    sitemap: sitemapUrl,
    host: appUrl,
  };
}
