"use client";

import { useLayoutEffect } from "react";

// This hook locks the body scroll when the component is mounted on the client side.
export function useLockBody() {
  useLayoutEffect((): (() => void) => {
    const originalStyle: string = window.getComputedStyle(
      document.body
    ).overflow;

    document.body.style.overflow = "hidden";

    return () => (document.body.style.overflow = originalStyle);
  }, []);
}
