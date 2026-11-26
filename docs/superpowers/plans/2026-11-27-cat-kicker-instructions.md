# Cat Kicker Instructions and Resource Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the Cat Kicker Toy instructions page into a four-stage beginner course with a tools/materials checklist, step "why" text and links to reusable `/resources/:slug` pages, all stored in Supabase.

**Architecture:** One additive migration adds sections, resources (markdown), step-to-resource links, checklist items, skills and per-user checklist progress. `usePatternSteps` is extended to load it all; the instructions page renders an "In this project" overview plus collapsible sections; a new `Resource` page renders markdown. Step ticks keep using the existing `instruction_progress`.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind v4, shadcn/ui, Lucide, react-router, Supabase, `react-markdown` + `remark-gfm` (new, free).

**Spec:** `docs/superpowers/specs/2026-11-27-cat-kicker-instructions-design.md`. Exact step, checklist, skill and resource wording comes from `docs/superpowers/specs/2026-11-27-cat-kicker-content-draft.md`; seed that copy (resource bodies are expanded from its outlines).

## Prerequisites

- Bash package installs must be allowed (`npm install react-markdown remark-gfm`, and `npm install` if `node_modules` is missing). If refused, stop and ask the user to enable package installs in network settings (a new chat may be needed).
- Supabase project id `txetbpszrqsdligrscnc` (region ap-northeast-1). No branching on the free plan: migrations run on the single project.
- Work on a new branch `feature/cat-kicker-instructions` from `main`. The clone is read-only for GitHub: commits stay local until the user attaches the repo with push access.

## Global Constraints

