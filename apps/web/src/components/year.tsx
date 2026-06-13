"use client";

import { useMemo } from "react";

export function Year() {
  const year = useMemo(() => new Date().getFullYear(), []);

  return <span>{year}</span>;
}
