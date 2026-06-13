"use client";

import { forwardRef, useCallback } from "react";

import { cn } from "@acme/utils/cn";
import { IMaskInput } from "react-imask";
import { z } from "zod";

const MIN_VALUE = 0;
const MAX_VALUE = 100;

export interface PercentageValueInputProps {
  id?: string;
  className?: string;
  value?: number;

  onValueChange?: (value: number) => void;
  disabled?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
}

const PercentageValueInput = forwardRef<
  HTMLInputElement,
  PercentageValueInputProps
>(
  (
    { id, className, value, onValueChange, disabled, readOnly, autoComplete },
    ref
  ) => {
    const handleValueChange = useCallback(
      (value: string) => {
        const numericValue = value.replace(",", "");
        const microUnits = Math.round(parseFloat(numericValue) * 100);

        onValueChange?.(Number.isFinite(microUnits) ? microUnits : 0);
      },
      [onValueChange]
    );

    return (
      <div className="relative w-full">
        <IMaskInput
          id={id}
          className={cn(
            "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            "pr-7 text-right",
            className
          )}
          onAccept={handleValueChange}
          mask={Number}
          placeholder={"0.00"}
          thousandsSeparator=","
          normalizeZeros={true}
          radix="."
          mapToRadix={["."]}
          ref={ref}
          value={value ? (value / 100).toFixed(2) : ""}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete={autoComplete}
          min={MIN_VALUE}
          max={MAX_VALUE}
        />
        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-sm">
          %
        </div>
      </div>
    );
  }
);

PercentageValueInput.displayName = "PercentageValueInput";

const percentageValueSchema = z
  .number()
  .min(MIN_VALUE, "Must be a minimum of 0")
  .max(MAX_VALUE, "Must be a maximum of 100");

export { PercentageValueInput, percentageValueSchema };
