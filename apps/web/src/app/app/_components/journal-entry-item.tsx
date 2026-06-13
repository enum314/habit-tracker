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
import { Button } from "@acme/components/ui/button";
import { Card, CardContent } from "@acme/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/components/ui/dropdown-menu";
import { MoreVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { formatDate } from "@/lib/formatters";

import type { JournalEntryView } from "@/server/services/journal";

import { deleteJournalEntryAction } from "../_actions/journal";
import { JournalFormDialog } from "./journal-form-dialog";

interface JournalEntryItemProps {
  entry: JournalEntryView;
}

export function JournalEntryItem({ entry }: JournalEntryItemProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const response = await deleteJournalEntryAction({ id: entry.id });
      if (response?.data) {
        toast.success("Entry deleted.");
        setDeleteOpen(false);
      } else {
        toast.error(response?.serverError ?? "Could not delete entry.");
      }
    });
  }

  return (
    <Card className="py-0">
      <CardContent className="flex items-start gap-4 p-4">
        <div className="min-w-0 flex-1">
          <div className="flex h-7 items-center gap-2">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              {formatDate(`${entry.date}T00:00:00`)}
            </p>
          </div>

          {entry.title ? <p className="font-medium">{entry.title}</p> : null}

          <p className="mt-1 text-sm whitespace-pre-wrap">{entry.content}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Entry options"
                className="my-px"
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

      <JournalFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        entry={entry}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes this journal entry. This cannot be
              undone.
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
