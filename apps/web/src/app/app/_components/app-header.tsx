"use client";

import Image from "next/image";
import Link from "next/link";

import { AppIcon } from "@acme/marketing/app-icon";
import { ThemeSwitcher } from "@acme/marketing/theme-switcher";

import { UserDropdownMenu } from "@/components/user-dropdown-menu";

import { siteConfig } from "@/config/site";

interface AppHeaderProps {
  user: {
    id: string;
    name: string;
    image: string | null;
  };
}

export function AppHeader({ user }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 pt-4">
      <nav className="bg-background flex items-center justify-between rounded-xl border px-4 py-2 shadow-lg">
        <div className="relative flex shrink-0 items-center">
          <Image
            className="aspect-square size-8 rounded-lg"
            src="/android-chrome-192x192.png"
            alt={siteConfig.name}
            width={192}
            height={192}
          />
          <span className="ml-2 hidden truncate text-base font-bold md:flex">
            {siteConfig.name}
          </span>
          <Link href="/app" className="absolute inset-0" />
        </div>

        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <ThemeSwitcher className="size-10 rounded-full">
            <AppIcon
              icon="sun"
              className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
            />
            <AppIcon
              icon="moon"
              className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
            />
          </ThemeSwitcher>
          <UserDropdownMenu
            user={{
              id: user.id,
              name: user.name,
              image: user.image ?? null,
            }}
          />
        </div>
      </nav>
    </header>
  );
}
