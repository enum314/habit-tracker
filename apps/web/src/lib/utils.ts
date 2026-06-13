import { cn } from "@acme/utils/cn";
import {
  getPaginationParams,
  toSentenceCase,
  toTitleCase,
  truncate,
} from "@acme/utils/string";
import { absoluteUrl as absoluteUrlBase } from "@acme/utils/url";

import { clientEnv } from "@/env/client";

export { cn, getPaginationParams, toSentenceCase, toTitleCase, truncate };

export function absoluteUrl(path: string) {
  return absoluteUrlBase(path, clientEnv.NEXT_PUBLIC_APP_URL);
}
