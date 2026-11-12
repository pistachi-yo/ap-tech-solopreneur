# Pattern Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a pattern list page and a pattern instructions page, backed by seeded Supabase data, with per-user bookmarks and step completion.

**Architecture:** React Router pages read patterns and steps from Supabase through small single-purpose hooks. An `AuthProvider` exposes the Supabase Auth user. Bookmark and progress writes go straight to `bookmarks` and `instruction_progress` under the existing RLS policies, with optimistic UI and revert on failure.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind v4, shadcn/ui, Lucide, react-router, Supabase (supabase-js, Auth).

**Spec:** `docs/superpowers/specs/2026-11-12-pattern-pages-design.md`

## Prerequisites

- Bash network access must allow npm installs (Tasks 1 onward need `npm install` and `npx shadcn@latest`). If installs are refused, stop and ask the user to enable package installs in their network settings (a new chat may be needed for the change to apply).
- Supabase project id: `txetbpszrqsdligrscnc`. Fetch the API URL and publishable key with the Supabase tools; never commit them.

## Global Constraints

- Free tiers only: Supabase, Vercel, shadcn/ui, Tailwind CSS, Lucide.
- Placeholder photos come from Unsplash (free licence). No generated images or illustrations.
- Use existing tokens in `src/index.css` only: `chestnut-primary` #953623, `chestnut-900` #32120c, `chestnut-tertiary` #ffece8, `mushroom-primary` #846e5c, `brand-border` #ca9a91. No new colours.
- Fonts: `font-heading` (Playfair Display, weight 400) for headings, `font-sans` (Plus Jakarta Sans) for body; `text-body` 16px, `text-body-sm` 14px, buttons weight 500.
- `rounded-lg` (10px); content width `max-w-page` (1440px), centred; side padding `px-3` on mobile and `sm:px-6` from 640px.
- Pattern grid: one column below 768px, two columns from `md` (768px).
- Routes: `/` (landing), `/projects`, `/projects/:id/instructions`, `/sign-in`.
- Pattern pages are viewable signed out; toggles require sign-in.
- The migration is additive only (nullable `image_url` columns, seed inserts). No RLS policy changes.
- No automated test framework is added (out of scope). Verification is `npx tsc -b`, `npx eslint .`, `npx vite build` plus manual and SQL checks.
- Commit messages end with the trailer lines `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_01EqTUPQ1tUpBJraUmHbNJ8P`.

## Review Focus

1. Signed-out user taps a bookmark or step toggle: redirected to `/sign-in`, then returned to the page they came from. (Tasks 3, 4)
2. Email sign-up when Supabase email confirmation is on: no session is returned, so the page shows a "check your email" message instead of failing silently. (Task 3)
3. A save fails (network error or RLS rejection): the toggle reverts and an inline error shows. (Tasks 4, 5)
4. `/projects/abc/instructions` or an id that does not exist: friendly not-found message, no crash. (Task 5)
5. Rapid double-tap on a toggle: ignored while a save is in flight, so there is no duplicate-key error. (Tasks 4, 5)
6. A pattern or step with a null `image_url` renders without a broken image. (Tasks 4, 5)

---

## File Structure

- `src/lib/supabaseClient.ts` (replaces `supabaseClient.js`): typed client.
- `src/lib/auth.tsx`: `AuthProvider`, `useAuth`.
- `src/types/database.ts`: generated Supabase types plus `Pattern` and `PatternStep` aliases.
- `src/hooks/usePatterns.ts`, `useBookmarks.ts`, `usePatternSteps.ts`, `useStepProgress.ts`: one Supabase read or write each.
- `src/components/patterns/PatternCard.tsx`, `BookmarkButton.tsx`, `StepCard.tsx`, `StepToggle.tsx`.
- `src/components/ui/`: shadcn `button`, `card`, `progress`, `input`, `label`.
- `src/pages/Patterns.tsx`, `PatternInstructions.tsx`, `SignIn.tsx`.
- Modify: `src/App.tsx` (router), `src/main.tsx` (provider), `src/components/landing/Header.tsx` and `Hero.tsx` (links), `src/index.css`, `vite.config.ts`, `tsconfig*.json`, `package.json`.
- Delete: `src/components/GetInstruments.tsx` (unused placeholder that queries a non-existent `instruments` table and would fail against the typed client). Flagged for the user at review.

