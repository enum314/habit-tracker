import { headers } from "next/headers";

import { getIp } from "@/lib/helpers/get-ip";

import { getCurrentSession, getCurrentUser } from "@/cache/session";

import { services } from "./services";
import { CreateRateLimitParams } from "./services/ratelimit";

export async function createContext() {
  const hPromise = headers();
  const ipPromise = getIp();

  const [h, session, user, ip] = await Promise.all([
    hPromise,
    getCurrentSession(),
    getCurrentUser<true>(),
    ipPromise,
  ]);

  const rateLimitByIp = async (
    params: CreateRateLimitParams,
    customIp?: string
  ) => {
    await services.ratelimit.consume(
      {
        ...params,
      },
      {
        type: "ip",
        ip: customIp ?? session?.ipAddress ?? ip,
      }
    );
  };

  const rateLimitByUser = async (
    params: CreateRateLimitParams,
    customId?: string
  ) => {
    if (user) {
      await services.ratelimit.consume(
        {
          ...params,
        },
        {
          type: "userId",
          userId: customId ?? user.id,
        }
      );
    } else {
      await rateLimitByIp(params);
    }
  };

  return {
    ip,
    user: user ?? null,
    session: session ?? null,
    rateLimitByIp,
    rateLimitByUser,
  };
}

export type Context = ReturnType<typeof createContext>;
