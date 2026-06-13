"use client";

import { useState } from "react";

import { Button } from "@acme/components/ui/button";
import { PlusIcon } from "lucide-react";

import { JournalFormDialog } from "./journal-form-dialog";

export function CreateJournalButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusIcon />
        New entry
      </Button>
      <JournalFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
