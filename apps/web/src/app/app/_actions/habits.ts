"use server";

import { revalidatePath } from "next/cache";

import { getToday, parseDateKey } from "@/lib/date";
import { authenticatedActionClient } from "@/lib/server-actions";
import {
  createHabitSchema,
  habitIdSchema,
  toggleHabitSchema,
  updateHabitSchema,
} from "@/lib/validators/habit";

import { GenericError } from "@/server/classes/generic-error";
import { db } from "@/server/db";

function normalizeOptional(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export const createHabitAction = authenticatedActionClient
  .inputSchema(createHabitSchema)
  .action(async ({ parsedInput, ctx }) => {
    const habit = await db.habit.create({
      data: {
        userId: ctx.user.id,
        name: parsedInput.name,
        description: normalizeOptional(parsedInput.description),
        icon: normalizeOptional(parsedInput.icon),
        color: normalizeOptional(parsedInput.color),
        weeklyTarget: parsedInput.weeklyTarget ?? null,
      },
      select: { id: true },
    });

    revalidatePath("/app");

    return { id: habit.id };
  });

export const updateHabitAction = authenticatedActionClient
  .inputSchema(updateHabitSchema)
  .action(async ({ parsedInput, ctx }) => {
    const result = await db.habit.updateMany({
      where: { id: parsedInput.id, userId: ctx.user.id },
      data: {
        name: parsedInput.name,
        description: normalizeOptional(parsedInput.description),
        icon: normalizeOptional(parsedInput.icon),
        color: normalizeOptional(parsedInput.color),
        weeklyTarget: parsedInput.weeklyTarget ?? null,
      },
    });

    if (result.count === 0) {
      throw new GenericError("Habit not found.");
    }

    revalidatePath("/app");

    return { id: parsedInput.id };
  });

export const deleteHabitAction = authenticatedActionClient
  .inputSchema(habitIdSchema)
  .action(async ({ parsedInput, ctx }) => {
    const result = await db.habit.deleteMany({
      where: { id: parsedInput.id, userId: ctx.user.id },
    });

    if (result.count === 0) {
      throw new GenericError("Habit not found.");
    }

    revalidatePath("/app");

    return { id: parsedInput.id };
  });

export const archiveHabitAction = authenticatedActionClient
  .inputSchema(habitIdSchema)
  .action(async ({ parsedInput, ctx }) => {
    const result = await db.habit.updateMany({
      where: { id: parsedInput.id, userId: ctx.user.id, archivedAt: null },
      data: { archivedAt: new Date() },
    });

    if (result.count === 0) {
      throw new GenericError("Habit not found.");
    }

    revalidatePath("/app");

    return { id: parsedInput.id };
  });

export const toggleHabitLogAction = authenticatedActionClient
  .inputSchema(toggleHabitSchema)
  .action(async ({ parsedInput, ctx }) => {
    const date = parsedInput.date ? parseDateKey(parsedInput.date) : getToday();

    if (!date) {
      throw new GenericError("Invalid date.");
    }

    // Verify ownership before mutating logs.
    const habit = await db.habit.findFirst({
      where: { id: parsedInput.habitId, userId: ctx.user.id },
      select: { id: true },
    });

    if (!habit) {
      throw new GenericError("Habit not found.");
    }

    const existing = await db.habitLog.findUnique({
      where: { habitId_date: { habitId: habit.id, date } },
      select: { id: true },
    });

    if (existing) {
      await db.habitLog.delete({ where: { id: existing.id } });
    } else {
      await db.habitLog.create({ data: { habitId: habit.id, date } });
    }

    revalidatePath("/app");

    return { completed: !existing };
  });
