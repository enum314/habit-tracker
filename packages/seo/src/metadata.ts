import type { Metadata } from "next";

export interface WithImageMetadataOptions {
  siteName: string;
  buildOgImageUrl: (title: string, description: string) => string;
}

type ImageMetadataOverride = Metadata & {
  title:
    | string
    | {
        default: string;
        template: string;
      };
  description: string;
  images?: {
    url: string;
    width: number;
    height: number;
    alt: string;
  }[];
};

function resolveTitle(title: ImageMetadataOverride["title"]): string {
  return typeof title === "string" ? title : title.default;
}

export function buildOgImageUrl(
  baseUrl: string,
  title: string,
  description: string
): string {
  const normalizedBase = baseUrl?.replace(/\/$/, "") ?? "";
  if (!normalizedBase) {
    return `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;
  }
  return `${normalizedBase}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;
}

export function withImageMetadata(
  override: ImageMetadataOverride,
  options: WithImageMetadataOptions
): Metadata {
  const title = resolveTitle(override.title);
  const defaultImages = override.images?.length
    ? override.images
    : [
        {
          url: options.buildOgImageUrl(title, override.description),
          width: 1200,
          height: 630,
          alt: title,
        },
      ];

  return {
    ...override,
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: options.siteName,
      title,
      description: override.description,
      images: defaultImages,
      ...override.openGraph,
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description: override.description,
      images: defaultImages,
      ...override.twitter,
    },
  } satisfies Metadata;
}
