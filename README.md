# Web App Template

pnpm + [Turbo](https://turbo.build) monorepo starter for a single Next.js web app.

Ships with **Google OAuth** sign-in, a protected `/app` member page, PostgreSQL, Redis, and shared UI packages. Default package scope is `@acme/*` — rename it before you build your product.

---

## 1. Use this template

On GitHub, click **Use this template** → **Create a new repository**.

Pick a name for your app repo (for example `my-startup-web`). You will get your own copy without tying it to the template history.

Template source: [github.com/enum314/acme](https://github.com/enum314/acme)

---

## 2. Clone

```bash
git clone git@github.com:<your-org>/<your-repo>.git
cd <your-repo>
```

---

## 3. Install

```bash
pnpm install
docker compose up -d
pnpm setup:env
```

Edit `apps/web/.env` with your secrets (see `apps/web/.env.example`). At minimum:

- `BETTER_AUTH_SECRET`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`

Then prepare the database and start the app:

```bash
pnpm db:migrate
pnpm dev
```

App: http://localhost:3000

---

## 4. Rename

Replace the `acme` placeholder across the monorepo (package scope, site name, CI workflows, `vercel.json`, and more):

```bash
pnpm rename:template -- myapp --display-name "My App"
```

Preview changes first:

```bash
pnpm rename:template -- myapp --display-name "My App" --dry-run
```

After renaming, update branding in `apps/web/src/config/site.ts` (company, email, support URL).

---

## What's included

| Package     | Port (dev) | Path                     | Description                      |
| ----------- | ---------- | ------------------------ | -------------------------------- |
| `@acme/web` | 3000       | [`apps/web/`](apps/web/) | Auth (Google OAuth) + `/app` hub |

Shared workspace packages live under [`packages/`](packages/) (`@acme/components`, `@acme/marketing`, `@acme/utils`, etc.).

---

## Scripts

| Command                | Description                           |
| ---------------------- | ------------------------------------- |
| `pnpm dev`             | Start the app                         |
| `pnpm build`           | Production build                      |
| `pnpm lint`            | Lint                                  |
| `pnpm typecheck`       | Typecheck                             |
| `pnpm db:migrate`      | Run database migrations               |
| `pnpm rename:template` | Rename `@acme/*` to your scope        |
| `pnpm setup:env`       | Copy `apps/web/.env.example` → `.env` |

Filter the app: `pnpm --filter @acme/web dev`

---

## Deploy on Vercel

1. Import the repo and set **Root Directory** to `apps/web`.
2. `apps/web/vercel.json` configures monorepo install/build and skips unchanged deploys.
3. Add env vars from `apps/web/.env.example` in the Vercel dashboard.
4. Run `pnpm --filter @acme/web db:migrate:deploy` against your production database.
