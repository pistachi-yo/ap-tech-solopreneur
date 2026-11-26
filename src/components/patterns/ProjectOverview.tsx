import { Link, useLocation } from 'react-router'
import { ChecklistItemRow } from '@/components/patterns/ChecklistItem'
import type { ChecklistEntry, SkillEntry } from '@/hooks/usePatternSteps'
import type { PatternSection } from '@/types/database'

interface ProjectOverviewProps {
  checklist: ChecklistEntry[]
  skills: SkillEntry[]
  sections: PatternSection[]
  checkedIds: Set<number>
  onToggleItem: (itemId: number) => Promise<void>
}

export function ProjectOverview({
  checklist,
  skills,
  sections,
  checkedIds,
  onToggleItem,
}: ProjectOverviewProps) {
  const location = useLocation()
  const tools = checklist.filter((item) => item.kind === 'tool')
  const materials = checklist.filter((item) => item.kind === 'material')

  if (checklist.length === 0 && skills.length === 0 && sections.length === 0) {
    return null
  }

  const groups = [
    { title: 'Tools', items: tools },
    { title: 'Materials', items: materials },
  ]

  return (
    <aside
      aria-label="In this project"
      className="flex flex-col gap-6 rounded-lg border border-brand-border bg-white p-5"
    >
      <h2 className="font-heading text-2xl font-normal text-chestnut-900">
        In this project
      </h2>

      {groups.map(
        (group) =>
          group.items.length > 0 && (
            <section key={group.title}>
              <h3 className="mb-3 text-body font-medium text-chestnut-900">
                {group.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {group.items.map((item) => (
                  <ChecklistItemRow
                    key={item.id}
                    item={item}
                    checked={checkedIds.has(item.id)}
                    onToggle={onToggleItem}
                  />
                ))}
              </ul>
            </section>
          ),
      )}

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

      {sections.length > 0 && (
        <nav aria-label="Jump to a stage">
          <h3 className="mb-3 text-body font-medium text-chestnut-900">
            Jump to
          </h3>
          <ol className="flex flex-col gap-2">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#section-${section.id}`}
                  className="text-body-sm text-chestnut-primary underline underline-offset-2"
                >
                  {section.position}. {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </aside>
  )
}
