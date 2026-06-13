import {
  Article,
  BreadcrumbList,
  FAQPage,
  Organization,
  SoftwareApplication,
  TechArticle,
  WithContext,
} from "schema-dts";

import type { SeoConfig } from "./types";

export function OrganizationJsonLd({ config }: { config: SeoConfig }) {
  const organizationData: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: config.organization.name,
    url: config.organization.url,
    logo: config.organization.logo,
    sameAs: config.organization.sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      ...config.organization.contactPoint,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
    />
  );
}

export function SoftwareApplicationJsonLd({ config }: { config: SeoConfig }) {
  const softwareData: WithContext<SoftwareApplication> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: config.product.name,
    applicationCategory: config.product.applicationCategory,
    operatingSystem: config.product.operatingSystem,
    offers: {
      "@type": "Offer",
      price: config.product.offers.price,
      priceCurrency: config.product.offers.priceCurrency,
      availability: "InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: config.product.aggregateRating.ratingValue,
      ratingCount: parseInt(config.product.aggregateRating.ratingCount, 10),
      bestRating: config.product.aggregateRating.bestRating,
      worstRating: config.product.aggregateRating.worstRating,
    },
    description: config.siteDescription,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareData) }}
    />
  );
}

export function FAQPageJsonLd({
  faqItems,
}: {
  faqItems: { question: string; answer: string }[];
}) {
  const faqData: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
    />
  );
}

export function ArticleJsonLd({
  config,
  title,
  description,
  url,
  datePublished,
  dateModified,
  authorName,
}: {
  config: SeoConfig;
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
}) {
  const articleData: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished: datePublished || new Date().toISOString(),
    dateModified: dateModified || new Date().toISOString(),
    author: {
      "@type": "Person",
      name: authorName || config.organization.name,
    },
    publisher: {
      "@type": "Organization",
      name: config.organization.name,
      logo: {
        "@type": "ImageObject",
        url: config.organization.logo,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData) }}
    />
  );
}

export function TechArticleJsonLd({
  config,
  title,
  description,
  url,
  datePublished,
  dateModified,
  authorName,
  keywords = [],
}: {
  config: SeoConfig;
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  keywords?: string[];
}) {
  const techArticleData: WithContext<TechArticle> = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description,
    url,
    datePublished: datePublished || new Date().toISOString(),
    dateModified: dateModified || new Date().toISOString(),
    author: {
      "@type": "Person",
      name: authorName || config.organization.name,
    },
    publisher: {
      "@type": "Organization",
      name: config.organization.name,
      logo: {
        "@type": "ImageObject",
        url: config.organization.logo,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords: keywords.join(", "),
    articleSection: "Documentation",
    inLanguage: "en-US",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleData) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const breadcrumbData: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
    />
  );
}
