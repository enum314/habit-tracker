import { betterAuth, RateLimit } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";

import { clientEnv } from "@/env/client";
import { serverEnv } from "@/env/server";

import { absoluteUrl } from "@/lib/utils";

import { siteConfig } from "@/config/site";

import { db } from "./db";
import { redis } from "./redis";

export const auth = betterAuth({
  appName: siteConfig.name,
  baseURL: absoluteUrl("/api/auth"),
  secret: serverEnv.BETTER_AUTH_SECRET,

  trustedOrigins: [clientEnv.NEXT_PUBLIC_APP_URL],

  logger: {
    disabled: serverEnv.NODE_ENV === "production",
    level: "debug",
  },

  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  advanced: {
    ipAddress: {
      disableIpTracking: false,
    },
  },

  emailAndPassword: {
    enabled: false,
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
      allowDifferentEmails: true,
      allowUnlinkingAll: false,
    },
  },

  user: {
    deleteUser: {
      enabled: true,
    },
  },

  rateLimit: {
    enabled: true,
    customStorage: {
      get: async (key) => {
        const value = await redis.get(`ratelimit:auth:${key}`);

        try {
          return value ? (JSON.parse(value) as RateLimit) : undefined;
        } catch (_) {
          return undefined;
        }
      },
      set: async (key, value) => {
        redis.set(`ratelimit:auth:${key}`, JSON.stringify(value));
      },
    },
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/update-user")) {
        const { image } = ctx.body;

        if (image) {
          throw new APIError("BAD_REQUEST", {
            message:
              "You are not allowed to update your avatar through this endpoint.",
          });
        }
      }
    }),
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/callback/")) {
        const session = ctx.context.newSession;

        if (session && !session.user.name) {
          await ctx.context.internalAdapter.updateUser(session.user.id, {
            name: session.user.email?.split("@")[0] ?? "",
          });
        }
      }
    }),
  },

  socialProviders: {
    google: {
      clientId: serverEnv.GOOGLE_CLIENT_ID,
      clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
      prompt: "select_account",
    },
  },

  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
