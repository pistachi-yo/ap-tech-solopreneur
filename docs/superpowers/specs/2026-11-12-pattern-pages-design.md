# Pattern pages: design spec

Date: 2026-11-12
Branch: `feature/pattern-pages`
Status: awaiting review

## Goal

Add two page templates to the Unpicked prototype, filled with test data from Supabase:

1. **Pattern list** (`/projects`): lists two sewing patterns (Cat Kicker Toy, Scrunchie), each with title, description, a placeholder photo, a "View instructions" button and a bookmark toggle.
2. **Pattern instructions** (`/projects/:id/instructions`): up to 10 steps per pattern, each with a placeholder photo and a "Mark complete" toggle.

Bookmarks and completed steps are stored against the signed-in user's profile. Both pages work on desktop and mobile.

## Constraints

- Free tiers only: Supabase, Vercel, shadcn/ui, Tailwind CSS, Lucide.
- Placeholder photos come from Unsplash (free licence). No generated images or illustrations.
- Visual style follows the existing landing page (see "Visual style").
- Supabase database branching is likely not on the free plan, so the migration runs directly on the single project. It is additive and the tables are empty.

## Existing state

**Repo:** React 19, TypeScript, Vite, Tailwind v4 with brand tokens in `src/index.css`. The landing page exists (`Landing`, `Header`, `Hero`). There is no router, no shadcn/ui, no Lucide and no auth UI. `src/lib/supabaseClient.js` creates the client from `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.

**Supabase (project "Tech Solopreneur", all tables empty, RLS enabled):**

| Table | Columns |
|---|---|
| `patterns` | `id`, `created_at`, `pattern_name`, `pattern_description` |
| `pattern_instructions` | `id`, `created_at`, `pattern_id`, `step_number`, `title`, `description` |
| `bookmarks` | `user_id`, `pattern_id`, `created_at` (PK: user_id + pattern_id) |
| `instruction_progress` | `user_id`, `instruction_id`, `completed`, `completed_at`, `created_at` (PK: user_id + instruction_id) |
| `profiles` | `id` (= auth user id), `first_name`, `last_name`, `email`, `last_login`, `created_at` |

**Existing RLS policies:**
- `patterns` and `pattern_instructions`: readable by everyone.
- `bookmarks`: authenticated users can select, insert and delete only their own rows.
- `instruction_progress`: authenticated users can select, insert, update and delete only their own rows.
- No policy changes are needed.

## Design

### 1. Data (one migration)

- Add nullable `image_url text` to `patterns` and to `pattern_instructions`.
- Seed two patterns:
  - **Cat Kicker Toy**: 10 steps.
  - **Scrunchie**: 8 steps.
- Each step has `step_number`, `title`, `description` and an Unsplash photo URL.
- Seed content is placeholder instruction text written for testing, not final copy.
- Unsplash URLs use the `images.unsplash.com` direct image links with width and quality parameters.

### 2. Routing and auth

- Add `react-router`. Routes: `/` (landing, unchanged), `/projects`, `/projects/:id/instructions`, `/sign-in`.
- Add an `AuthProvider` exposing the current user and session from `supabase.auth`, with email and password sign-in and sign-up on `/sign-in`.
- Pattern pages are viewable signed out. Bookmark and step toggles require sign-in: a signed-out tap redirects to `/sign-in` and returns afterwards.
- The landing page "Let's start sewing" and "Projects" links point to `/projects`.

### 3. Pattern list page (`/projects`)

- Reuses the landing `Header`. Page heading in Playfair Display.
- Responsive grid: one column below 768px, two columns from 768px.
- `PatternCard`: Unsplash image (16:9 crop), title, description, "View instructions" primary button, and a `BookmarkButton` (Lucide `Bookmark`, filled when bookmarked).

### 4. Instructions page (`/projects/:id/instructions`)

- Header block: pattern name, a back link to `/projects`, and a progress bar reading "X of Y steps done" (signed-in only).
- Steps in `step_number` order. `StepCard`: step number, title, description, Unsplash image, and a `StepToggle` ("Mark complete" / "Completed", Lucide `Check`).
- Completed steps are visually muted with a check.
- A missing or non-existent pattern id shows a friendly not-found message.

### 5. Code structure

- `src/pages/Patterns.tsx`, `src/pages/PatternInstructions.tsx`, `src/pages/SignIn.tsx`
- `src/components/patterns/`: `PatternCard`, `StepCard`, `BookmarkButton`, `StepToggle`
- `src/components/ui/`: shadcn `button`, `card`, `progress` (and `input`, `label` for sign-in)
- `src/hooks/`: `usePatterns`, `usePatternSteps`, `useBookmarks`, `useStepProgress`
- `src/lib/auth.tsx`: `AuthProvider` and `useAuth`
- `src/types/database.ts`: types generated from Supabase, with `image_url` included after the migration

Each hook wraps one Supabase read or write so components stay presentational.

### 6. Behaviour

- Toggles update the screen immediately, then save to `bookmarks` (insert and delete) or `instruction_progress` (upsert and delete) for the current user.
- If a save fails, the toggle reverts and an inline error message is shown.
- Loading states use simple skeleton or placeholder blocks. Query failures show an error message with a retry.

### 7. Visual style (from the landing page)

Reuse the existing tokens in `src/index.css`. No new colours.

- **Colours:** page background `chestnut-tertiary` (#ffece8); body text `chestnut-900` (#32120c); primary buttons and accent bands `chestnut-primary` (#953623); secondary text `mushroom-primary` (#846e5c); borders `brand-border` (#ca9a91).
- **Typography:** headings in Playfair Display (`font-heading`, 400, h1 40px with -1.5px tracking); body in Plus Jakarta Sans (`text-body` 16px, `text-body-sm` 14px, weight 500 for buttons).
- **Shape and layout:** `rounded-lg` (10px); content max width `max-w-page` (1440px) centred; side padding 12px on mobile and 24px from 640px; header with a full-width `brand-border` bottom border.
- **Buttons:** primary = chestnut fill with white text; outline = chestnut border with chestnut-900 text and a light chestnut hover. shadcn components are themed to these tokens rather than shadcn defaults.
- **Cards:** `bg-chestnut-tertiary` or white inside the chestnut band, rounded-lg, images cropped with `object-cover`.

### 8. Verification

The repo has no test framework, so verification is:
- `tsc -b`, `eslint .` and `vite build` all pass.
- Manual checks against the real tables: sign up, bookmark a pattern, reload and confirm it persists, mark steps complete, reload and confirm progress and the progress bar. Check at mobile (about 412px) and desktop widths.
- Confirm in SQL that rows are stored under the signed-in user's id.

## Out of scope

- Image uploads or storage buckets.
- A "My bookmarks" page.
- Profile editing and password reset.
- Final instruction copy and real photography.
- Automated tests.
