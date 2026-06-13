"use client";

import { PropsWithChildren } from "react";

import { ThemeProvider as NextThemeProvider } from "next-themes";

export function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      themes={["dark", "light", "system"]}
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}
