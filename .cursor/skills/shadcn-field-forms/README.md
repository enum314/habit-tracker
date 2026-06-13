# shadcn Field Forms Skill

Conventions and patterns for building and migrating forms in this repository using:

- `react-hook-form` controllers
- Zod schemas via `useZodForm`
- shadcn Field primitives from `@/components/ui/field`
- Shadcn inputs (`@/components/ui/input`, `select`, etc.)

## Files

- `SKILL.md` – Main instructions for agents on how to:
  - Set up `useZodForm` with schemas and default values.
  - Use `Controller` with `Field`, `FieldGroup`, `FieldLabel`, `FieldDescription`, and `FieldError`.
  - Structure `<form>` tags, submit handlers, and loading states.
  - Migrate legacy `Form`/`FormField`/`FormItem` usage to the new pattern.
- `metadata.json` – Version, organization, abstract, and external references.
- `AGENTS.md` – Optional compiled/expanded version of the skill (can be generated later if needed).

## Scope

Applies primarily to:

- Forms under `src/app/**` (Next.js App Router pages and route components).
- Shared client components under `src/components/**` that manage user input.

The goal is to keep all forms:

- Consistent in structure and styling.
- Accessible (`aria-invalid`, clear labels, descriptions, error messages).
- Type-safe via Zod and `react-hook-form`.

