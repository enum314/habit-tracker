"use client";

import { useState } from "react";

import { cn } from "@acme/utils/cn";
import { CheckIcon, CopyIcon } from "lucide-react";

interface CopyButtonProps {
  value: string;
  className?: string;
  classNames?: {
    icon?: string;
  };
}

export function CopyButton({ value, className, classNames }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (
      typeof window === "undefined" ||
      !navigator.clipboard.writeText ||
      !value
    ) {
      return;
    }

    navigator.clipboard.writeText(value).then(
      () => {
        setCopied(true);

        setTimeout(() => setCopied(false), 1000);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  return (
    <button className={cn(className)} type="button" onClick={copyToClipboard}>
      {copied ? (
        <CheckIcon className={cn("size-4", classNames?.icon)} />
      ) : (
        <CopyIcon className={cn("size-4", classNames?.icon)} />
      )}
    </button>
  );
}
