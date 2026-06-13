# shadcn Field + React Hook Form Forms (Agent View)

This document is an expanded, agent-optimized view of the `shadcn-field-forms` skill. It summarizes the most important rules you should follow when working with forms in this repository.

## When You Should Apply This Skill

Apply these rules when:

- You see a form in `src/app/**` or `src/components/**` that:
  - Uses `react-hook-form`, `FormField`, or `FormItem`, or
  - Handles `<form>` state manually without React Hook Form.
- You are asked to:
  - Create or modify a form.
  - Add a new field to an existing form.
  - Migrate a form to shadcn/ui’s React Hook Form pattern.

Default to **using this pattern** for any non-trivial form.

---

## Golden Rules

1. **Always use Zod + `useZodForm` for schema-based validation.**
2. **Use `Controller` + `Field` primitives, not legacy `FormField`/`FormItem`.**
3. **Keep each field inside a `FieldGroup` and a `Field`.**
4. **Wire validation and accessibility:**
   - `Field` gets `data-invalid={fieldState.invalid}`.
   - Control gets `aria-invalid={fieldState.invalid}`.
   - `FieldError` shows when invalid.
5. **Wrap everything in a plain `<form>` with `onSubmit={form.handleSubmit(onSubmit)}`.**

If any of these are missing, refactor toward this pattern unless it clearly breaks an existing, intentional design.

---

## Canonical Imports

In client components (`"use client"` at the top), prefer these imports:

```ts
import { Controller } from "react-hook-form";
import { z } from "zod";

import { Button } from "@acme/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@acme/components/ui/field";
import { Input } from "@acme/components/ui/input";
import { useZodForm } from "@acme/forms/hooks/use-zod-form";
```

For forms that call server actions, also import:

```ts
import { handleServerActionResponse } from "@acme/forms/handle-server-action-response";
```

Only import additional controls (`Select`, `Textarea`, etc.) as needed.

**Do not** introduce new local form abstractions; reuse these shared building blocks.

---

## Form Setup Pattern

### 1. Define Schema and Types

```ts
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
});

type FormValues = z.infer<typeof formSchema>;
```

### 2. Initialize `useZodForm`

```ts
const form = useZodForm({
  schema: formSchema,
  defaultValues: {
    name: initialName ?? "",
    email: initialEmail ?? "",
  },
});
```

- Keep `defaultValues` consistent with the schema.
- Use clear, explicit defaults; don’t rely on `undefined` for required fields.

### 3. Handle Submit

```ts
const [isPending, startTransition] = useTransition();

function onSubmit(values: FormValues) {
  startTransition(async () => {
    // Async server action, authClient call, etc.
  });
}
```

- Use `useTransition` for async work to keep the UI responsive.
- Use existing helpers (`toast`, `handleServerActionResponse`) instead of raw `fetch` when available.

### 4. Server Actions and Validation Errors

When the form submits to a **server action** (e.g. next-safe-action), use `handleServerActionResponse` from `@acme/forms/handle-server-action-response` and **pass `form`** so server validation errors are applied to the form automatically:

```ts
import { handleServerActionResponse } from "@acme/forms/handle-server-action-response";

// In onSubmit:
await handleServerActionResponse(await someServerAction({ ...formValues }), {
  form,
  onSuccess() {
    toast.success("Saved.");
  },
  onError(error) {
    toast.error(error.message ?? "Something went wrong.");
  },
});
```

- **Pass `form`** – validation errors from the server are then set on the form via `setFormValidationErrors`; no manual `onValidationError` loop with `form.setError` is needed.
- Use `onValidationError` only when you need extra behavior (e.g. analytics or a toast) in addition to showing errors on the fields.

---

## Field Rendering Pattern

Render each field via `Controller` + `Field`:

```tsx
<FieldGroup>
  <Controller
    name="name"
    control={form.control}
    render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid}>
        <FieldLabel htmlFor="example-name">Name</FieldLabel>
        <Input id="example-name" aria-invalid={fieldState.invalid} {...field} />
        <FieldDescription>This is your public display name.</FieldDescription>
        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
      </Field>
    )}
  />

  {/* Add other fields in the same FieldGroup */}
</FieldGroup>
```

