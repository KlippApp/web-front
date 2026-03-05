# Klipp — Landing Page + Dashboard Portal

Landing page + authenticated agency dashboard for the **Klipp** mobile app (`com.husur.klipp`).
Light/dark theme, glass aesthetic (Notion/Linear/Vercel style).

## Commands

```bash
npm run dev      # Start dev server at http://localhost:5173
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
npm run test     # Run tests (vitest)
npm run deploy   # Build + push to gh-pages branch
```

## Tech Stack

- **Vite 7** + **React 19** + **Tailwind CSS v4** (`@tailwindcss/vite` — no PostCSS, no tailwind.config.js)
- **react-router-dom** for routing (landing page + `/login` `/register` `/dashboard/*`)
- **react-i18next** for i18n — locales in `src/locales/en.json` + `src/locales/fr.json`
- **lucide-react** for icons
- **Inter** font via Google Fonts CDN

## Theme System

Light is the default. Dark mode toggled via a Sun/Moon button in the navbar and dashboard header.

- `src/hooks/useTheme.js` — reads `data-theme` on `<html>`, persists to `theme` cookie (only after cookie consent)
- `src/hooks/useCookieConsent.js` — reads/writes `cookie_consent` cookie (`accepted` | `declined` | null)
- All colors are CSS custom properties — `:root` = light, `[data-theme="dark"]` = dark overrides
- **Never hardcode colors in components** — always use `var(--color-*)`

### Key CSS variables (`src/index.css`)

| Variable | Purpose |
|----------|---------|
| `--color-bg` | Page background |
| `--color-text-primary` / `--color-text-secondary` | Body text |
| `--color-card-bg` / `--color-card-border` | Glass cards (semi-transparent) |
| `--color-nav-bg` | Navbar + sidebar + modal backgrounds (`rgba(255,255,255,0.85)` / `rgba(0,0,0,0.85)`) |
| `--color-input-bg` / `--color-input-border` / `--color-input-focus-border` | Form inputs |
| `--color-input-error` / `--color-input-success` | Validation feedback |
| `--color-btn-store-bg` / `--color-btn-store-text` | Store buttons |

Full variable list in `src/index.css` `:root` block.

**Modal cards**: use `background: var(--color-nav-bg)` + `backdropFilter: blur(20px)` — never `glass-card` (too transparent for modals).

## Auth (`src/hooks/useAuth.js`)

Persists in `localStorage` under keys `klipp_token`, `klipp_agency`, `klipp_manager`.

| Returned value | Type | Description |
|----------------|------|-------------|
| `token` | string\|null | JWT |
| `agency` | string\|null | Agency name |
| `managerName` | string\|null | Manager name |
| `isAuthenticated` | bool | `!!token` |
| `login(token, agency, manager)` | fn | Sets all three values |
| `logout()` | fn | Clears all three values |
| `updateProfile(agency, manager)` | fn | Updates agency/manager name |

## Client Portal

Routes: `/login` → `/register` → `/dashboard/*` (protected by `ProtectedRoute`).

### Dashboard pages

| Page | Route | Description |
|------|-------|-------------|
| `DashboardPage` | `/dashboard` | Stats + sales chart |
| `AgentsPage` | `/dashboard/agents` | CRUD agents (photo, name, email, phone + country code) |
| `OfficesPage` | `/dashboard/offices` | CRUD offices (photo, name, address, email, phone) |
| `ProfilePage` | `/dashboard/profile` | Agency info form, change password, delete account |

### Dashboard layout (`DashboardLayout.jsx`)

Collapsible sidebar (240px / 0px) + fixed header. Nav items: Dashboard, Agents, Offices, Profile. Header: greeting (managerName), LanguageToggle, ThemeToggle. Logout → redirects to `/`.

### API pattern

All API calls use `PLACEHOLDER_API_URL` as base. Every handler has a dev bypass:
```js
if ('PLACEHOLDER_API_URL' === 'PLACEHOLDER_API_URL') {
  // simulate success — remove when real API is connected
}
```
Tests that cover the error path of bypassed handlers are marked `it.skip(...)` until the API is connected.

## i18n

- `src/locales/en.json` / `src/locales/fr.json` — flat nested JSON
- Top-level keys: `nav`, `hero`, `features`, `screenshots`, `testimonials`, `download`, `footer`, `cookies`, `portal`
- `portal` key contains: `backToHome`, `login`, `register`, `dashboard`, `profile`, `agents`, `offices`
- `src/test/setup.js` contains `mockT` — **always add new i18n keys to `mockT`** when adding them to locale files

