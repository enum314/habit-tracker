import { redis } from "@/server/redis";

export async function cache<T>(
  cacheKey: string,
  fn: () => Promise<T>,
  ttl: number = 60 * 60 * 24 // 1 day (seconds)
): Promise<T> {
  const cached = await redis.get(cacheKey);

  if (cached) {
    try {
      return (JSON.parse(cached) as { v: T }).v;
    } catch (error) {
      await redis.del(cacheKey); // Invalid cache, delete it
    }
  }

  const result = await fn();

  await redis.set(cacheKey, JSON.stringify({ v: result }), "EX", ttl);

  return result;
}

export async function invalidateCache(cacheKey: string) {
  await redis.del(cacheKey);
}
