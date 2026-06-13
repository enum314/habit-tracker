"use client";

import { useTransition } from "react";

import { Button } from "@acme/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@acme/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@acme/components/ui/field";
import { Input } from "@acme/components/ui/input";
import { Textarea } from "@acme/components/ui/textarea";
import { handleServerActionResponse } from "@acme/forms/handle-server-action-response";
import { useZodForm } from "@acme/forms/hooks/use-zod-form";
import { Controller } from "react-hook-form";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  createHabitSchema,
  HABIT_COLORS,
  type CreateHabitValues,
} from "@/lib/validators/habit";

import { createHabitAction, updateHabitAction } from "../_actions/habits";

export interface HabitFormValues {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  weeklyTarget: number | null;
}

interface HabitFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit?: HabitFormValues;
}

export function HabitFormDialog({
  open,
  onOpenChange,
  habit,
}: HabitFormDialogProps) {
  const isEditing = Boolean(habit);
  const [isPending, startTransition] = useTransition();

  const form = useZodForm({
    schema: createHabitSchema,
    defaultValues: {
      name: habit?.name ?? "",
      description: habit?.description ?? "",
      icon: habit?.icon ?? "",
      color: habit?.color ?? "",
      weeklyTarget: habit?.weeklyTarget ?? null,
    },
  });

  function onSubmit(values: CreateHabitValues) {
    startTransition(async () => {
      const response = isEditing
        ? await updateHabitAction({ ...values, id: habit!.id })
        : await createHabitAction(values);

      await handleServerActionResponse(response, {
        form,
        onSuccess() {
          toast.success(isEditing ? "Habit updated." : "Habit created.");
          onOpenChange(false);
          if (!isEditing) {
            form.reset();
          }
        },
        onError(error) {
          toast.error(error.message ?? "Something went wrong.");
        },
      });
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit habit" : "New habit"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of your habit."
              : "Add a habit to track every day."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="habit-name">Name</FieldLabel>
                  <Input
                    id="habit-name"
                    placeholder="Drink water"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="habit-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    id="habit-description"
                    placeholder="Optional notes about this habit"
                    aria-invalid={fieldState.invalid}
                    {...field}
                    value={field.value ?? ""}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="icon"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="habit-icon">Icon</FieldLabel>
                  <Input
                    id="habit-icon"
                    placeholder="💧"
                    className="w-20 text-center text-lg"
                    aria-invalid={fieldState.invalid}
                    {...field}
                    value={field.value ?? ""}
                  />
                  <FieldDescription>
                    Paste a single emoji to represent this habit.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="color"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Color</FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    {HABIT_COLORS.map((color) => {
                      const selected = field.value === color;
                      return (
                        <button
                          key={color}
                          type="button"
                          aria-label={`Select color ${color}`}
                          aria-pressed={selected}
                          onClick={() => field.onChange(selected ? "" : color)}
                          className={cn(
                            "size-7 rounded-full border transition-[transform,box-shadow]",
                            selected
                              ? "ring-ring ring-offset-background scale-110 ring-2 ring-offset-2"
                              : "hover:scale-105"
                          )}
                          style={{ backgroundColor: color }}
                        />
                      );
                    })}
                  </div>
                </Field>
              )}
            />

            <Controller
              name="weeklyTarget"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="habit-weekly-target">
                    Weekly target
                  </FieldLabel>
                  <Input
                    id="habit-weekly-target"
                    type="number"
                    min={1}
                    max={7}
                    inputMode="numeric"
                    placeholder="e.g. 5"
                    className="w-24"
                    aria-invalid={fieldState.invalid}
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    value={field.value ?? ""}
                    onChange={(event) => {
                      const next = event.target.value;
                      field.onChange(next === "" ? null : Number(next));
                    }}
                  />
                  <FieldDescription>
                    Optional. How many days per week you aim to complete this.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isEditing ? "Save changes" : "Create habit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