## Cookie Consent

`CookieConsent.jsx` renders as a fixed bottom-right panel with slide-in/out animations.
- Appears when `cookie_consent` cookie is absent
- Accept → writes `cookie_consent=accepted`, enables `theme` cookie persistence
- Decline → writes `cookie_consent=declined`, theme resets on each reload
- Animation classes: `.cookie-consent` (enter) / `.cookie-consent-out` (exit) in `src/index.css`

## Component Map

### Landing page
| Component | Purpose |
|-----------|---------|
| `IPhoneMockup` | Pure CSS iPhone 15 Pro frame — props: `src`, `alt`, `size` (sm/md/lg) |
| `StoreButton` | App Store / Google Play badge — props: `store` (apple/google), `href` |
| `ThemeToggle` | Sun/Moon icon button — props: `theme`, `toggleTheme` |
| `LanguageToggle` | FR/EN switcher — no props |
| `CookieConsent` | Cookie banner — props: `onAccept`, `onDecline` |
| `Navbar` | Sticky, scroll-aware, mobile hamburger + theme + language toggles |
| `Hero` | Full-height hero with headline + phone mockup |
| `Features` | 6-card feature grid |
| `Screenshots` | 3-phone showcase |
| `Testimonials` | 3 review cards |
| `DownloadCTA` | Centered CTA with glass card |
| `Footer` | 4-column links + store badges |

### Dashboard
| Component | Purpose |
|-----------|---------|
| `ProtectedRoute` | Redirects to `/login` if not authenticated |
| `DashboardLayout` | Sidebar + header shell, renders `<Outlet />` |

## Adding Screenshots

Replace placeholder files in `src/assets/screenshots/`:

| File | Used in | Recommended size |
|------|---------|-----------------|
| `screen1.png` | Hero + Screenshots center | 390×844px |
| `screen2.png` | Screenshots left | 390×844px |
| `screen3.png` | Screenshots right | 390×844px |

## Testing

**Always write tests for every new piece of code added.** No exceptions.

- Test files live in `src/test/` mirroring the source structure:
  - `src/test/components/` for components
  - `src/test/pages/` for pages
  - `src/test/hooks/` for hooks
- Framework: **Vitest** + **@testing-library/react**
- Setup file: `src/test/setup.js` — contains `mockT` (all i18n keys) + `localStorage` mock + `react-i18next` mock
- Use `renderHook` + `act` for hooks, `render` + `fireEvent` for components
- Use `vi.useFakeTimers()` / `vi.runAllTimers()` when testing `setTimeout`-based behavior
- Run tests: `rtk vitest run` — must pass before committing

## Workflow

- **Each request is done on a new branch** created from `main`. Branch naming: `feat/short-description`, `fix/short-description`, etc.
- Never work directly on `main`.

## Commits

- **Always commit atomically**: one logical unit per commit
- **Use partial staging** (`git add -p`) when a file contains changes belonging to different commits
- Commit message format: `type: short description` (`feat`, `fix`, `style`, `refactor`, `test`, `ci`, `docs`)
- Never add `Co-Authored-By` to commit messages

## CI/CD

| Workflow | Trigger | Steps |
|----------|---------|-------|
| `ci.yml` | push + PR → main | lint → test |
| `deploy.yml` | CI passes on main | build → gh-pages push |

`deploy.yml` uses `workflow_run` on CI success — deploy never runs if tests fail.

## Tailwind v4 Notes

- No `tailwind.config.js` — v4 ignores it entirely
- Use `@import "tailwindcss"` (not `@tailwind base/components/utilities`)
- `bg-opacity-*` removed — use slash syntax: `bg-blue-primary/20`
- Custom utilities in `@layer components` in `src/index.css`: `glass-card`, `btn-store`, `cookie-consent`, `cookie-consent-out`

## Store Links

Update href values in `StoreButton` calls (currently `#app-store` / `#play-store`):
- Hero.jsx: both buttons
- DownloadCTA.jsx: both buttons
- Footer.jsx: mini badges at bottom

<!-- rtk-instructions v2 -->
# RTK (Rust Token Killer) - Token-Optimized Commands

## Golden Rule

**Always prefix commands with `rtk`**. If RTK has a dedicated filter, it uses it. If not, it passes through unchanged. This means RTK is always safe to use.

