import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const clientEnv = createEnv({
  client: {
    NEXT_PUBLIC_APP_URL: z.url(),
    NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
    NEXT_PUBLIC_ANALYTICS_SCRIPT_URL: z.url().optional(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
    NEXT_PUBLIC_ANALYTICS_SCRIPT_URL:
      process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL,
  },
  skipValidation: process.env.SKIP_ENV_VALIDATION === "1",
});
