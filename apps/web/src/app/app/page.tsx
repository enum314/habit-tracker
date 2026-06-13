import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@acme/components/ui/empty";
import { ListChecksIcon, NotebookPenIcon } from "lucide-react";

import { getCurrentUser } from "@/cache/session";
import { getHabitsForToday } from "@/server/services/habits";
import { getJournalEntries } from "@/server/services/journal";

import { CreateHabitButton } from "./_components/create-habit-button";
import { CreateJournalButton } from "./_components/create-journal-button";
import { HabitList } from "./_components/habit-list";
import { JournalList } from "./_components/journal-list";

export default async function Page() {
  const user = await getCurrentUser<true>();
  const [habits, entries] = await Promise.all([
    getHabitsForToday(user.id),
    getJournalEntries(user.id),
  ]);

  return (
    <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
      <section className="order-2 space-y-4 lg:order-1">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <NotebookPenIcon className="text-muted-foreground size-5" />
            <div>
              <h2 className="text-lg font-semibold">Journal</h2>
              <p className="text-muted-foreground text-sm">
                Reflect on your day
              </p>
            </div>
          </div>
          <CreateJournalButton />
        </header>

        {entries.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <NotebookPenIcon />
              </EmptyMedia>
              <EmptyTitle>No entries yet</EmptyTitle>
              <EmptyDescription>
                Write your first journal entry to start reflecting.
              </EmptyDescription>
            </EmptyHeader>
            <CreateJournalButton />
          </Empty>
        ) : (
          <JournalList entries={entries} />
        )}
      </section>

      <section className="order-1 space-y-4 lg:order-2 lg:border-l lg:pl-10">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ListChecksIcon className="text-muted-foreground size-5" />
            <div>
              <h2 className="text-lg font-semibold">Today</h2>
              <p className="text-muted-foreground text-sm">
                Build your daily habits
              </p>
            </div>
          </div>
          <CreateHabitButton />
        </header>

        {habits.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ListChecksIcon />
              </EmptyMedia>
              <EmptyTitle>No habits yet</EmptyTitle>
              <EmptyDescription>
                Create your first habit to start building a streak.
              </EmptyDescription>
            </EmptyHeader>
            <CreateHabitButton />
          </Empty>
        ) : (
          <HabitList habits={habits} />
        )}
      </section>
    </div>
  );
}
