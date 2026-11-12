import { useMemo } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { Header } from '@/components/landing/Header'
import { StepCard } from '@/components/patterns/StepCard'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { usePatternSteps } from '@/hooks/usePatternSteps'
import { useStepProgress } from '@/hooks/useStepProgress'
import { useAuth } from '@/lib/auth'

export default function PatternInstructions() {
  const { id } = useParams()
  // Only plain whole numbers are valid ids; anything else is "not found".
  const patternId = id && /^\d+$/.test(id) ? Number(id) : null

  const { user } = useAuth()
  const { pattern, steps, loading, error, notFound, reload } =
    usePatternSteps(patternId)
  const stepIds = useMemo(() => steps.map((step) => step.id), [steps])
  const {
    completedIds,
    toggle,
    error: progressError,
  } = useStepProgress(stepIds)

  const completedCount = steps.filter((step) => completedIds.has(step.id)).length
  const percent = steps.length > 0 ? (completedCount / steps.length) * 100 : 0

  return (
    <div className="min-h-svh bg-chestnut-tertiary">
      <Header />
      <main className="mx-auto max-w-page px-3 py-8 sm:px-6">
        <Link
          to="/projects"
          className="mb-6 inline-flex items-center gap-2 text-body-sm font-medium text-chestnut-900 hover:underline"
        >
          <ArrowLeft className="size-4" />
          All projects
        </Link>

        {loading && (
          <div className="flex flex-col gap-6" aria-busy="true">
            <div className="h-12 w-2/3 animate-pulse rounded-lg bg-brand-border/30" />
            {[0, 1, 2].map((key) => (
              <div
                key={key}
                className="h-80 animate-pulse rounded-lg bg-brand-border/30"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div role="alert" className="flex flex-col items-start gap-4">
            <p className="text-body text-chestnut-primary">{error}</p>
            <Button type="button" variant="outline" onClick={reload}>
              Try again
            </Button>
          </div>
        )}

        {!loading && !error && notFound && (
          <div className="flex flex-col items-start gap-4">
            <h1 className="font-heading text-h1 font-normal tracking-[-1.5px] text-chestnut-900">
              We couldn’t find that project
            </h1>
            <p className="text-body text-chestnut-900">
              It may have been moved or the link may be wrong.
            </p>
            <Button asChild>
              <Link to="/projects">Browse projects</Link>
            </Button>
          </div>
        )}

        {!loading && !error && !notFound && pattern && (
          <>
            <h1 className="font-heading text-h1 font-normal tracking-[-1.5px] text-chestnut-900">
              {pattern.pattern_name}
            </h1>

            {user && steps.length > 0 && (
              <div className="mt-6 flex max-w-xl flex-col gap-2">
                <p className="text-body-sm font-medium text-chestnut-900">
                  {completedCount} of {steps.length} steps done
                </p>
                <Progress value={percent} aria-label="Steps completed" />
              </div>
            )}

            {progressError && (
              <p role="alert" className="mt-4 text-body-sm text-chestnut-primary">
                {progressError}
              </p>
            )}

            {steps.length === 0 ? (
              <p className="mt-8 text-body text-chestnut-900">
                The steps for this project are coming soon.
              </p>
            ) : (
              <ol className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                {steps.map((step) => (
                  <li key={step.id} className="flex">
                    <div className="w-full">
                      <StepCard
                        step={step}
                        completed={completedIds.has(step.id)}
                        onToggle={toggle}
                      />
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </>
        )}
      </main>
    </div>
  )
}
