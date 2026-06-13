import { cache } from "react";

import { addDays, getToday, startOfWeek, toDateKey } from "@/lib/date";

import { db } from "@/server/db";

export interface HabitForToday {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  weeklyTarget: number | null;
  completedToday: boolean;
  currentStreak: number;
  weekCount: number;
}

/** How far back to load logs; enough to render any reasonable streak. */
const LOG_LOOKBACK_DAYS = 90;

/**
 * Loads the user's active habits with today's completion, current streak, and
 * this week's completion count. Streak/week values are computed in JS from a
 * single bounded query rather than stored, keeping writes simple.
 */
export const getHabitsForToday = cache(
  async (userId: string): Promise<HabitForToday[]> => {
    const today = getToday();
    const weekStart = startOfWeek(today);
    const lookbackStart = addDays(today, -LOG_LOOKBACK_DAYS);

    const habits = await db.habit.findMany({
      where: { userId, archivedAt: null },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: {
        logs: {
          where: { date: { gte: lookbackStart } },
          orderBy: { date: "desc" },
          select: { date: true },
        },
      },
    });

    const todayKey = toDateKey(today);
    const weekStartKey = toDateKey(weekStart);

    return habits.map((habit) => {
      const logKeys = new Set(habit.logs.map((log) => toDateKey(log.date)));

      const completedToday = logKeys.has(todayKey);

      let weekCount = 0;
      for (const key of logKeys) {
        if (key >= weekStartKey && key <= todayKey) {
          weekCount++;
        }
      }

      let currentStreak = 0;
      // Streak counts consecutive days ending today (or yesterday if today
      // isn't done yet, so an incomplete today doesn't break the streak).
      let cursor = completedToday ? today : addDays(today, -1);
      while (logKeys.has(toDateKey(cursor))) {
        currentStreak++;
        cursor = addDays(cursor, -1);
      }

      return {
        id: habit.id,
        name: habit.name,
        description: habit.description,
        icon: habit.icon,
        color: habit.color,
        weeklyTarget: habit.weeklyTarget,
        completedToday,
        currentStreak,
        weekCount,
      };
    });
  }
);
