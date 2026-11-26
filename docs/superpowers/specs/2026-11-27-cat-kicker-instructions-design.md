# Cat Kicker Toy: beginner instructions and resource pages (design)

Date: 2026-11-27
Branch: `feature/pattern-pages` (builds on the pattern pages from 2026-11-12)
Status: awaiting review

Companion file: `2026-11-27-cat-kicker-content-draft.md` (draft steps, checklist, skills and resource outlines).

## Intent and why

The Cat Kicker Toy page should teach an **absolute beginner** to sew the toy from start to finish. They should know the exact steps, everything around the pattern (setting up the machine, tools, fabric, cutting) and, most importantly, **why** each thing is done. A beginner who finishes should understand what they did, and be able to start another simple project without hand-holding.

Each step is short and doable on the page. Deeper background lives on separate **resource pages** the reader opens only if they want more. General sewing topics (winding a bobbin, cutting tools, woven vs knit) are written once and reused by the Scrunchie and future patterns.

## The toy

A kicker toy is two fabric rectangles sewn right sides together along both long edges to make a tube. It is turned right side out, stuffed (stuffing, or scrap fabric if the sewer has no stuffing), and closed at both ends. Optional catnip. Draft size: cut two rectangles 15 × 40 cm, 1 cm seam allowance, about 13 × 38 cm finished. Dimensions and copy are draft and for the owner to confirm.

## Goals

- One instructions page for the Cat Kicker Toy with four stages: set up your machine, gather your tools and materials, prepare fabric and cut, sew the toy.
- Every step can be marked complete (reusing the existing per-user step progress), with a progress bar across all steps.
- Every step has a short "what to do" and a "why".
- Steps link to resource pages with more detail, tips and troubleshooting. A step can link to several.
- An "In this project" panel at the top, like a recipe's ingredient list: a checkable checklist of tools and materials, a "skills you'll learn" list, and jump links to the four stages.
- Resource pages at `/resources/:slug`, reusable across patterns.
- Works on desktop and mobile.

## Non-goals

- A resources index or search page (reachable only via links for now).
- Photography or illustrations. Step and resource images are optional and hidden when absent.
- Rewriting the Scrunchie, or any editing UI for content (content is edited in Supabase).
- Professional copy review, automated tests, "reset progress" controls.
- A "My bookmarks" page and profile features (still out of scope from before).

## Anti-goals

- A wall of text. A step must be doable from the step text alone; resources are optional depth.
- Making the reader leave the page to finish a step.
- Instructions that say what to do with no reason why.
- Duplicated resource text across patterns.

## Constraints

- Free tiers only: Supabase, Vercel, shadcn/ui, Tailwind, Lucide, free libraries.
- Existing brand tokens and visual style (see 2026-11-12 spec section 7); no new colours.
- No placeholder-quality visuals: steps without photos show no image block.
- No Supabase branching on the free plan: the migration runs on the single project.

## Approaches considered

- **A. Content in Supabase (chosen).** New tables for sections, resources (markdown) and step-to-resource links. Reuse across patterns through a join table, content editable without a deploy, fits the existing database-driven app. Costs more migrations and one markdown library.
- **B. Resources as markdown files in the repo, linked by slug.** Simplest to start and version-controlled, but every wording fix needs a deploy and links are not enforced by the database.
- **C. Everything static in code.** Fewest moving parts but drops the existing per-step progress and the database-driven pattern pages.

The owner chose A.

## Design

### 1. Data (one additive migration plus seed)

New tables (public read via RLS, no client writes):

| Table | Columns |
|---|---|
| `pattern_sections` | `id`, `pattern_id`, `position`, `title`, `summary` |
| `resources` | `id`, `slug` (unique), `title`, `summary`, `body_md`, `created_at` |
| `step_resources` | `instruction_id`, `resource_id`, `label` (link text, nullable), `position` |
| `pattern_checklist_items` | `id`, `pattern_id`, `kind` (`tool` or `material`), `name`, `note`, `optional` (bool), `resource_id` (nullable), `position` |
| `pattern_skills` | `id`, `pattern_id`, `label`, `resource_id` (nullable), `position` |
| `checklist_progress` | `user_id`, `item_id`, `checked`, `created_at` (PK user_id + item_id; RLS: authenticated users read and write only their own rows, mirroring `instruction_progress`) |

