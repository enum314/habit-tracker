"use client";

import { forwardRef, useMemo, useState } from "react";

import { useForwardedRef } from "@acme/hooks/use-forwarded-ref";
import { cn } from "@acme/utils/cn";
import { HexColorPicker } from "react-colorful";

import type { ButtonProps } from "./button";
import { Button } from "./button";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

const ColorPicker = forwardRef<
  HTMLInputElement,
  Omit<ButtonProps, "value" | "onChange" | "onBlur"> &
    ColorPickerProps &
    ButtonProps
>(
  (
    { disabled, value, onChange, onBlur, name, className, size, ...props },
    forwardedRef
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const [open, setOpen] = useState(false);

    const parsedValue = useMemo(() => {
      return value || "#FFFFFF";
    }, [value]);

    return (
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger
          render={
            <Button
              {...props}
              className={cn("block", className)}
              name={name}
              onClick={() => {
                setOpen(true);
              }}
              size={size}
              style={{
                backgroundColor: parsedValue,
              }}
              variant="outline"
            />
          }
          disabled={disabled}
          onBlur={onBlur}
          nativeButton={true}
        >
          <div />
        </PopoverTrigger>
        <PopoverContent className="w-full">
          <HexColorPicker color={parsedValue} onChange={onChange} />
          <Input
            maxLength={7}
            onChange={(e) => {
              onChange(e?.currentTarget?.value);
            }}
            ref={ref}
            value={parsedValue}
          />
        </PopoverContent>
      </Popover>
    );
  }
);
ColorPicker.displayName = "ColorPicker";

export { ColorPicker };
