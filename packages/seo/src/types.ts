export interface SeoConfig {
  siteName: string;
  siteDescription: string;
  keywords: string[];
  organization: {
    name: string;
    url: string;
    logo: string;
    sameAs: string[];
    contactPoint: {
      contactType: string;
      email: string;
      availableLanguage: string[];
    };
  };
  product: {
    name: string;
    applicationCategory: string;
    operatingSystem: string;
    offers: {
      price: string;
      priceCurrency: string;
      availability: string;
    };
    aggregateRating: {
      ratingValue: string;
      ratingCount: string;
      bestRating: string;
      worstRating: string;
    };
  };
  openGraph: {
    type: string;
    locale: string;
    siteName: string;
  };
  twitter: {
    cardType: string;
  };
}

export interface CreateSeoConfigInput {
  siteName: string;
  siteDescription: string;
  company: string;
  email: string;
  appUrl: string;
  keywords?: string[];
  logoPath?: string;
  productPrice?: string;
  productCurrency?: string;
}
