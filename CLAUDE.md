# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server
npm run build    # production build
npm run lint     # run ESLint
npx tsc --noEmit # type-check without emitting
```

## Architecture

**ContaUp** is a Brazilian accounting/financial platform (university project). The app is in early development — `TelasHTML/` contains static HTML prototypes that are the source of truth for UI design and are being incrementally converted to React components.

### Directory structure

```
src/
  app/           # Next.js App Router pages and layouts
  features/      # Feature modules (auth, accounting, reports, dashboard)
    <feature>/
      components/
      hooks/
  core/          # Clean-architecture domain layer
    entities/    # Domain models
    services/    # Service interfaces/ports
    usecases/    # Business logic
  services/      # Concrete service implementations (Supabase, etc.)
  ui/            # Shared primitive UI components
  types/         # Shared TypeScript types
  utils/         # Utility functions
TelasHTML/       # Static HTML prototypes (design reference, not served)
```

Path alias `@/*` maps to `src/*`.

### Design system

The app uses a **Material Design 3** dark-mode color token system. Tokens are defined in `TelasHTML/login.html`'s inline Tailwind config and must be migrated into `src/app/globals.css` using Tailwind v4's `@theme` directive. Use semantic token names like `text-on-surface`, `bg-surface-container`, `border-outline-variant`, not hardcoded colors.

Icons use **Material Symbols Outlined** (`<span class="material-symbols-outlined">`). Custom spacing tokens: `xs`, `base`, `sm`, `md`, `gutter`, `lg`, `xl`. Custom type-scale tokens: `body-sm/md/lg`, `headline-md/lg/xl`, `label-sm/md`.

### Tailwind v4

This project uses Tailwind CSS **v4**, which has a CSS-first configuration approach — there is no `tailwind.config.js`. Theme customization goes in `globals.css` under `@theme inline { ... }`. Refer to the v4 docs before using any Tailwind APIs; most v3 guides are wrong.

### Key dependencies

- `@supabase/supabase-js` — backend/auth
- `zod` v4 — runtime validation (note: Zod v4 has a different API from v3)
- `clsx` + `tailwind-merge` — for conditional class composition
- `lucide-react` — icon library (secondary to Material Symbols)