---

### Task 1: Dependencies, shadcn and brand theming

**Files:**
- Modify: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `src/index.css`
- Create: `components.json`, `src/lib/utils.ts`, `src/components/ui/{button,card,progress,input,label}.tsx`

**Interfaces:**
- Produces: `@/` import alias mapping to `src/`; `cn(...inputs: ClassValue[]): string` in `src/lib/utils.ts`; shadcn `Button`, `Card`/`CardContent`/`CardFooter`/`CardHeader`/`CardTitle`/`CardDescription`, `Progress`, `Input`, `Label`.

- [ ] **Step 1: Install `react-router` and `lucide-react`** with npm.
- [ ] **Step 2: Add the `@/*` path alias** in `tsconfig.json` and `tsconfig.app.json` (`baseUrl` or `paths`) and the matching `resolve.alias` in `vite.config.ts`.
- [ ] **Step 3: Run `npx shadcn@latest init`** (Tailwind v4, neutral base, CSS file `src/index.css`), then `npx shadcn@latest add button card progress input label`.
- [ ] **Step 4: Re-theme to brand tokens.** shadcn's init adds its own CSS variables and `@theme inline` block to `src/index.css`. Map them to the existing tokens: `--primary` → `chestnut-primary`, `--primary-foreground` → white, `--background` → `chestnut-tertiary`, `--foreground` → `chestnut-900`, `--card` → white, `--border`/`--input` → `brand-border`, `--ring` → `chestnut-primary`, `--muted-foreground` → `mushroom-primary`, `--radius` → 10px. Remove any dark-mode block. Do not change existing `@theme` tokens or the `@layer base` rules. Update the shadcn `Button` default and `outline` variants to match the landing page buttons (`text-body-sm font-medium`, chestnut fill / chestnut border).
- [ ] **Step 5: Verify.** Run `npx tsc -b && npx vite build`. Expected: both succeed, and the landing page still builds with the same colours.
- [ ] **Step 6: Commit** `chore: add router, shadcn and Lucide with brand theming`.

### Task 2: Database migration, seed data, typed client

**Files:**
- Create: `src/types/database.ts`, `src/lib/supabaseClient.ts`, `.env.local` (uncommitted)
- Delete: `src/lib/supabaseClient.js`, `src/components/GetInstruments.tsx`

**Interfaces:**
- Produces: `Database` type (generated); `type Pattern = Tables<'patterns'>`; `type PatternStep = Tables<'pattern_instructions'>`; `export const supabase: SupabaseClient<Database>`.

- [ ] **Step 1: Apply migration `add_image_url_and_seed_patterns`** with `apply_migration`: `alter table public.patterns add column image_url text; alter table public.pattern_instructions add column image_url text;` then insert the seed rows below.
- [ ] **Step 2: Seed content.** Two patterns, with `pattern_name` and a one-to-two sentence `pattern_description` each:
  - **Cat Kicker Toy**, 10 steps: Gather materials; Cut two fabric pieces; Pin right sides together; Sew around the edge; Clip curves and corners; Turn right side out; Stuff firmly; Add catnip; Close the opening; Test the kick.
  - **Scrunchie**, 8 steps: Gather materials; Cut a fabric strip; Fold lengthwise; Sew the long edge; Turn the tube right side out; Thread the elastic; Join the ends; Close the gap and fluff.
  - `step_number` runs 1..N per pattern. Each step gets a short test `description` (one or two sentences).
