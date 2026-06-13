import { createRobotsMetadata } from "@acme/seo/robots";

import { clientEnv } from "@/env/client";

import { absoluteUrl } from "@/lib/utils";

export default function robots() {
  return createRobotsMetadata({
    appUrl: clientEnv.NEXT_PUBLIC_APP_URL,
    sitemapUrl: absoluteUrl("/sitemap.xml"),
  });
}
