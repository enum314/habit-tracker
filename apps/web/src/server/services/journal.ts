import { cache } from "react";

import { toDateKey } from "@/lib/date";

import { db } from "@/server/db";

export interface JournalEntryView {
  id: string;
  date: string;
  title: string | null;
  content: string;
}

/** Loads the user's journal entries, most recent day first. */
export const getJournalEntries = cache(
  async (userId: string): Promise<JournalEntryView[]> => {
    const entries = await db.journalEntry.findMany({
      where: { userId },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      select: { id: true, date: true, title: true, content: true },
    });

    return entries.map((entry) => ({
      id: entry.id,
      date: toDateKey(entry.date),
      title: entry.title,
      content: entry.content,
    }));
  }
);
