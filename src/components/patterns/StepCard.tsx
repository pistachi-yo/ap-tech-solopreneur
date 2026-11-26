import { Link, useLocation } from 'react-router'
import { StepToggle } from '@/components/patterns/StepToggle'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
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

  return (
    <Card
      id={`step-${step.id}`}
      className={cn('scroll-mt-6 transition-opacity', completed && 'opacity-70')}
    >
      {step.image_url && (
        <img
          src={step.image_url}
          alt={step.title ?? `Step ${step.step_number}`}
          loading="lazy"
          className="aspect-video w-full object-cover"
        />
      )}
      <CardHeader className="pt-6">
        <p className="text-body-sm font-medium text-mushroom-primary">
          Step {step.step_number}
        </p>
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
      <CardFooter>
        <StepToggle stepId={step.id} completed={completed} onToggle={onToggle} />
      </CardFooter>
    </Card>
  )
}
