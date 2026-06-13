import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { serverEnv } from "@/env/server";

import { PrismaClient } from "@/server/prisma/client";

declare global {
  var cachedPrisma: DatabaseClient;
}

let prisma: DatabaseClient;

if (process.env.NODE_ENV === "production") {
  prisma = createClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = createClient();
  }

  prisma = global.cachedPrisma;
}

export const db = prisma;

export type DatabaseTransaction = Omit<
  DatabaseClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export async function createDatabaseTransaction<T>(
  callback: (tx: DatabaseTransaction) => Promise<T>
): Promise<T> {
  return db.$transaction(callback);
}

function createClient() {
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: serverEnv.DATABASE_URL }),
    ...(serverEnv.NODE_ENV === "development"
      ? {
          // log: ["query", "info", "warn"],
        }
      : {}),
  });
}

type DatabaseClient = ReturnType<typeof createClient>;
