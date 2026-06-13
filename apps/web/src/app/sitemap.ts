import { type MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ["/auth/signin", "/app"].map((route) => ({
    lastModified: new Date().toISOString(),
    url: absoluteUrl(route),
  }));

  return routes.slice(0, 50000) satisfies MetadataRoute.Sitemap;
}
