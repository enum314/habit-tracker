"use server";

import { revalidatePath } from "next/cache";

import { parseDateKey } from "@/lib/date";
import { authenticatedActionClient } from "@/lib/server-actions";
import {
  createJournalSchema,
  journalIdSchema,
  updateJournalSchema,
} from "@/lib/validators/journal";

import { GenericError } from "@/server/classes/generic-error";
import { db } from "@/server/db";

function normalizeOptional(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export const createJournalEntryAction = authenticatedActionClient
  .inputSchema(createJournalSchema)
  .action(async ({ parsedInput, ctx }) => {
    const date = parseDateKey(parsedInput.date);
    if (!date) {
      throw new GenericError("Invalid date.");
    }

    const entry = await db.journalEntry.create({
      data: {
        userId: ctx.user.id,
        date,
        title: normalizeOptional(parsedInput.title),
        content: parsedInput.content,
      },
      select: { id: true },
    });

    revalidatePath("/app");

    return { id: entry.id };
  });

export const updateJournalEntryAction = authenticatedActionClient
  .inputSchema(updateJournalSchema)
  .action(async ({ parsedInput, ctx }) => {
    const date = parseDateKey(parsedInput.date);
    if (!date) {
      throw new GenericError("Invalid date.");
    }

    const result = await db.journalEntry.updateMany({
      where: { id: parsedInput.id, userId: ctx.user.id },
      data: {
        date,
        title: normalizeOptional(parsedInput.title),
        content: parsedInput.content,
      },
    });

    if (result.count === 0) {
      throw new GenericError("Entry not found.");
    }

    revalidatePath("/app");

    return { id: parsedInput.id };
  });

export const deleteJournalEntryAction = authenticatedActionClient
  .inputSchema(journalIdSchema)
  .action(async ({ parsedInput, ctx }) => {
    const result = await db.journalEntry.deleteMany({
      where: { id: parsedInput.id, userId: ctx.user.id },
    });

    if (result.count === 0) {
      throw new GenericError("Entry not found.");
    }

    revalidatePath("/app");

    return { id: parsedInput.id };
  });