Changes to `pattern_instructions`: add nullable `section_id` (FK to `pattern_sections`) and `why text`. Steps with no `section_id` (the Scrunchie) render as one ungrouped list, as today.

Seed: replace the 10 placeholder Cat Kicker steps (pattern id 1) with the drafted steps, and delete their placeholder progress rows (test data only). Seed the sections, checklist, skills and resources from the companion file. Resource bodies are written in markdown, beginner language, each with a short "why it matters", tips and common mistakes. Types are regenerated after the migration.

### 2. Instructions page (`/projects/:id/instructions`)

Layout, top to bottom:

1. Back link, heading, progress bar "X of Y steps done" (signed in).
2. **In this project** panel: *Tools* and *Materials* checklists (checkable, saved per user, optional items labelled, items can link to a resource), *Skills you'll learn* chips linking to resources, and *Jump to* links for the four stages. On desktop the panel sits in a sticky sidebar; on mobile it is at the top.
3. Four collapsible sections, each showing "n of m done". Each holds steps in a single column. A step shows number, title, what to do, a "Why" line, optional image, "Learn more" links to resources, and the existing Mark complete toggle.

Signed-out users see everything; ticking a checklist item or step redirects to sign-in, as the existing toggles do. If a pattern has no sections, the page falls back to the current flat step list.

### 3. Resource page (`/resources/:slug`)

Title, one-line summary, markdown body (headings, lists, tables, images), a "Back to the project" link when arrived from a project (router state; otherwise a link to `/projects`), and a friendly not-found. Markdown is rendered with `react-markdown` and `remark-gfm`, with raw HTML disabled.

### 4. Code structure

- Pages: `src/pages/Resource.tsx`; `PatternInstructions.tsx` reworked.
- Components in `src/components/patterns/`: `ProjectOverview` (checklists, skills, jump links), `ChecklistItem`, `StepSection`, `StepCard` reworked; `src/components/resources/MarkdownBody`.
- Hooks: `usePatternSteps` extended (sections, step resources, checklist, skills), `useChecklistProgress`, `useResource`.
- Route `/resources/:slug` added in `App.tsx`; `vercel.json` rewrite already covers it.

### 5. Behaviour

Same as before: optimistic toggles that revert with an inline error on failure, skeletons while loading, retry on failure.

### 6. Verification

`tsc -b`, `eslint .`, `vite build`. SQL checks: every `step_resources` row points to an existing resource, every resource is linked from a step, checklist item or skill, step numbers are unbroken. Manual: sign up, tick items and steps, reload and confirm persistence, open every resource link from the page, check mobile (about 412px) and desktop.

## Left to the builder

Collapsible mechanism (native `details` or a Radix primitive), sticky sidebar details, exact markdown styling, whether to fetch with one joined query or several, and final polish of resource copy within the outlines in the companion file.

## Calls made without the owner (please check)

- Resource URL pattern `/resources/:slug` (as the owner said); slugs listed in the companion file.
- Checklist ticks are saved per user, like step ticks.
- Drafted toy size 15 × 40 cm and the step wording are placeholders for the owner to confirm.
- Existing placeholder steps and their progress rows for the Cat Kicker are deleted and replaced.
- Checklist items and skills link to one resource each (the first slug listed in the companion file); extra slugs are reachable from the steps.
- A `step_resources` link with no `label` shows the resource title as link text; step 6's five links wrap as small chips.
- Resource bodies link to each other with ordinary markdown links to `/resources/<slug>`.
- The cat-safety notes (no buttons or loose trims, firm stitching, supervision) are included in the draft.