**Important**: Even in command chains with `&&`, use `rtk`:
```bash
# ❌ Wrong
git add . && git commit -m "msg" && git push

# ✅ Correct
rtk git add . && rtk git commit -m "msg" && rtk git push
```

## RTK Commands by Workflow

### Build & Compile (80-90% savings)
```bash
rtk cargo build         # Cargo build output
rtk cargo check         # Cargo check output
rtk cargo clippy        # Clippy warnings grouped by file (80%)
rtk tsc                 # TypeScript errors grouped by file/code (83%)
rtk lint                # ESLint/Biome violations grouped (84%)
rtk prettier --check    # Files needing format only (70%)
rtk next build          # Next.js build with route metrics (87%)
```

### Test (90-99% savings)
```bash
rtk cargo test          # Cargo test failures only (90%)
rtk vitest run          # Vitest failures only (99.5%)
rtk playwright test     # Playwright failures only (94%)
rtk test <cmd>          # Generic test wrapper - failures only
```

### Git (59-80% savings)
```bash
rtk git status          # Compact status
rtk git log             # Compact log (works with all git flags)
rtk git diff            # Compact diff (80%)
rtk git show            # Compact show (80%)
rtk git add             # Ultra-compact confirmations (59%)
rtk git commit          # Ultra-compact confirmations (59%)
rtk git push            # Ultra-compact confirmations
rtk git pull            # Ultra-compact confirmations
rtk git branch          # Compact branch list
rtk git fetch           # Compact fetch
rtk git stash           # Compact stash
rtk git worktree        # Compact worktree
```

Note: Git passthrough works for ALL subcommands, even those not explicitly listed.

### GitHub (26-87% savings)
```bash
rtk gh pr view <num>    # Compact PR view (87%)
rtk gh pr checks        # Compact PR checks (79%)
rtk gh run list         # Compact workflow runs (82%)
rtk gh issue list       # Compact issue list (80%)
rtk gh api              # Compact API responses (26%)
```

### JavaScript/TypeScript Tooling (70-90% savings)
```bash
rtk pnpm list           # Compact dependency tree (70%)
rtk pnpm outdated       # Compact outdated packages (80%)
rtk pnpm install        # Compact install output (90%)
rtk npm run <script>    # Compact npm script output
rtk npx <cmd>           # Compact npx command output
rtk prisma              # Prisma without ASCII art (88%)
```

### Files & Search (60-75% savings)
```bash
rtk ls <path>           # Tree format, compact (65%)
rtk read <file>         # Code reading with filtering (60%)
rtk grep <pattern>      # Search grouped by file (75%)
rtk find <pattern>      # Find grouped by directory (70%)
```

### Analysis & Debug (70-90% savings)
```bash
rtk err <cmd>           # Filter errors only from any command
rtk log <file>          # Deduplicated logs with counts
rtk json <file>         # JSON structure without values
rtk deps                # Dependency overview
rtk env                 # Environment variables compact
rtk summary <cmd>       # Smart summary of command output
rtk diff                # Ultra-compact diffs
```

### Infrastructure (85% savings)
```bash
rtk docker ps           # Compact container list
rtk docker images       # Compact image list
rtk docker logs <c>     # Deduplicated logs
rtk kubectl get         # Compact resource list
rtk kubectl logs        # Deduplicated pod logs
```

### Network (65-70% savings)
```bash
rtk curl <url>          # Compact HTTP responses (70%)
rtk wget <url>          # Compact download output (65%)
```

### Meta Commands
```bash
rtk gain                # View token savings statistics
rtk gain --history      # View command history with savings
rtk discover            # Analyze Claude Code sessions for missed RTK usage
rtk proxy <cmd>         # Run command without filtering (for debugging)
rtk init                # Add RTK instructions to CLAUDE.md
rtk init --global       # Add RTK to ~/.claude/CLAUDE.md
```

## Token Savings Overview

| Category | Commands | Typical Savings |
|----------|----------|-----------------|
| Tests | vitest, playwright, cargo test | 90-99% |
| Build | next, tsc, lint, prettier | 70-87% |
| Git | status, log, diff, add, commit | 59-80% |
| GitHub | gh pr, gh run, gh issue | 26-87% |
| Package Managers | pnpm, npm, npx | 70-90% |
| Files | ls, read, grep, find | 60-75% |
| Infrastructure | docker, kubectl | 85% |
| Network | curl, wget | 65-70% |

Overall average: **60-90% token reduction** on common development operations.
<!-- /rtk-instructions -->