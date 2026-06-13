Introductions:

- Follow Next.js 16 App Router best practices
- Use React Server Components by default
- Implement type-safe server actions using next-safe-action
- Follow mobile-first responsive design with Tailwind CSS
- Use Shadcn UI components with Base UI primitives from `@acme/components`
- Optimize for Core Web Vitals
- Optimize for SEO
- Implement proper meta tags
- Use static generation where possible
- Optimize images using next/image
- Implement proper accessibility
- Focus on performance optimization
- Whenever possible, use React's useTransition hooks for loading states.

TypeScript Conventions:

- Use interfaces over types when possible
- Avoid enums, use const objects instead
- Use strict type checking

Code Style:

- Use functional programming patterns
- Avoid classes
- Use pure functions where possible
- Use meaningful variable names
- Keep functions small and focused
- Tailwind: when height and width are the same, use `size-*` instead of separate `h-*` and `w-*`
- Tailwind: use `cn()` from `@/lib/utils` for conditional or composed classNames instead of template literals with `${}`

Git Conventions:

- Use conventional commits
- Keep PRs focused and small
- Include proper documentation
- Add meaningful tests (if any)

Performance

- Implement proper caching techniques
- Optimize build sizes
- Use code splitting
- Implement proper lazy loading

Component Structure:

1. Exports
2. Types/Interfaces
3. Server actions (if any; through next-safe-action in `@/lib/server-actions`)
4. Component Logic
5. Helper functions
6. Static Content

Naming:

- Use kebab-case for directories
- PascalCase for components but kebab-case for component file names
- camelCase for functions and variables
- Use descriptive names with auxiliary verbs (isLoading, hasError)

Error Handling:

- Create custom error classes for different error types
- Use zod for validation with clear error messages
- Implement error boundaries for critical UI sections
- For server actions and API routes:
  - Return structured error responses with appropriate status codes
  - Use try/catch with specific error handling
- For UI components:
  - Show skeleton loaders during data fetching
  - Provide fallbacks for missing data
  - Use optional chaining for safer data access

Dependencies
- Use motion/react instead of framer-motion. It's the same thing.
- Always check `@/hooks/` for existing hooks that may be applicable
- Always check `@/lib` for existing useful functions that may be applicable
- Always check `@/components` for existing components that may be applicable
- Hardcoded variables should be placed at `@/config` and always be checked as well that may be applicable
- Shared UI lives in `@acme/components`; form helpers live in `@acme/forms`

@file tsconfig.json

Directory Structure Guide:

- src/app:
  - Use Next.js 16 App Router with React Server Components by default
  - Prefer server data fetching; use Suspense and streaming where appropriate
  - Use `next-safe-action` for type-safe server actions (in `@/lib/server-actions`)
  - Co-locate route-specific UI and logic; keep shared pieces in `@/components` or `@/lib`
  - Optimize SEO with proper `metadata` and `generateMetadata`

- src/components:
  - Use Shadcn UI and Base UI primitives from `@acme/components`; compose small, accessible components
  - Keep components pure and stateless when possible; state lives at the edge
  - Export components first; follow the Component Structure ordering listed above
  - Use `next/image` for images; ensure responsive and optimized usage

- src/hooks:
  - Encapsulate reusable client-side logic; prefer stable signatures and strong typing
  - Debounce, media, and UX hooks should be resilient to SSR and hydration

- src/lib:
  - Place framework-agnostic utilities, formatters, validators (Zod), and helpers
  - Implement `@/lib/server-actions` using `next-safe-action` with explicit schemas

- src/server:
  - Keep server-only logic: auth, services, data loaders, rate limiting
  - Use custom error classes from `@/server/classes` for predictable handling
  - Avoid classes elsewhere; favor small, composable pure functions

- src/env:
  - Centralize env parsing and exposure; never access `process.env` directly in app code
  - Expose only whitelisted client envs via dedicated client module

- src/config:
  - Store app/site/UI configuration constants; avoid scattering hardcoded values
  - Co-locate SEO and site config here; import where needed

- src/styles:
  - Global styles in `globals.css`; prefer utility-first Tailwind for component styling
  - Maintain accessible contrast and responsive behavior (mobile-first)

- src/cache:
  - Centralize caching helpers and revalidation logic; leverage Next caching primitives

- src/proxy.ts:
  - Keep middleware minimal and fast; avoid heavy logic to protect TTFB

- src/app/api:
  - Route handlers should be typed, validated (Zod), and return structured errors
  - Enforce rate limiting and auth where required via `@/server/services`
