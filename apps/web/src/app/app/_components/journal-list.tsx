import type { JournalEntryView } from "@/server/services/journal";

import { JournalEntryItem } from "./journal-entry-item";

interface JournalListProps {
  entries: JournalEntryView[];
}

export function JournalList({ entries }: JournalListProps) {
  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <JournalEntryItem key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
