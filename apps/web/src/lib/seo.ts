import { createSeoConfig } from "@acme/seo/create-seo-config";
import {
  buildOgImageUrl,
  withImageMetadata as withImageMetadataBase,
} from "@acme/seo/metadata";

import { clientEnv } from "@/env/client";

import { siteConfig } from "@/config/site";

export const seoConfig = createSeoConfig({
  siteName: siteConfig.name,
  siteDescription: siteConfig.description,
  company: siteConfig.company,
  email: siteConfig.email,
  appUrl: clientEnv.NEXT_PUBLIC_APP_URL,
});

export function withImageMetadata(
  override: Parameters<typeof withImageMetadataBase>[0]
) {
  const ogBaseUrl = clientEnv.NEXT_PUBLIC_APP_URL;

  return withImageMetadataBase(override, {
    siteName: siteConfig.name,
    buildOgImageUrl: (title, description) =>
      buildOgImageUrl(ogBaseUrl, title, description),
  });
}
