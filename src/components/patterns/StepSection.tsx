import { ChevronDown } from 'lucide-react'
import { StepCard } from '@/components/patterns/StepCard'
import type { StepLink } from '@/hooks/usePatternSteps'
import type { PatternSection, PatternStep } from '@/types/database'

interface StepSectionProps {
  section: PatternSection
  steps: PatternStep[]
  stepLinks: Map<number, StepLink[]>
  completedIds: Set<number>
  onToggle: (stepId: number) => Promise<void>
  experienced: boolean
}

export function StepSection({
  section,
  steps,
  stepLinks,
  completedIds,
  onToggle,
  experienced,
}: StepSectionProps) {
  const done = steps.filter((step) => completedIds.has(step.id)).length

  return (
    <details
      id={`section-${section.id}`}
      open
      className="group scroll-mt-6 rounded-lg border border-brand-border bg-white/60"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
        <div>
          <h2 className="font-heading text-2xl font-normal text-chestnut-900">
            {section.position}. {section.title}
          </h2>
          {section.summary && (
            <p className="mt-1 text-body-sm text-mushroom-primary">
              {section.summary}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-body-sm font-medium text-chestnut-900">
            {done} of {steps.length} done
          </span>
          <ChevronDown
            className="size-5 transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </div>
      </summary>
      <ol className="flex flex-col gap-4 p-4 pt-0 sm:p-5 sm:pt-0">
        {steps.map((step) => (
          <li key={step.id}>
            <StepCard
              step={step}
              completed={completedIds.has(step.id)}
              onToggle={onToggle}
              links={stepLinks.get(step.id)}
              experienced={experienced}
            />
          </li>
        ))}
      </ol>
    </details>
  )
}