- [ ] **Step 3: Choose Unsplash photos.** One photo per pattern and per step, as `https://images.unsplash.com/photo-<id>?auto=format&fit=crop&w=1200&q=80`. Pick relevant sewing, fabric, thread and cat-toy photos via web search, and confirm each URL loads (WebFetch returns an image) before inserting. Reuse photos across steps where nothing better fits. Never generate images.
- [ ] **Step 4: Verify the seed.** Run `select p.pattern_name, count(i.id) from patterns p join pattern_instructions i on i.pattern_id = p.id group by 1;` Expected: Cat Kicker Toy 10, Scrunchie 8; also confirm no `image_url` is null.
- [ ] **Step 5: Run `get_advisors`** (security) and note any new warnings; none are expected from this migration.
- [ ] **Step 6: Generate types** with `generate_typescript_types` into `src/types/database.ts`, and append the `Tables` helper and the `Pattern`/`PatternStep` aliases.
- [ ] **Step 7: Create `src/lib/supabaseClient.ts`** exporting `supabase` as `createClient<Database>(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)`; delete the `.js` client and `GetInstruments.tsx`. Create `.env.local` with the two values from `get_project_url` and `get_publishable_keys`, and confirm `.gitignore` excludes it (add `.env.local` if not).
- [ ] **Step 8: Verify.** `npx tsc -b && npx vite build` pass.
- [ ] **Step 9: Commit** `feat: add image_url columns, seed patterns, typed Supabase client`.

### Task 3: Auth, routing and sign-in

**Files:**
- Create: `src/lib/auth.tsx`, `src/pages/SignIn.tsx`
- Modify: `src/App.tsx`, `src/main.tsx`, `src/components/landing/Header.tsx`, `src/components/landing/Hero.tsx`

**Interfaces:**
- Produces: `AuthProvider({ children })`; `useAuth(): { user: User | null; loading: boolean; signIn(email: string, password: string): Promise<void>; signUp(email: string, password: string): Promise<{ needsConfirmation: boolean }>; signOut(): Promise<void> }`; routes `/`, `/projects`, `/projects/:id/instructions`, `/sign-in`; `SignIn` redirects to `location.state.from` (default `/projects`) after sign-in.

- [ ] **Step 1: Implement `AuthProvider`/`useAuth`** in `src/lib/auth.tsx` on `supabase.auth.getSession` and `onAuthStateChange`. `signUp` returns `needsConfirmation: true` when no session comes back.
- [ ] **Step 2: Implement `SignIn`** with brand-styled shadcn `Card`, `Input`, `Label` and `Button`: email and password, a toggle between sign-in and sign-up, an inline error message, and a "check your email to confirm" message when `needsConfirmation` is true.
- [ ] **Step 3: Wire the router** in `App.tsx` (`BrowserRouter` with the four routes; the two pattern routes can render a placeholder until Tasks 4 and 5), wrap in `AuthProvider` in `main.tsx`, and point the landing page links ("Let's start sewing", "Projects") at `/projects` using router `Link`.
- [ ] **Step 4: Add `vercel.json`** with a rewrite of all paths to `/index.html` so deep links work on Vercel.
- [ ] **Step 5: Verify.** `npx tsc -b && npx eslint . && npx vite build` pass. Manually: `npm run dev`, sign up with a test email, and confirm either a session (confirmation off) or the "check your email" message (confirmation on); confirm a `profiles` row or `auth.users` row exists via SQL.
- [ ] **Step 6: Commit** `feat: add auth provider, sign-in page and routing`.

### Task 4: Pattern list page

