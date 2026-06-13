import Script from "next/script";

interface AnalyticsProps {
  analyticsId?: string;
  scriptUrl?: string;
}

export function Analytics({ analyticsId, scriptUrl }: AnalyticsProps) {
  if (!analyticsId || !scriptUrl) return null;

  return <Script defer src={scriptUrl} data-website-id={analyticsId} />;
}
