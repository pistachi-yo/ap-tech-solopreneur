import { Check, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { ChecklistItemRow } from '@/components/patterns/ChecklistItem'
import type { ChecklistEntry, SkillEntry } from '@/hooks/usePatternSteps'
import { cn } from '@/lib/utils'
import type { PatternSection } from '@/types/database'

export interface SectionProgress {
  done: number
  total: number
}

interface ProjectOverviewProps {
  checklist: ChecklistEntry[]
  skills: SkillEntry[]
  sections: PatternSection[]
  sectionProgress: Map<number, SectionProgress>
  checkedIds: Set<number>
  onToggleItem: (itemId: number) => Promise<void>
}

// One "Learn more" page per checklist category (slugs live in `resources`).
const CATEGORIES = [
  { kind: 'tool', title: 'Tools', guideSlug: 'sewing-tools-guide' },
  { kind: 'material', title: 'Materials', guideSlug: 'materials-guide' },
] as const

export function ProjectOverview({
  checklist,
  skills,
  sections,
  sectionProgress,
  checkedIds,
  onToggleItem,
}: ProjectOverviewProps) {
  const location = useLocation()
  // Open on larger screens, collapsed on phones so the steps come first.
  const [open, setOpen] = useState(
    () =>
      typeof window === 'undefined' ||
      window.matchMedia('(min-width: 768px)').matches,
  )

  const checkedCount = checklist.filter((item) => checkedIds.has(item.id)).length
  const hasChecklist = checklist.length > 0 || skills.length > 0

  if (!hasChecklist && sections.length === 0) return null

  return (
    <div className="flex flex-col gap-4">
      {hasChecklist && (
        <details
          open={open}
          onToggle={(event) => setOpen(event.currentTarget.open)}
          className="group rounded-lg border border-brand-border bg-white"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
            <div>
              <h2 className="font-heading text-2xl font-normal text-chestnut-900">
                What you’ll need
              </h2>
              {checklist.length > 0 && (
                <p className="mt-1 text-body-sm text-mushroom-primary">
                  {checkedCount} of {checklist.length} ready
                </p>
              )}
            </div>
            <span className="flex shrink-0 items-center gap-2 text-body-sm font-medium text-chestnut-900">
              <span className="group-open:hidden">Show</span>
              <span className="hidden group-open:inline">Hide</span>
              <ChevronDown
                className="size-5 transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </span>
          </summary>

          <div className="flex flex-col gap-6 border-t border-brand-border/60 p-4 sm:p-5">
            <div className="grid gap-6 md:grid-cols-2">
              {CATEGORIES.map((category) => {
                const items = checklist.filter(
                  (item) => item.kind === category.kind,
                )
                if (items.length === 0) return null
                return (
                  <section key={category.kind}>
                    <div className="mb-2 flex items-baseline justify-between gap-3">
                      <h3 className="text-body font-medium text-chestnut-900">
                        {category.title}
                      </h3>
                      <Link
                        to={`/resources/${category.guideSlug}`}
                        state={{ from: location.pathname }}
                        className="text-body-sm font-medium text-chestnut-primary underline underline-offset-2"
                      >
                        Learn more
                      </Link>
                    </div>
                    <ul className="flex flex-col">
                      {items.map((item) => (
                        <ChecklistItemRow
                          key={item.id}
                          item={item}
                          checked={checkedIds.has(item.id)}
                          onToggle={onToggleItem}
                        />
                      ))}
                    </ul>
                  </section>
                )
              })}
            </div>

            {skills.length > 0 && (
              <section>
                <h3 className="mb-3 text-body font-medium text-chestnut-900">
                  Skills you’ll learn
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <li key={skill.id}>
                      {skill.resource ? (
                        <Link
                          to={`/resources/${skill.resource.slug}`}
                          state={{ from: location.pathname }}
                          className="inline-block rounded-lg border border-brand-border bg-chestnut-tertiary px-2.5 py-1 text-body-sm text-chestnut-900 hover:underline"
                        >
                          {skill.label}
                        </Link>
                      ) : (
                        <span className="inline-block rounded-lg border border-brand-border bg-chestnut-tertiary px-2.5 py-1 text-body-sm text-chestnut-900">
                          {skill.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </details>
      )}

      {sections.length > 0 && (
        <nav
          aria-label="Jump to a stage"
          className="rounded-lg border border-brand-border bg-white p-4 sm:p-5"
        >
          <h2 className="mb-3 text-body font-medium text-chestnut-900">
            Jump to
          </h2>
          <ol className="grid gap-2 sm:grid-cols-2">
            {sections.map((section) => {
              const progress = sectionProgress.get(section.id) ?? {
                done: 0,
                total: 0,
              }
              const complete = progress.total > 0 && progress.done === progress.total
              return (
                <li key={section.id}>
                  <a
                    href={`#section-${section.id}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-brand-border/60 bg-chestnut-tertiary px-3 py-2 text-body-sm text-chestnut-900 hover:underline"
                  >
                    <span>
                      {section.position}. {section.title}
                    </span>
                    <span
                      className={cn(
                        'flex shrink-0 items-center gap-1 font-medium',
                        complete ? 'text-chestnut-primary' : 'text-mushroom-primary',
                      )}
                    >
                      {complete && <Check className="size-4" aria-hidden="true" />}
                      {progress.done}/{progress.total} completed
                    </span>
                  </a>
                </li>
              )
            })}
          </ol>
        </nav>
      )}
    </div>
  )
}
