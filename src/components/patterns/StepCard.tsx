import { ChevronDown, Image as ImageIcon } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { StepToggle } from '@/components/patterns/StepToggle'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { StepLink } from '@/hooks/usePatternSteps'
import { cn } from '@/lib/utils'
import type { PatternStep } from '@/types/database'

interface StepCardProps {
  step: PatternStep
  completed: boolean
  onToggle: (stepId: number) => Promise<void>
  links?: StepLink[]
  experienced?: boolean
}

export function StepCard({
  step,
  completed,
  onToggle,
  links,
  experienced = false,
}: StepCardProps) {
  const location = useLocation()
  // A photo that fails to load falls back to the empty photo area.
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(step.image_url) && !imageFailed

  // Progressive disclosure: a completed step folds down to its number, title
  // and toggle so the unfinished steps are easier to reach. Marking a step
  // complete collapses it; marking it incomplete opens it again.
  const [detailsOpen, setDetailsOpen] = useState(!completed)
  const [prevCompleted, setPrevCompleted] = useState(completed)
  if (completed !== prevCompleted) {
    setPrevCompleted(completed)
    setDetailsOpen(!completed)
  }
  const collapsed = completed && !detailsOpen
  const title = step.title ?? `Step ${step.step_number}`
  const bodyId = `step-body-${step.id}`
  const detailsLink = (
    <button
      type="button"
      aria-expanded={detailsOpen}
      aria-controls={bodyId}
      onClick={() => setDetailsOpen((open) => !open)}
      className="rounded-sm text-body-sm font-medium text-chestnut-primary underline underline-offset-2 outline-none focus-visible:ring-2 focus-visible:ring-chestnut-primary"
    >
      {detailsOpen ? 'Hide step' : 'View step'}
    </button>
  )

  // Collapsed: one compact line, number and title on the left, the toggle
  // with a "View step" link under it on the right.
  if (collapsed) {
    return (
      <Card
        id={`step-${step.id}`}
        className="scroll-mt-6 opacity-70 transition-opacity"
      >
        <div id={bodyId} className="flex items-center justify-between gap-3 px-6 py-3">
          <div className="flex min-w-0 items-baseline gap-3">
            <p className="shrink-0 text-body-sm font-medium text-mushroom-primary">
              Step {step.step_number}
            </p>
            <h2 className="truncate font-heading text-lg font-normal text-chestnut-900">
              {title}
            </h2>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <StepToggle
              stepId={step.id}
              completed={completed}
              onToggle={onToggle}
            />
            {detailsLink}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card
      id={`step-${step.id}`}
      className={cn('@container scroll-mt-6 transition-opacity', completed && 'opacity-70')}
    >
      {/* Text on the left, photo on the right once the card is wide enough;
          stacked (photo last) in narrow cards. */}
      <div className="grid grid-cols-1 @2xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex flex-col">
          <CardHeader className="pt-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-body-sm font-medium text-mushroom-primary">
                Step {step.step_number}
              </p>
              <div className="flex flex-col items-end gap-1">
                <StepToggle
                  stepId={step.id}
                  completed={completed}
                  onToggle={onToggle}
                />
                {completed && detailsLink}
              </div>
            </div>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent id={bodyId} className="flex flex-col gap-3">
            <p className="text-body text-chestnut-900">{step.description}</p>
            {!experienced && step.why && (
              <p className="text-body-sm text-chestnut-900">
                <span className="font-medium">Why: </span>
                {step.why}
              </p>
            )}
            {!experienced && links && links.length > 0 && (
              <details className="group rounded-lg border border-brand-border bg-chestnut-tertiary">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 text-body-sm font-medium text-chestnut-900 [&::-webkit-details-marker]:hidden">
                  <span>Learn more</span>
                  <ChevronDown
                    className="size-4 shrink-0 transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <ul className="flex flex-col gap-3 border-t border-brand-border/60 px-3 py-3">
                  {links.map((link) => (
                    <li key={link.slug}>
                      <Link
                        to={`/resources/${link.slug}`}
                        state={{ from: `${location.pathname}#step-${step.id}` }}
                        className="text-body-sm font-medium text-chestnut-primary underline underline-offset-2"
                      >
                        {link.label ?? link.title}
                      </Link>
                      {link.summary && (
                        <p className="text-body-sm text-mushroom-primary">
                          {link.summary}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </CardContent>
        </div>

        <figure
          className="flex flex-col gap-2 px-6 pb-6 @2xl:pt-6 @2xl:pl-0"
        >
          {showImage ? (
            <img
              src={step.image_url ?? undefined}
              alt={step.title ?? `Step ${step.step_number}`}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="aspect-[4/3] w-full rounded-lg object-cover"
            />
          ) : (
            <div
              role="img"
              aria-label="Photo coming soon"
              className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-brand-border bg-brand-border/20 text-mushroom-primary"
            >
              <ImageIcon className="size-8" aria-hidden="true" />
              <span className="text-body-sm">Photo coming soon</span>
            </div>
          )}
          {showImage && step.image_credit && (
            <figcaption className="text-body-sm text-mushroom-primary">
              {step.image_credit}
            </figcaption>
          )}
        </figure>
      </div>
    </Card>
  )
}
