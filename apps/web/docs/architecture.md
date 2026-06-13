# Architecture

How the Acme template is organized.

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, RSC by default) |
| Language | TypeScript (strict) |
| UI | Tailwind CSS v4, shadcn-style (Base UI primitives) |
| Auth | Better Auth + `@daveyplate/better-auth-ui` (Google OAuth) |
| Database | PostgreSQL + Prisma 7 (`engineType = "client"`) |
| Server actions | `next-safe-action` via `@/lib/server-actions` |

## Repository layout

```
src/
├── app/
│   ├── app/             # Member hub (/app)
│   ├── auth/            # Sign-in / sign-up
│   └── api/             # Route handlers
├── components/          # Shared UI
├── server/              # Auth, db, services, prisma client
├── lib/                 # Helpers, validations, server-actions clients
├── config/              # Site config
├── cache/               # Session cache
├── env/                 # Typed environment
├── styles/              # globals.css
└── proxy.ts             # Edge auth gate
```

## Auth and session

- **Session:** `getCurrentUser()` from `@/cache/session`
- **`src/proxy.ts`:** Session gate for matched paths; open redirects blocked via `isSafeRelativeRedirectPath`
- **Actions:** `authenticatedActionClient` requires a signed-in user

## Access control

- Authenticated users can access `/app`
- Unauthenticated requests to `/app/*` redirect to `/auth/signin`
