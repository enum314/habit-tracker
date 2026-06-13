import { absoluteUrl } from "@/lib/utils";

export const siteConfig = {
  name: "Acme",
  company: "Zhyporium",
  email: "hello@zhyporium.com",
  description:
    "Next.js starter with Google auth and a protected member dashboard.",
  links: {
    support: "https://github.com/enum314/acme",
  },
  url: absoluteUrl(""),
};

export type SiteConfig = typeof siteConfig;
