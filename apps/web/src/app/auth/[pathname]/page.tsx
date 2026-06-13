import Image from "next/image";

import { Particles } from "@acme/components/ui/particles";
import { AuthView } from "@daveyplate/better-auth-ui";

import { sanitizeRedirectPath } from "@/lib/safe-redirect-path";

import { siteConfig } from "@/config/site";

export function generateStaticParams() {
  return Object.values({
    signin: "signin",
    signout: "signout",
  }).map((pathname) => ({ pathname }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pathname: string }>;
}) {
  const { pathname } = await params;

  switch (pathname) {
    case "signin":
      return {
        title: "Sign In",
        description: "Sign in to your account",
      };
    case "signout":
      return {
        title: "Sign Out",
        description: "Sign out of your account",
      };
    default:
      return {
        title: "Auth",
        description: "Auth",
      };
  }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ pathname: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const { pathname } = await params;
  const search = await searchParams;
  const from = search.from;

  const redirectTo = sanitizeRedirectPath(from, "/app");

  return (
    <>
      <Particles className="absolute inset-0 -z-10 overflow-hidden" />
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="from-primary/10 absolute top-[-10vh] left-[-10vh] h-[60vh] w-[60vh] rounded-full bg-linear-to-br to-transparent blur-[80px]" />
        <div className="from-primary/10 absolute top-[30vh] right-[5vw] h-[50vh] w-[50vh] rounded-full bg-linear-to-br to-transparent blur-[80px]" />
        <div className="from-primary/10 absolute bottom-[5vh] left-[15vw] h-[45vh] w-[45vh] rounded-full bg-linear-to-tr to-transparent blur-[80px]" />
      </div>

      <div className="relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-4">
            {/* Header Section */}
            <div className="space-y-3 text-center">
              <div className="relative flex flex-col items-center gap-3">
                <Image
                  className="size-16 rounded-lg transition-transform duration-300 hover:scale-105 hover:rotate-5"
                  src="/android-chrome-192x192.png"
                  alt={siteConfig.name}
                  width={192}
                  height={192}
                  priority
                />
                <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                  {siteConfig.name}
                </h1>
              </div>
              <p className="text-muted-foreground text-sm lg:text-base">
                {siteConfig.description}
              </p>
            </div>

            <div className="from-background to-muted/50 dark:from-card dark:to-accent/5 rounded-xl border bg-linear-to-br shadow-lg lg:rounded-2xl lg:shadow-xl">
              <div className="p-6 lg:p-8">
                <AuthView pathname={pathname} redirectTo={redirectTo} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
