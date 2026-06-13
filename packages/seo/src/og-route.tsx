import { ImageResponse } from "next/og";

export interface CreateOgImageRouteOptions {
  siteName: string;
  logoUrl: string;
  background?: string;
}

export function createOgImageRoute(options: CreateOgImageRouteOptions) {
  const background =
    options.background ??
    "linear-gradient(to bottom right, hsl(20 14.3% 4.1%), hsl(346.8 77.2% 49.8%))";

  return async function GET(req: Request) {
    try {
      const url = new URL(req.url);

      const values = {
        title: url.searchParams.get("title") ?? "",
        description: url.searchParams.get("description") ?? "",
      };

      const title =
        values.title.length > 64
          ? `${values.title.substring(0, 64)}...`
          : values.title;

      const description =
        values.description.length > 140
          ? `${values.description.substring(0, 140)}...`
          : values.description;

      return new ImageResponse(
        <div
          style={{
            background,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 24,
            }}
          >
            <img
              src={options.logoUrl}
              alt={options.siteName}
              width="720"
              height="720"
              style={{
                width: "156px",
                height: "156px",
                display: "flex",
              }}
            />
            <h1
              style={{
                fontSize: 72,
                fontWeight: 800,
                letterSpacing: -2,
                color: "hsl(0 0% 95%)",
                textAlign: "center",
                maxWidth: "80%",
                marginBottom: 16,
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: 32,
                color: "hsl(240 5% 64.9%)",
                textAlign: "center",
                maxWidth: "80%",
              }}
            >
              {description}
            </p>
          </div>
        </div>,
        {
          width: 1200,
          height: 630,
        }
      );
    } catch {
      return new Response("Failed to generate image", {
        status: 500,
      });
    }
  };
}