- Free tiers only: Supabase, Vercel, shadcn/ui, Tailwind CSS, Lucide, free libraries.
- Existing tokens only: `chestnut-primary` #953623, `chestnut-900` #32120c, `chestnut-tertiary` #ffece8, `mushroom-primary` #846e5c, `brand-border` #ca9a91. No new colours. Headings `font-heading`, body `font-sans`, `text-body` 16px, `text-body-sm` 14px, `rounded-lg`, `max-w-page`, padding `px-3 sm:px-6`.
- Resource URL is `/resources/:slug`; `vercel.json` already rewrites all paths.
- Migration is additive except deleting the Cat Kicker (pattern id 1) placeholder steps and their `instruction_progress` rows. The Scrunchie and Pencil Case rows are untouched. Content tables: public read, no client writes. `checklist_progress`: authenticated users read/write only their own rows.
- Markdown renders with raw HTML disabled.
- Steps and resources without an image show no image block.
- No test framework (out of scope). Verification: `npx tsc -b`, `npx eslint .`, `npx vite build`, SQL checks, manual checks.
- Commit messages end with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_01EqTUPRY5x6DnMTotxN6sEr`.

## Review Focus

1. Signed-out user ticks a checklist item: redirected to `/sign-in` and returned, like step toggles. (Task 5)
2. `/resources/does-not-exist`: friendly not-found with a link to `/projects`, no crash. (Task 3)
3. Markdown containing `<script>` or raw HTML does not execute or render. (Task 3)
4. The Scrunchie (steps with no `section_id`) still renders as a flat list with working toggles. (Task 6)
5. Wide markdown tables (fabric comparison) scroll inside their container on a 412px screen instead of widening the page. (Task 3)
6. One user's checklist ticks are not visible to another user. (Tasks 1, 5)
7. A step with zero resource links, or a checklist item with no resource, renders without an empty "Learn more" row or dead link. (Tasks 5, 6)

---

### Task 1: Schema migration and types

**Files:**
- Modify: `src/types/database.ts` (regenerate)
- Migration via Supabase tool `apply_migration`, name `add_sections_resources_checklists`

**Interfaces:**
- Produces: tables and columns per the spec (section 1). `pattern_instructions.section_id` and `why`; types `PatternSection`, `Resource`, `StepResource`, `ChecklistItem`, `PatternSkill`, `ChecklistProgress` exported from `src/types/database.ts` as `Tables<...>` aliases; `ChecklistItem.kind` is `'tool' | 'material'` (check constraint in SQL, narrow in TS).

- [ ] **Step 1: Inspect current tables** with `list_tables` and confirm no name clashes.
- [ ] **Step 2: Apply the migration.** Create the six tables from spec section 1 (FKs with `on delete cascade` from content to pattern/resource, unique `resources.slug`, `position` ints, `step_resources` PK `(instruction_id, resource_id)`), add `section_id`/`why` to `pattern_instructions`, enable RLS on every new table, add public `select` policies on the five content tables and own-row select/insert/update/delete policies for `authenticated` on `checklist_progress` using `(select auth.uid()) = user_id`.
- [ ] **Step 3: Run `get_advisors` (security).** Expected: no new warnings for the new tables.
- [ ] **Step 4: Regenerate types** with `generate_typescript_types`, keep the existing header comment and the `Tables`, `Pattern`, `PatternStep` exports, and add the new aliases.
- [ ] **Step 5: Verify** `npx tsc -b` passes.
- [ ] **Step 6: Commit** `feat: add sections, resources and checklist tables`.

### Task 2: Seed the Cat Kicker structure

**Files:** migration `seed_cat_kicker_structure` (no repo files).

**Interfaces:**
- Consumes: Task 1 tables.
- Produces: for pattern id 1: 4 `pattern_sections` (positions 1-4, titles "Set up your machine", "Gather your tools and materials", "Prepare your fabric and cut", "Sew the toy"), 22 steps numbered 1-22 with `title`, `description` ("what"), `why`, `section_id`, and the checklist items and skills from the content draft. Resource ids on checklist/skill rows stay null until Task 3.

- [ ] **Step 1: Apply a migration that deletes** `instruction_progress` rows for pattern 1's steps, deletes pattern 1's steps, then inserts sections, steps (looking up `section_id` by position), checklist items (kind, name, note, optional) and skills, using the draft copy verbatim.
- [ ] **Step 2: Verify with SQL:** pattern 1 has 4 sections and 22 steps with no null `why`, step numbers 1-22 unbroken, 11 tool items and 4 material items, 6 skills; patterns 2 and 3 are unchanged (8 and 0 steps).
- [ ] **Step 3:** No repo files change in this task, so there is no commit; list the migration names in the Task 3 commit message.

### Task 3: Resources, links and the Resource page

**Files:**
- Create: `src/pages/Resource.tsx`, `src/hooks/useResource.ts`, `src/components/resources/MarkdownBody.tsx`
- Modify: `src/App.tsx`, `package.json`

**Interfaces:**
- Produces: `useResource(slug: string | undefined): { resource: Resource | null; loading: boolean; error: string | null; notFound: boolean; reload: () => void }`; `MarkdownBody({ markdown }: { markdown: string })`; route `/resources/:slug`.

- [ ] **Step 1: Seed resources.** Apply migrations (split into three: machine and tools, fabric, techniques) inserting the 23 resources with beginner-language markdown bodies expanded from the draft outlines (each: why it matters, how-to, tips, common mistakes; `choosing-fabric` includes a GFM comparison table; the machine pages tell readers to check their manual). Resource bodies link to each other with `/resources/<slug>`.
- [ ] **Step 2: Seed links.** Insert `step_resources` from the draft's per-step slugs (position in listed order), and set `resource_id` on checklist items and skills using the first slug listed.
- [ ] **Step 3: Verify with SQL:** 23 resources; every `step_resources` row resolves; every resource is referenced by a step, checklist item or skill; no step_resources row for the Scrunchie.
- [ ] **Step 4: `npm install react-markdown remark-gfm`.**
- [ ] **Step 5: Implement `MarkdownBody`** with `react-markdown` and `remark-gfm`, no raw HTML, styled with Tailwind via component overrides (headings in `font-heading`), tables wrapped in an `overflow-x-auto` container, internal links rendered with react-router `Link` (preserving `state`).
- [ ] **Step 6: Implement `useResource`** (single `resources` read by slug with `maybeSingle`, same loading/error/retry shape as `usePatternSteps`).
- [ ] **Step 7: Implement `Resource` page**: Header, back link to `location.state?.from` when it is a string starting with `/` (else `/projects`), title, summary, `MarkdownBody`, not-found state with link to `/projects`, error state with retry. Register the route in `App.tsx`.
- [ ] **Step 8: Verify** `npx tsc -b && npx eslint . && npx vite build`; load `/resources/choosing-fabric` and `/resources/does-not-exist` locally at 412px and desktop, and confirm a body containing `<script>alert(1)</script>` (temporary row, deleted after) renders as nothing.
- [ ] **Step 9: Commit** `feat: add resource pages and seed beginner content`.

### Task 4: Load sections, links, checklist and skills

**Files:**
- Modify: `src/hooks/usePatternSteps.ts`, `src/types/database.ts`

**Interfaces:**
- Consumes: Task 1 types.
- Produces: exported types `ResourceRef = { slug: string; title: string }`, `StepLink = ResourceRef & { label: string | null }`, `ChecklistEntry = ChecklistItem & { resource: ResourceRef | null }`, `SkillEntry = PatternSkill & { resource: ResourceRef | null }`. `usePatternSteps` result gains `sections: PatternSection[]` (ordered by position), `stepLinks: Map<number, StepLink[]>` (keyed by step id, ordered by position), `checklist: ChecklistEntry[]`, `skills: SkillEntry[]` (ordered by position). Existing fields and the stale-id protection are unchanged.

- [ ] **Step 1: Extend the loader** to read sections, checklist and skills (with embedded `resources(slug, title)`), and steps with embedded `step_resources(label, position, resources(slug, title))`, in parallel with the existing reads; any error follows the current failure path.
- [ ] **Step 2: Verify** `npx tsc -b`; Scrunchie page still loads with empty sections, links, checklist and skills.
- [ ] **Step 3: Commit** `feat: load sections, links and checklist for a pattern`.

### Task 5: Checklist progress and project overview

**Files:**
- Create: `src/hooks/useChecklistProgress.ts`, `src/components/patterns/ProjectOverview.tsx`, `src/components/patterns/ChecklistItem.tsx`

**Interfaces:**
- Consumes: Task 4 types.
- Produces: `useChecklistProgress(itemIds: number[]): { checkedIds: Set<number>; toggle: (itemId: number) => Promise<void>; error: string | null }` (mirrors `useStepProgress` against `checklist_progress`: optimistic, revert on failure, ignores a second tap while saving, delete row when unticking). `ChecklistItemRow({ item: ChecklistEntry; checked: boolean; onToggle: (id: number) => Promise<void> })` redirects signed-out users to `/sign-in` with `state: { from }` like `StepToggle`, shows "optional" and `note`, and links to its resource when present. `ProjectOverview({ checklist, skills, sections, checkedIds, onToggleItem })` renders Tools and Materials lists, skills chips (linked when a resource exists) and "Jump to" anchors `#section-<id>`; renders nothing for empty lists.

