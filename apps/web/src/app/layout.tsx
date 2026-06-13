import "@/styles/globals.css";

import { PropsWithChildren } from "react";
import { Viewport } from "next";
import {
  Geist as FontHeading,
  Geist_Mono as FontMono,
  Geist as FontSans,
} from "next/font/google";

import { ThemeProvider } from "@acme/components/theme-provider";
import { Toaster } from "@acme/components/ui/sonner";
import { Analytics } from "@acme/marketing/analytics";

import { clientEnv } from "@/env/client";

import { withImageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";

import { seoConfig } from "@/config/marketing/seo";

const fontHeading = FontHeading({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: "400",
});

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: "400",
});

const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: "400",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const metadata = withImageMetadata({
  metadataBase: clientEnv.NEXT_PUBLIC_APP_URL,

  title: {
    default: seoConfig.siteName,
    template: `%s | ${seoConfig.siteName}`,
  },

  description: seoConfig.siteDescription,

  keywords: seoConfig.keywords,

  creator: seoConfig.organization.name,

  openGraph: {
    type: seoConfig.openGraph.type as "website",
    locale: seoConfig.openGraph.locale,
    title: seoConfig.siteName,
    description: seoConfig.siteDescription,
    siteName: seoConfig.openGraph.siteName,
  },

  twitter: {
    card: seoConfig.twitter.cardType as "summary_large_image",
    title: seoConfig.siteName,
    description: seoConfig.siteDescription,
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/manifest.webmanifest",
});

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          fontSans.variable,
          fontHeading.variable,
          fontMono.variable
        )}
      >
        <ThemeProvider>
          {children}
          <Toaster richColors />
        </ThemeProvider>
        <Analytics
          analyticsId={clientEnv.NEXT_PUBLIC_ANALYTICS_ID}
          scriptUrl={clientEnv.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL}
        />
      </body>
    </html>
  );
}
