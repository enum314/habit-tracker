export function isSafeRelativeRedirectPath(from: string): boolean {
  if (typeof from !== "string") {
    return false;
  }

  const trimmed = from.trim();

  if (
    trimmed.length === 0 ||
    trimmed.length > 2048 ||
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//")
  ) {
    return false;
  }

  if (trimmed.includes("\\") || /[\u0000-\u001F\u007F]/.test(trimmed)) {
    return false;
  }

  try {
    const resolved = new URL(trimmed, "https://invalid.internal");

    return resolved.origin === "https://invalid.internal";
  } catch {
    return false;
  }
}

export function sanitizeRedirectPath(
  from: string | null | undefined,
  fallback: string
): string {
  if (from == null || from === "") {
    return fallback;
  }

  return isSafeRelativeRedirectPath(from) ? from : fallback;
}
