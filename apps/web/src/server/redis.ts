import { Redis } from "ioredis";

import { serverEnv } from "@/env/server";

declare global {
  var cachedRedis: Redis;
}

let redis_instance: Redis;

if (process.env.NODE_ENV === "production") {
  redis_instance = new Redis(serverEnv.REDIS_URL);
} else {
  if (!global.cachedRedis) {
    global.cachedRedis = new Redis(serverEnv.REDIS_URL);
  }

  redis_instance = global.cachedRedis;
}

export const redis = redis_instance;
