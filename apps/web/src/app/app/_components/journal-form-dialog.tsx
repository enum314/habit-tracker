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

import { getToday, toDateKey } from "@/lib/date";
import {
  createJournalSchema,
  type CreateJournalValues,
} from "@/lib/validators/journal";

import {
  createJournalEntryAction,
  updateJournalEntryAction,
} from "../_actions/journal";

export interface JournalFormValues {
  id: string;
  date: string;
  title: string | null;
  content: string;
}

interface JournalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: JournalFormValues;
}

export function JournalFormDialog({
  open,
  onOpenChange,
  entry,
}: JournalFormDialogProps) {
  const isEditing = Boolean(entry);
  const [isPending, startTransition] = useTransition();

  const form = useZodForm({
    schema: createJournalSchema,
    defaultValues: {
      date: entry?.date ?? toDateKey(getToday()),
      title: entry?.title ?? "",
      content: entry?.content ?? "",
    },
  });

  function onSubmit(values: CreateJournalValues) {
    startTransition(async () => {
      const response = isEditing
        ? await updateJournalEntryAction({ ...values, id: entry!.id })
        : await createJournalEntryAction(values);

      await handleServerActionResponse(response, {
        form,
        onSuccess() {
          toast.success(isEditing ? "Entry updated." : "Entry saved.");
          onOpenChange(false);
          if (!isEditing) {
            form.reset({
              date: toDateKey(getToday()),
              title: "",
              content: "",
            });
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
          <DialogTitle>{isEditing ? "Edit entry" : "New entry"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your journal entry."
              : "Capture what's on your mind today."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="journal-date">Date</FieldLabel>
                  <Input
                    id="journal-date"
                    type="date"
                    className="w-44"
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
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="journal-title">Title</FieldLabel>
                  <Input
                    id="journal-title"
                    placeholder="Optional title"
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
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="journal-content">Entry</FieldLabel>
                  <Textarea
                    id="journal-content"
                    placeholder="How was your day?"
                    className="min-h-40"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
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
              {isEditing ? "Save changes" : "Save entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
