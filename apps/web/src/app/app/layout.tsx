import { PropsWithChildren, Suspense } from "react";
import { connection } from "next/server";

import { Spinner } from "@acme/components/ui/spinner";
import {
  PageDescription,
  PageHeader,
  PageTitle,
} from "@acme/marketing/page-header";

import { getCurrentUser } from "@/cache/session";

import { AppFooter } from "./_components/app-footer";
import { AppHeader } from "./_components/app-header";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Suspense
      fallback={
        <div className="grid size-full min-h-screen place-items-center">
          <Spinner className="text-primary size-8" />
        </div>
      }
    >
      <LayoutWrapped>{children}</LayoutWrapped>
    </Suspense>
  );
}

async function LayoutWrapped({ children }: PropsWithChildren) {
  await connection();

  const user = await getCurrentUser<true>();

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="container">
        <AppHeader
          user={{
            id: user.id,
            name: user.name,
            image: user.image ?? null,
          }}
        />
      </div>
      <main className="flex-1">
        <div className="container mx-auto space-y-4 py-8">
          <PageHeader>
            <PageTitle>Welcome, {user.name}</PageTitle>
            <PageDescription>
              Your member dashboard for {user.email}
            </PageDescription>
          </PageHeader>
          {children}
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
