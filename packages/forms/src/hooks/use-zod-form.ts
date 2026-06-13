"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  type FieldValues,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";
import type { z } from "zod";

// This hook is a wrapper around `useForm` that adds the `schema` prop.
export function useZodForm<Schema extends z.ZodType<FieldValues, any, any>>(
  props: Omit<UseFormProps<z.infer<Schema>>, "resolver"> & {
    schema: Schema;
  }
): UseFormReturn<z.infer<Schema>, any, z.infer<Schema>> {
  const form = useForm<z.infer<Schema>, any, z.infer<Schema>>({
    ...props,
    resolver: zodResolver<z.infer<Schema>, any, z.infer<Schema>>(props.schema),
  });

  return form;
}
