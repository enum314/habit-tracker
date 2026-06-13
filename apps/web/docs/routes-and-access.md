# Routes and access

## Public routes

| Path | Notes |
|------|-------|
| `/auth/signin` | Google OAuth (`/auth/signup` redirects here) |

## Authenticated routes (proxy matcher)

| Path | Gate |
|------|------|
| `/app/*` | Signed in |

## Redirect safety

- Proxy and auth page use `isSafeRelativeRedirectPath` / `sanitizeRedirectPath`
- Unsafe `from` values fall back to `/app`
