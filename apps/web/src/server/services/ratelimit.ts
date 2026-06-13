import { RateLimiterRedis } from "rate-limiter-flexible";

import { TooManyRequests } from "@/server/classes/too-many-requests";
import { redis } from "@/server/redis";

interface RateLimiterRes {
  msBeforeNext: number;
  remainingPoints?: number;
  consumedPoints?: number;
  isFirstInDuration?: boolean;
}

export interface CreateRateLimitParams {
  /**
   * The prefix to use for the rate limiter key
   */
  prefix: string;
  /**
   * The number of points to use for the rate limiter
   */
  points: number;
  /**
   * The duration of the rate limiter
   */
  duration: number;
  /**
   * The message to use when the rate limit is exceeded
   */
  message?: string;
}

type IdentifierParams =
  | {
      type: "userId";
      userId: string;
    }
  | {
      type: "ip";
      ip: string;
    }
  | {
      type: "apiKey";
      identifier: string;
      endpoint: string;
    };

interface RateLimitConsumeOptions {
  pointsToConsume?: number;
}

const ratelimitObjects: Record<string, RateLimiterRedis> = {};

interface RateLimitService {
  consume(
    params: CreateRateLimitParams,
    identitierParams: IdentifierParams,
    options?: RateLimitConsumeOptions
  ): Promise<boolean>;
}

export const ratelimit: RateLimitService = {
  async consume(params, identifierParams, options) {
    const keyPrefix = `ratelimit:${params.prefix}:`;

    if (!ratelimitObjects[keyPrefix]) {
      ratelimitObjects[keyPrefix] = new RateLimiterRedis({
        storeClient: redis,
        keyPrefix,
        points: params.points,
        duration: params.duration,
      });
    }

    const rateLimiter = ratelimitObjects[keyPrefix];

    const identifier = getIdentifier(identifierParams);

    if (!identifier) {
      throw new Error("Invalid identifier type");
    }

    try {
      await rateLimiter.consume(identifier, options?.pointsToConsume ?? 1);

      return true;
    } catch (error) {
      if ((error as RateLimiterRes)?.msBeforeNext !== undefined) {
        const message = params.message ?? "Too many requests";

        throw new TooManyRequests(message, {
          "retry-after": (error as RateLimiterRes).msBeforeNext / 1000,
          "x-ratelimit-limit": params.points,
          "x-ratelimit-remaining": Math.max(
            0,
            (error as RateLimiterRes).remainingPoints ?? 0
          ),
          "x-ratelimit-reset": Math.ceil(
            (error as RateLimiterRes).msBeforeNext / 1000
          ),
        });
      }

      throw error;
    }
  },
};

function getIdentifier(identifierParams: IdentifierParams) {
  switch (identifierParams.type) {
    case "userId":
      return identifierParams.userId;
    case "ip":
      return identifierParams.ip;
    case "apiKey":
      return `apiKey:${identifierParams.identifier}:${identifierParams.endpoint}`;
    default:
      return undefined;
  }
}
