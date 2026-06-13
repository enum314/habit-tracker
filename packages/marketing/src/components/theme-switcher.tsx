"use client";

import { PropsWithChildren } from "react";

import { Button } from "@acme/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/components/ui/dropdown-menu";
import { useMounted } from "@acme/hooks/use-mounted";
import { cn } from "@acme/utils/cn";
import { useTheme } from "next-themes";

import { AppIcon } from "./app-icon";

interface ThemeSwitcherProps extends PropsWithChildren {
  className?: string;
}

export function ThemeSwitcher({ className, children }: ThemeSwitcherProps) {
  const { setTheme } = useTheme();

  const mounted = useMounted();

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className={cn("mr-0!", className)}
          />
        }
        nativeButton={true}
      >
        {children}
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => setTheme("light")}>
            <AppIcon icon="sun" className="mr-2" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <AppIcon icon="moon" className="mr-2" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            <AppIcon icon="system" className="mr-2" />
            <span>System</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
