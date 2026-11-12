import { StepToggle } from '@/components/patterns/StepToggle'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { PatternStep } from '@/types/database'

interface StepCardProps {
  step: PatternStep
  completed: boolean
  onToggle: (stepId: number) => Promise<void>
}

export function StepCard({ step, completed, onToggle }: StepCardProps) {
  return (
    <Card className={cn('transition-opacity', completed && 'opacity-70')}>
      {step.image_url ? (
        <img
          src={step.image_url}
          alt={step.title ?? `Step ${step.step_number}`}
          loading="lazy"
          className="aspect-video w-full object-cover"
        />
      ) : (
        <div className="aspect-video w-full bg-brand-border/30" aria-hidden="true" />
      )}
      <CardHeader className="pt-6">
        <p className="text-body-sm font-medium text-mushroom-primary">
          Step {step.step_number}
        </p>
        <CardTitle>{step.title ?? `Step ${step.step_number}`}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-body text-chestnut-900">{step.description}</p>
      </CardContent>
      <CardFooter>
        <StepToggle stepId={step.id} completed={completed} onToggle={onToggle} />
      </CardFooter>
    </Card>
  )
}
