"use client";

import { forwardRef, useCallback } from "react";

import { cn } from "@acme/utils/cn";
import { getCurrencySymbol, type Currency } from "@acme/utils/currency";
import { IMaskInput } from "react-imask";
import { z } from "zod";

const MIN_VALUE = -1_000_000_000_00;
const MAX_VALUE = 1_000_000_000_00;

export interface CurrencyValueInputProps {
  id?: string;
  className?: string;
  value?: number;
  onValueChange?: (value: number) => void;
  currency?: Currency;
  disabled?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  min?: number;
  max?: number;
}

const CurrencyValueInput = forwardRef<
  HTMLInputElement,
  CurrencyValueInputProps
>(
  (
    {
      id,
      className,
      value,
      onValueChange,
      currency,
      disabled,
      readOnly,
      autoComplete,
      min = MIN_VALUE,
      max = MAX_VALUE,
    },
    ref
  ) => {
    const handleValueChange = useCallback(
      (value: string) => {
        if (!value) return onValueChange?.(0);
        const numericValue = value.replace(/,/g, "");
        const microUnits = Math.round(parseFloat(numericValue) * 100);

        onValueChange?.(Number.isFinite(microUnits) ? microUnits : 0);
      },
      [onValueChange]
    );

    return (
      <div className="relative w-full">
        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm">
          {getCurrencySymbol(currency ?? "USD")}
        </div>

        <IMaskInput
          id={id}
          className={cn(
            "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            "text-right",
            className
          )}
          onAccept={handleValueChange}
          mask={Number}
          placeholder="0.00"
          thousandsSeparator=","
          normalizeZeros
          radix="."
          mapToRadix={["."]}
          min={min}
          value={value ? (value / 100).toFixed(2) : ""}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete={autoComplete}
          max={max}
          ref={ref}
        />
      </div>
    );
  }
);

CurrencyValueInput.displayName = "CurrencyInput";

const currencyValueSchema = z
  .number()
  .min(MIN_VALUE, "Must be a minimum of -1,000,000,000.00")
  .max(MAX_VALUE, "Must be a maximum of 1,000,000,000.00");

export { CurrencyValueInput, currencyValueSchema };
