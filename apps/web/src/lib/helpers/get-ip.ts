import { headers } from "next/headers";

export async function getIp() {
  const h = await headers();

  const forwardedFor = h.get("x-forwarded-for");
  const realIP = h.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  if (realIP) {
    return realIP.trim();
  }

  return "Unknown";
}
