import { z } from "zod";

export const createJournalSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date."),
  title: z
    .string()
    .trim()
    .max(120, "Keep the title under 120 characters.")
    .optional()
    .or(z.literal("")),
  content: z
    .string()
    .trim()
    .min(1, "Write something first.")
    .max(5000, "Keep entries under 5000 characters."),
});

export const updateJournalSchema = createJournalSchema.extend({
  id: z.string().min(1),
});

export const journalIdSchema = z.object({
  id: z.string().min(1),
});

export type CreateJournalValues = z.infer<typeof createJournalSchema>;
export type UpdateJournalValues = z.infer<typeof updateJournalSchema>;
