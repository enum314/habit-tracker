---
name: shadcn-field-forms
description: Guidelines for building and migrating forms using shadcn Field components with React Hook Form and Zod in this project. Use when implementing or refactoring any form that should follow the shadcn/ui React Hook Form pattern.
---

# shadcn Field + React Hook Form Forms

## When to Use This Skill

Use these instructions whenever:

- Implementing a **new form** in `src/app` or `src/components` that should follow the shadcn/ui React Hook Form pattern from [`React Hook Form - shadcn/ui`](https://ui.shadcn.com/docs/forms/react-hook-form).
- **Migrating existing forms** off the legacy `Form`/`FormField`/`FormItem` API to use:
  - `Controller` from `react-hook-form`
  - `Field` primitives from `@acme/components/ui/field`
  - Zod schemas with the shared `useZodForm` hook from `@acme/forms`
- Adjusting form markup for **accessibility**, **consistent styling**, and **error display**.

This project already provides:

- `@acme/components/ui/field` – shadcn-style `Field` primitives.
- `@acme/components/ui/input`, `select`, etc. – form controls.
- `@acme/forms/hooks/use-zod-form` – a wrapper around `useForm` with Zod resolver.
- `@acme/forms/handle-server-action-response` – handles server action results and can set validation errors on the form when `form` is passed.

Always prefer this pattern over ad-hoc `<form>` handling or manually wiring `register` unless there is a strong reason not to.

---

## Core Patterns

### 1. Form State Setup (React Hook Form + Zod)

Always use the shared `useZodForm` hook with a Zod schema:

```ts
const formSchema = z.object({
  // fields...
});

type FormValues = z.infer<typeof formSchema>;

const form = useZodForm({
  schema: formSchema,
  defaultValues: {
    // defaults...
  },
});
```

**Rules:**

- Put the Zod schema **near the top** of the file, above the component.
- Use `z.infer<typeof schema>` for strong typing of `FormValues`.
- Keep `defaultValues` in sync with the schema.

### 2. Use Controller + Field Components

For each field, use `Controller` from `react-hook-form` together with `Field` components from `@acme/components/ui/field`:

```tsx
<FieldGroup>
  <Controller
    name="name"
    control={form.control}
    render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid}>
        <FieldLabel htmlFor="example-name">Name</FieldLabel>
        <Input id="example-name" aria-invalid={fieldState.invalid} {...field} />
        <FieldDescription>Helpful description for the field.</FieldDescription>
        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
      </Field>
    )}
  />
</FieldGroup>
```

**Key points:**

- **Always**:
  - Wrap related fields in a `FieldGroup`.
  - Use `Controller`’s `render` prop, not `FormField`.
  - Pass `data-invalid={fieldState.invalid}` to `Field`.
  - Set `aria-invalid={fieldState.invalid}` on the underlying control.
  - Use `FieldError` with `errors={[fieldState.error]}` when `fieldState.invalid` is true.
- Use **stable, unique IDs** for `htmlFor`/`id` per field (e.g. `app-profile-name`).

### 3. Basic Form Structure

Wrap inputs in a regular `<form>` element and use `form.handleSubmit`:

```tsx
<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
  {/* FieldGroup + Controllers go here */}
  <Button type="submit" disabled={isPending}>
    {isPending ? "Saving..." : "Save"}
  </Button>
</form>
```

**Rules:**

- Use `useTransition` for async submit handlers when the form triggers server work.
- Do **not** wrap forms in the legacy `Form` provider from `@acme/components/ui/form` unless a specific existing flow still depends on it.
- Keep submit buttons outside of `FieldGroup` but inside the `<form>`.

### 4. Validation and Error Display

Validation is handled via Zod + `useZodForm` + React Hook Form. To display errors:

- `Field` gets `data-invalid={fieldState.invalid}`.
- The control gets `aria-invalid={fieldState.invalid}`.
- Use `FieldError` when invalid:

```tsx
{
  fieldState.invalid && <FieldError errors={[fieldState.error]} />;
}
```

For non-field errors (e.g. global server error), use your existing toast helpers (`toast.error`) or a higher-level error component; **do not** overload `FieldError` for cross-field or global messages.

### 5. Server Actions and Validation Errors

When the form submits to a server action (e.g. next-safe-action), use `handleServerActionResponse` from `@acme/forms/handle-server-action-response` and **pass the `form`** instance so server validation errors are applied to the form automatically:

```ts
import { handleServerActionResponse } from "@acme/forms/handle-server-action-response";

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

- Passing **`form`** causes validation errors from the server to be set on the form (via `setFormValidationErrors`); you do **not** need to implement `onValidationError` and loop over errors with `form.setError` unless you need extra behavior (e.g. a toast or analytics).

---

## Migration Guidelines (Legacy Form → Field Pattern)

When you see legacy usage like:

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

follow this migration process:

1. **Imports**
   - Remove `Form`, `FormField`, `FormItem`, `FormLabel`, `FormDescription`, `FormMessage`, `FormControl` imports.
   - Add:
     - `Controller` from `react-hook-form`.
     - `Field`, `FieldGroup`, `FieldLabel`, `FieldDescription`, `FieldError` from `@/components/ui/field`.

2. **Provider/Wrapper**
   - Replace:

     ```tsx
     <Form {...form}>
       <form onSubmit={form.handleSubmit(onSubmit)}>...</form>
     </Form>
     ```

   - With a single `<form>`:

     ```tsx
     <form onSubmit={form.handleSubmit(onSubmit)}>...</form>
     ```

3. **Field Blocks**
   - For each `FormField`:

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

   - Convert to:

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

4. **Styling**
   - Preserve layout by keeping surrounding `Card`, `CardContent`, `CardFooter`, etc. intact.
   - Wrap `Controller` blocks with `FieldGroup` and reuse existing spacing classes on parent containers (e.g. `space-y-4`, `space-y-6`).

---

## Accessibility Checklist

For every form field:

- [ ] `Field` has `data-invalid={fieldState.invalid}`.
- [ ] Input/select/textarea has:
  - [ ] `id` that matches `FieldLabel`’s `htmlFor`.
  - [ ] `aria-invalid={fieldState.invalid}`.
- [ ] Errors rendered via `FieldError` when invalid.
- [ ] Descriptive `FieldDescription` present when additional context is needed.

For the `form`:

- [ ] `onSubmit={form.handleSubmit(onSubmit)}`.
- [ ] Submit buttons use `type="submit"`.
- [ ] Async submissions use `useTransition` and show a clear loading state.

---

## Examples From This Project

When in doubt, follow the Field + Controller patterns in this skill and reuse helpers from `@acme/forms` and UI from `@acme/components`.
