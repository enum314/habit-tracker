"use client";

import { useState } from "react";

import { Button } from "@acme/components/ui/button";
import { PlusIcon } from "lucide-react";

import { HabitFormDialog } from "./habit-form-dialog";

export function CreateHabitButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusIcon />
        New habit
      </Button>
      <HabitFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
