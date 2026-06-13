import type { CreateSeoConfigInput, SeoConfig } from "./types";

export function createSeoConfig(input: CreateSeoConfigInput): SeoConfig {
  return {
    siteName: input.siteName,
    siteDescription: input.siteDescription,
    keywords: input.keywords ?? [
      "web application",
      "software",
      "platform",
      "collaboration",
      "productivity",
    ],
    organization: {
      name: input.company,
      url: input.appUrl,
      logo: input.logoPath ?? "/android-chrome-512x512.png",
      sameAs: [],
      contactPoint: {
        contactType: "customer service",
        email: input.email,
        availableLanguage: ["English"],
      },
    },
    product: {
      name: input.siteName,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: {
        price: input.productPrice ?? "20.00",
        priceCurrency: input.productCurrency ?? "USD",
        availability: "https://schema.org/InStock",
      },
      aggregateRating: {
        ratingValue: "4.8",
        ratingCount: "424",
        bestRating: "5",
        worstRating: "1",
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: input.siteName,
    },
    twitter: {
      cardType: "summary_large_image",
    },
  };
}

export type { CreateSeoConfigInput, SeoConfig };