- [ ] **Step 1: Implement the three files** per the interfaces; sticky sidebar from `lg`, stacked on mobile.
- [ ] **Step 2: Verify** `npx tsc -b && npx eslint .`.
- [ ] **Step 3: Commit** `feat: add project checklist and overview`.

### Task 6: Sectioned instructions page

**Files:**
- Create: `src/components/patterns/StepSection.tsx`
- Modify: `src/pages/PatternInstructions.tsx`, `src/components/patterns/StepCard.tsx`

**Interfaces:**
- Consumes: Tasks 4 and 5.
- Produces: `StepSection({ section, steps, stepLinks, completedIds, onToggle })` with id `section-<id>`, collapsible (default open), heading showing "n of m done". `StepCard` gains an optional `links: StepLink[]` prop and renders `why` as a "Why" line, an optional image (nothing when `image_url` is null), and "Learn more" chips as router `Link`s to `/resources/<slug>` with `state: { from: location.pathname }`, text `label ?? title`; no row when `links` is empty.

- [ ] **Step 1: Rework `StepCard`** per the interface (keep the existing `StepToggle` and completed styling).
- [ ] **Step 2: Implement `StepSection`**, using native `details`/`summary` unless a Radix collapsible is clearly better.
- [ ] **Step 3: Rework `PatternInstructions`:** heading, progress bar across all steps, `ProjectOverview` (sidebar on desktop), sections in order; when `sections` is empty fall back to the current flat grid.
- [ ] **Step 4: Verify** `npx tsc -b && npx eslint . && npx vite build`.
- [ ] **Step 5: Manual check against real data:** Cat Kicker shows 4 sections, 22 steps, whys and working links; Scrunchie unchanged; at 412px and desktop; signed out ticks redirect to `/sign-in`.
- [ ] **Step 6: Commit** `feat: sectioned beginner instructions page`.

### Task 7: End-to-end verification

**Files:** none (README route table updated: add `/resources/:slug`).

- [ ] **Step 1: Run** `npx tsc -b && npx eslint . && npx vite build`; all pass.
- [ ] **Step 2: SQL checks** from spec section 6; confirm `checklist_progress` and `instruction_progress` rows are stored under the signed-in user's id and a second user cannot see them.
- [ ] **Step 3: Manual walkthrough:** sign up, tick checklist items and steps, reload and confirm persistence and the progress bar, follow every "Learn more" and skills link, and open each resource page; check 412px and desktop.
- [ ] **Step 4: Update `README.md`** route table and commit `docs: document resource route`.
