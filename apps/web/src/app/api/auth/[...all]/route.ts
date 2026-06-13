import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/server/auth"; // path to your auth file

export const { GET, POST } = toNextJsHandler(auth);
