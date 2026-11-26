import { Image as ImageIcon } from 'lucide-react'
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
}

export function StepCard({ step, completed, onToggle, links }: StepCardProps) {
  const location = useLocation()
  // A photo that fails to load falls back to the empty photo area.
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(step.image_url) && !imageFailed

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
              <StepToggle
                stepId={step.id}
                completed={completed}
                onToggle={onToggle}
              />
            </div>
            <CardTitle>{step.title ?? `Step ${step.step_number}`}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-body text-chestnut-900">{step.description}</p>
            {step.why && (
              <p className="text-body-sm text-chestnut-900">
                <span className="font-medium">Why: </span>
                {step.why}
              </p>
            )}
            {links && links.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-body-sm font-medium text-mushroom-primary">
                  Learn more:
                </span>
                {links.map((link) => (
                  <Link
                    key={link.slug}
                    to={`/resources/${link.slug}`}
                    state={{ from: `${location.pathname}#step-${step.id}` }}
                    className="rounded-lg border border-brand-border bg-chestnut-tertiary px-2.5 py-1 text-body-sm text-chestnut-900 hover:underline"
                  >
                    {link.label ?? link.title}
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </div>

        <figure className="flex flex-col gap-2 px-6 pb-6 @2xl:pt-6 @2xl:pl-0">
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