### ID and Label Rules

- Every field must have:
  - A **unique, stable** `id` on the control.
  - A matching `FieldLabel htmlFor={id}`.
- Use descriptive IDs:
  - `app-profile-name`
  - `app-profile-email`

### When Adding New Fields

Follow this order inside `Field`:

1. `FieldLabel`
2. Control (`Input`, `Select`, etc.)
3. `FieldDescription`
4. Conditional `FieldError`

Maintaining this order ensures consistent layout and a11y.

---

## Migration Rules (Legacy → Field Pattern)

When you encounter this legacy pattern:

```tsx
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/components/ui/form";
```

**Do this:**

1. **Replace imports**:
   - Remove `Form`, `FormField`, `FormItem`, `FormLabel`, `FormDescription`, `FormMessage`, `FormControl`.
   - Add `Controller` and `Field` imports as shown above.

2. **Remove `<Form>` wrapper**:
   - From:

     ```tsx
     <Form {...form}>
       <form onSubmit={form.handleSubmit(onSubmit)}>{/* ... */}</form>
     </Form>
     ```

   - To:

     ```tsx
     <form onSubmit={form.handleSubmit(onSubmit)}>{/* ... */}</form>
     ```

3. **Convert each `FormField`**:
   - From:

     ```tsx
     <FormField
       control={form.control}
       name="name"
       render={({ field }) => (
         <FormItem>
           <FormLabel>Name</FormLabel>
           <FormControl>
             <Input {...field} />
           </FormControl>
           <FormDescription>...</FormDescription>
           <FormMessage />
         </FormItem>
       )}
     />
     ```

   - To:

     ```tsx
     <Controller
       name="name"
       control={form.control}
       render={({ field, fieldState }) => (
         <Field data-invalid={fieldState.invalid}>
           <FieldLabel htmlFor="new-name-id">Name</FieldLabel>
           <Input
             id="new-name-id"
             aria-invalid={fieldState.invalid}
             {...field}
           />
           <FieldDescription>...</FieldDescription>
           {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
         </Field>
       )}
     />
     ```

4. **Group fields**:
   - Wrap converted `Controller` components in a `FieldGroup` and preserve existing spacing classes on parent wrappers (`CardContent`, etc.).

---

## Accessibility and UX Checklist

Before considering a form “done”, check:

- **Per-field**
  - [ ] `Field` has `data-invalid={fieldState.invalid}`.
  - [ ] Control has `aria-invalid={fieldState.invalid}`.
  - [ ] `FieldLabel` is present and uses `htmlFor` bound to control `id`.
  - [ ] Descriptive `FieldDescription` exists for non-obvious fields.
  - [ ] `FieldError` appears only when validation fails.

- **Form-level**
  - [ ] `onSubmit={form.handleSubmit(onSubmit)}` is used.
  - [ ] Buttons have correct `type` (`submit`, `button`).
  - [ ] `useTransition` is used for async submissions, with a clear loading state.
  - [ ] No swallowed async errors: use `toast` or existing helpers like `handleServerActionResponse`.
  - [ ] For server actions: pass `form` to `handleServerActionResponse` so validation errors appear on the form.

---

## How to Use This Skill in Practice

When writing or editing code:

1. **Scan imports** of the file for legacy form components or manual form handling.
2. **Decide** if the form is a good candidate for the Field pattern (it usually is).
3. **Apply the migration rules**:
   - Introduce or adjust schema + `useZodForm`.
   - Replace legacy `FormField` blocks with `Controller + Field`.
   - Ensure IDs, labels, and invalid states are wired correctly.
4. **Keep structure consistent** with the Field + Controller pattern described above.
5. **Server actions**: Use `handleServerActionResponse` with `form` so server validation errors are set on the form automatically; avoid manual `onValidationError` + `form.setError` loops unless you need extra logic.

Favor **consistency and readability** over clever abstractions. The main goal is that any engineer (or agent) can open a form file and immediately recognize the pattern.
