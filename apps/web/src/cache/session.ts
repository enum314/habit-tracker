import { cache } from "react";
import { headers } from "next/headers";

import { auth, type Session, type User } from "@/server/auth";

const cachedHeaders = cache(async () => headers());

const cachedSessionUser = cache(async (hdrs: Headers) => {
  const session = await auth.api.getSession({
    headers: hdrs,
  });

  return {
    session: session?.session ?? null,
    user: session?.user ?? null,
  };
});

/**
 * Get the current user from the request
 */
export async function getCurrentUser<Truthy extends boolean = false>(): Promise<
  Truthy extends true ? User : User | null
> {
  const hdrs = await cachedHeaders();
  const { user } = await cachedSessionUser(hdrs);

  return user as any;
}

/**
 * Get the current session from the request
 */
export async function getCurrentSession<
  Truthy extends boolean = false,
>(): Promise<Truthy extends true ? Session : Session | null> {
  const hdrs = await cachedHeaders();
  const { session } = await cachedSessionUser(hdrs);

  return session as any;
}
