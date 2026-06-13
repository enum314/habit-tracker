import { createSafeActionClient } from "next-safe-action";

import { serverEnv } from "@/env/server";

import { GenericError } from "@/server/classes/generic-error";
import { TooManyRequests } from "@/server/classes/too-many-requests";
import { createContext } from "@/server/context";

export const baseActionClient = createSafeActionClient({
  handleServerError(error) {
    if (typeof error === "string") {
      return error;
    }

    if (
      error instanceof GenericError ||
      error instanceof TooManyRequests ||
      error instanceof Unauthorized
    ) {
      return error.message;
    }

    console.error(error);

    return serverEnv.NODE_ENV === "development"
      ? `[INTERNAL_SERVER_ERROR] ${error.message}`
      : "[INTERNAL_SERVER_ERROR]";
  },
}).use(async ({ next }) => {
  const ctx = await createContext();

  return next({ ctx });
});

export const authenticatedActionClient = baseActionClient.use(
  async ({ next, ctx }) => {
    if (!ctx.user || !ctx.session) {
      throw new Unauthorized("Unauthorized");
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user!,
        session: ctx.session!,
      },
    });
  }
);

export class Unauthorized extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Unauthorized";
  }
}
