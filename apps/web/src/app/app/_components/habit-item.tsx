"use client";

import { useState, useTransition } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@acme/components/ui/alert-dialog";
import { Badge } from "@acme/components/ui/badge";
import { Button } from "@acme/components/ui/button";
import { Card, CardContent } from "@acme/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/components/ui/dropdown-menu";
import { Progress } from "@acme/components/ui/progress";
import {
  CheckIcon,
  FlameIcon,
  MoreVerticalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import type { HabitForToday } from "@/server/services/habits";

import { archiveHabitAction, deleteHabitAction } from "../_actions/habits";
import { HabitFormDialog } from "./habit-form-dialog";

interface HabitItemProps {
  habit: HabitForToday;
  onToggle: (habitId: string) => void;
  isToggling: boolean;
}

export function HabitItem({ habit, onToggle, isToggling }: HabitItemProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const hasTarget = typeof habit.weeklyTarget === "number";
  const targetValue = habit.weeklyTarget ?? 0;
  const progress = hasTarget
    ? Math.min(100, Math.round((habit.weekCount / targetValue) * 100))
    : 0;

  function handleArchive() {
    startTransition(async () => {
      const response = await archiveHabitAction({ id: habit.id });
      if (response?.data) {
        toast.success("Habit archived.");
      } else {
        toast.error(response?.serverError ?? "Could not archive habit.");
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const response = await deleteHabitAction({ id: habit.id });
      if (response?.data) {
        toast.success("Habit deleted.");
        setDeleteOpen(false);
      } else {
        toast.error(response?.serverError ?? "Could not delete habit.");
      }
    });
  }

  return (
    <Card className="py-0">
      <CardContent className="flex items-start gap-4 p-4">
        <button
          type="button"
          aria-pressed={habit.completedToday}
          aria-label={
            habit.completedToday
              ? `Mark ${habit.name} as not done`
              : `Mark ${habit.name} as done`
          }
          disabled={isToggling}
          onClick={() => onToggle(habit.id)}
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-full border-2 transition-colors disabled:opacity-50",
            habit.completedToday
              ? "border-primary bg-primary text-primary-foreground"
              : "border-muted-foreground/30 hover:border-primary/60 text-transparent"
          )}
          style={
            habit.completedToday && habit.color
              ? { backgroundColor: habit.color, borderColor: habit.color }
              : undefined
          }
        >
          <CheckIcon className="size-5" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex h-10 items-center gap-2">
            {habit.icon ? (
              <span className="text-lg leading-none">{habit.icon}</span>
            ) : null}
            <p
              className={cn(
                "truncate font-medium",
                habit.completedToday && "text-muted-foreground line-through"
              )}
            >
              {habit.name}
            </p>
          </div>

          {habit.description ? (
            <p className="text-muted-foreground truncate text-sm">
              {habit.description}
            </p>
          ) : null}

          <div className="mt-2 flex min-h-5 flex-wrap items-center gap-2">
            {habit.currentStreak > 0 ? (
              <Badge variant="orange">
                <FlameIcon />
                {habit.currentStreak} day
                {habit.currentStreak === 1 ? "" : "s"}
              </Badge>
            ) : null}

            {hasTarget ? (
              <div className="flex items-center gap-2">
                <Progress value={progress} className="w-28" />
                <span className="text-muted-foreground text-xs tabular-nums">
                  {habit.weekCount}/{targetValue} this week
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Habit options"
                className="my-1.5"
              />
            }
          >
            <MoreVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <PencilIcon />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleArchive} disabled={isPending}>
              <CheckIcon />
              Archive
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2Icon />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>

      <HabitFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        habit={{
          id: habit.id,
          name: habit.name,
          description: habit.description,
          icon: habit.icon,
          color: habit.color,
          weeklyTarget: habit.weeklyTarget,
        }}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this habit?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes &ldquo;{habit.name}&rdquo; and all of its
              history. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isPending}
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
