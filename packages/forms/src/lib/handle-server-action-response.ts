import type { SafeActionResult } from "next-safe-action";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

/** Shape of a single field's validation error from next-safe-action */
type ValidationErrorValue = { _errors?: string[] } | string[];

/**
 * Sets React Hook Form field errors from next-safe-action validation errors.
 * Use when you pass `form` to handleServerActionResponse so errors appear on the form.
 */
export function setFormValidationErrors<Form extends FieldValues>(
  form: UseFormReturn<Form>,
  validationErrors: Record<string, ValidationErrorValue>
): void {
  for (const [field, error] of Object.entries(validationErrors)) {
    const message = Array.isArray(error)
      ? error.join(", ")
      : (error._errors?.join(", ") ?? "Validation error");

    form.setError(field as Path<Form>, { message });
  }
}

export interface ServerActionError {
  type: "server" | "validation" | "unknown";
  message?: string;
}

export interface ServerActionSuccess<Data> {
  ok: true;
  data: Data;
}

export interface ServerActionFailure {
  ok: false;
  error: ServerActionError;
}

export interface HandleServerActionOptions<
  Data,
  ValidationErrors,
  Form extends FieldValues = FieldValues,
> {
  onSuccess?: (data: Data) => void | Promise<void>;
  onError?: (error: ServerActionError) => void | Promise<void>;
  onValidationError?: (errors: ValidationErrors) => void | Promise<void>;
  /** When provided, validation errors are set on the form automatically. */
  form?: UseFormReturn<Form>;
}

export async function handleServerActionResponse<
  Data,
  ValidationErrors,
  Form extends FieldValues = FieldValues,
>(
  response:
    | SafeActionResult<string, any, ValidationErrors, Data, unknown>
    | undefined,
  options: HandleServerActionOptions<Data, ValidationErrors, Form> = {}
): Promise<ServerActionSuccess<Data> | ServerActionFailure> {
  if (response?.data) {
    const data = response.data as Data;

    if (options.onSuccess) {
      await options.onSuccess(data);
    }

    return {
      ok: true,
      data,
    };
  }

  if (response?.serverError) {
    const message = response.serverError;

    const error: ServerActionError = {
      type: "server",
      message,
    };

    if (options.onError) {
      await options.onError(error);
    }

    return {
      ok: false,
      error,
    };
  }

  if (response?.validationErrors) {
    const error: ServerActionError = {
      type: "validation",
      message: "Validation error",
    };

    const validationErrors = response.validationErrors as Record<
      string,
      ValidationErrorValue
    >;

    if (options.form) {
      setFormValidationErrors<Form>(options.form, validationErrors);
    }

    if (options.onValidationError) {
      await options.onValidationError(response.validationErrors);
    }

    return {
      ok: false,
      error,
    };
  }

  const error: ServerActionError = {
    type: "unknown",
    message: "Unknown error",
  };

  if (options.onError) {
    await options.onError(error);
  }

  return {
    ok: false,
    error,
  };
}
