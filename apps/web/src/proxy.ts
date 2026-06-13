import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { isSafeRelativeRedirectPath } from "@/lib/safe-redirect-path";

import { auth } from "@/server/auth";

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/auth/signup") {
    const signInUrl = new URL("/auth/signin", request.url);

    signInUrl.search = request.nextUrl.search;

    return NextResponse.redirect(signInUrl);
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isAuthPage = request.nextUrl.pathname === "/auth/signin";

  if (session && isAuthPage) {
    const params = new URLSearchParams(request.nextUrl.search);

    const from = params.get("from");

    if (from) {
      if (isSafeRelativeRedirectPath(from)) {
        return NextResponse.redirect(new URL(from, request.url));
      }

      return NextResponse.redirect(new URL("/app", request.url));
    }

    return NextResponse.redirect(new URL("/app", request.url));
  }

  if (
    (!session && !isAuthPage) ||
    (session?.session &&
      new Date(session.session.expiresAt).getTime() < Date.now())
  ) {
    let from = request.nextUrl.pathname;

    if (request.nextUrl.search) {
      from += request.nextUrl.search;
    }

    return NextResponse.redirect(
      new URL(`/auth/signin?from=${encodeURIComponent(from)}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/signin", "/auth/signup", "/app/:path*"],
};
