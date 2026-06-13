import { z } from "zod";

export const HABIT_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
] as const;

export const createHabitSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Give your habit a name.")
    .max(80, "Keep the name under 80 characters."),
  description: z
    .string()
    .trim()
    .max(280, "Keep the description under 280 characters.")
    .optional()
    .or(z.literal("")),
  icon: z
    .string()
    .trim()
    .max(8, "Use a single emoji.")
    .optional()
    .or(z.literal("")),
  color: z.string().trim().max(32).optional().or(z.literal("")),
  weeklyTarget: z
    .number()
    .int("Use a whole number.")
    .min(1, "Aim for at least 1 day.")
    .max(7, "There are only 7 days in a week.")
    .nullable()
    .optional(),
});

export const updateHabitSchema = createHabitSchema.extend({
  id: z.string().min(1),
});

export const toggleHabitSchema = z.object({
  habitId: z.string().min(1),
  date: z.string().min(1).optional(),
});

export const habitIdSchema = z.object({
  id: z.string().min(1),
});

export type CreateHabitValues = z.infer<typeof createHabitSchema>;
export type UpdateHabitValues = z.infer<typeof updateHabitSchema>;
