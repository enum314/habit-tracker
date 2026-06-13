"use client";

import { useOptimistic, useState, useTransition } from "react";

import { toast } from "sonner";

import type { HabitForToday } from "@/server/services/habits";

import { toggleHabitLogAction } from "../_actions/habits";
import { HabitItem } from "./habit-item";

interface HabitListProps {
  habits: HabitForToday[];
}

function applyToggle(habit: HabitForToday): HabitForToday {
  const completedToday = !habit.completedToday;
  const delta = completedToday ? 1 : -1;

  return {
    ...habit,
    completedToday,
    weekCount: Math.max(0, habit.weekCount + delta),
    currentStreak: Math.max(0, habit.currentStreak + delta),
  };
}

export function HabitList({ habits }: HabitListProps) {
  const [optimisticHabits, setOptimisticHabit] = useOptimistic(
    habits,
    (state, habitId: string) =>
      state.map((habit) => (habit.id === habitId ? applyToggle(habit) : habit))
  );
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function handleToggle(habitId: string) {
    startTransition(async () => {
      setPendingId(habitId);
      setOptimisticHabit(habitId);

      const response = await toggleHabitLogAction({ habitId });

      if (response?.serverError || response?.validationErrors) {
        toast.error(response.serverError ?? "Could not update habit.");
      }

      setPendingId(null);
    });
  }

  return (
    <div className="space-y-3">
      {optimisticHabits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          onToggle={handleToggle}
          isToggling={pendingId === habit.id}
        />
      ))}
    </div>
  );
}