**Files:**
- Create: `src/hooks/usePatterns.ts`, `src/hooks/useBookmarks.ts`, `src/components/patterns/BookmarkButton.tsx`, `src/components/patterns/PatternCard.tsx`, `src/pages/Patterns.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `supabase`, `Pattern`, `useAuth`.
- Produces: `usePatterns(): { patterns: Pattern[]; loading: boolean; error: string | null; reload(): void }`; `useBookmarks(): { bookmarkedIds: Set<number>; toggle(patternId: number): Promise<void>; error: string | null }` (empty set and no-op when signed out; ignores a toggle for an id already in flight; reverts on failure); `BookmarkButton({ patternId: number; bookmarked: boolean; onToggle(patternId: number): Promise<void> })` (when signed out, navigates to `/sign-in` with `state: { from: location.pathname }`); `PatternCard({ pattern: Pattern; bookmarked: boolean; onToggleBookmark(patternId: number): Promise<void> })`.

- [ ] **Step 1: Implement `usePatterns`** (select all patterns ordered by `id`) and `useBookmarks` (select the user's `bookmarks`; `toggle` inserts or deletes with optimistic update and revert).
- [ ] **Step 2: Implement `BookmarkButton`** (Lucide `Bookmark`, filled when bookmarked, `aria-pressed`, `aria-label`) and `PatternCard` (16:9 `object-cover` image, hidden or neutral block when `image_url` is null; title in `font-heading`; description; "View instructions" primary `Link` button to `/projects/{id}/instructions`).
- [ ] **Step 3: Implement the `Patterns` page**: landing `Header`, page heading, `max-w-page` container with `px-3 sm:px-6`, grid `grid-cols-1 md:grid-cols-2 gap-6`, skeleton blocks while loading, an error message with a retry button, and the `useBookmarks` error shown inline.
- [ ] **Step 4: Verify.** `npx tsc -b && npx eslint . && npx vite build` pass. Manually: both seeded patterns show with images; signed out, tapping bookmark goes to `/sign-in` and returns to `/projects` after sign-in; signed in, bookmark, reload, and the bookmark persists; SQL `select * from bookmarks` shows one row under the user's id; double-tapping quickly leaves one row and no error; blocking the network makes the toggle revert with an error; a pattern with null `image_url` (temporarily null one) shows no broken image. Check at about 412px (one column) and 1280px (two columns).
- [ ] **Step 5: Commit** `feat: add pattern list page with bookmarks`.

### Task 5: Pattern instructions page

**Files:**
- Create: `src/hooks/usePatternSteps.ts`, `src/hooks/useStepProgress.ts`, `src/components/patterns/StepToggle.tsx`, `src/components/patterns/StepCard.tsx`, `src/pages/PatternInstructions.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `supabase`, `Pattern`, `PatternStep`, `useAuth`.
- Produces: `usePatternSteps(patternId: number | null): { pattern: Pattern | null; steps: PatternStep[]; loading: boolean; error: string | null; notFound: boolean }` (steps ordered by `step_number`; `notFound` when the id is null or no pattern matches); `useStepProgress(stepIds: number[]): { completedIds: Set<number>; toggle(stepId: number): Promise<void>; error: string | null }` (marking complete upserts a row with `completed: true`; un-marking deletes it; ignores in-flight ids; reverts on failure); `StepToggle({ stepId: number; completed: boolean; onToggle(stepId: number): Promise<void> })` (signed out → `/sign-in` with `from`); `StepCard({ step: PatternStep; completed: boolean; onToggle(stepId: number): Promise<void> })`.

- [ ] **Step 1: Implement `usePatternSteps`**, parsing `:id` with `Number` and treating `NaN` as not found, and `useStepProgress` (select the user's `instruction_progress` rows for the given step ids).
- [ ] **Step 2: Implement `StepToggle`** (Lucide `Check`; "Mark complete" outline button / "Completed" filled state) and `StepCard` (step number, title in `font-heading`, description, image with null handling, toggle; muted styling when completed).
- [ ] **Step 3: Implement `PatternInstructions`**: header with pattern name, back link to `/projects`, shadcn `Progress` with "X of Y steps done" (signed in only), steps list, loading skeletons, error with retry, and a friendly not-found message with a link back to `/projects`.
- [ ] **Step 4: Verify.** `npx tsc -b && npx eslint . && npx vite build` pass. Manually: Cat Kicker Toy shows 10 steps, Scrunchie 8, in order; signed out, tapping a toggle goes to `/sign-in` and returns; signed in, completing steps updates the progress bar, and a reload keeps them; SQL `select * from instruction_progress` shows rows under the user's id and un-completing removes the row; `/projects/abc/instructions` and `/projects/9999/instructions` show the not-found message; double-tap and blocked-network cases behave as in Task 4; a step with null `image_url` shows no broken image. Check at about 412px and 1280px.
- [ ] **Step 5: Commit** `feat: add pattern instructions page with step progress`.

### Task 6: Final checks and hand-off

**Files:**
- Modify: `README.md` (short "Pattern pages" section: routes, required env vars, seed note)

- [ ] **Step 1: Run `npx tsc -b && npx eslint . && npx vite build`**. Expected: all pass with no new warnings.
- [ ] **Step 2: Run `get_advisors`** (security and performance) and report anything new.
- [ ] **Step 3: Update the README** with the routes, the `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` variables (to be set in Vercel too), and the note that seed data lives in the database.
- [ ] **Step 4: Commit** `docs: document pattern pages`.
- [ ] **Step 5: Fetch and push.** `git fetch origin main`, then `git push origin feature/pattern-pages`; do not open or merge a pull request unless asked.
