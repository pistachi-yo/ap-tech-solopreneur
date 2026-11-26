import { useEffect, useMemo } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router'
import { Header } from '@/components/landing/Header'
import { ModeToggle } from '@/components/patterns/ModeToggle'
import { ProjectOverview } from '@/components/patterns/ProjectOverview'
import { StepCard } from '@/components/patterns/StepCard'
import { StepSection } from '@/components/patterns/StepSection'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useChecklistProgress } from '@/hooks/useChecklistProgress'
import { useExperiencedMode } from '@/hooks/useExperiencedMode'
import { usePatternSteps } from '@/hooks/usePatternSteps'
import { useStepProgress } from '@/hooks/useStepProgress'
import { useAuth } from '@/lib/auth'
import { getProgressMessage } from '@/lib/progressMessage'

export default function PatternInstructions() {
  const { id } = useParams()
  // Only plain whole numbers are valid ids; anything else is "not found".
  const patternId = id && /^\d+$/.test(id) ? Number(id) : null

  const { user } = useAuth()
  const [experienced, setExperienced] = useExperiencedMode()
  const {
    pattern,
    steps,
    sections,
    stepLinks,
    checklist,
    skills,
    loading,
    error,
    notFound,
    reload,
  } = usePatternSteps(patternId)
  const stepIds = useMemo(() => steps.map((step) => step.id), [steps])
  const itemIds = useMemo(() => checklist.map((item) => item.id), [checklist])
  const {
    completedIds,
    toggle,
    error: progressError,
  } = useStepProgress(stepIds)
  const {
    checkedIds,
    toggle: toggleItem,
    error: checklistError,
  } = useChecklistProgress(itemIds)

  // Coming back from a resource page lands on the step the reader left.
  const { hash } = useLocation()
  useEffect(() => {
    if (loading || !hash) return
    document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [loading, hash])

  const completedCount = steps.filter((step) => completedIds.has(step.id)).length
  const percent = steps.length > 0 ? (completedCount / steps.length) * 100 : 0

  // Sectioned projects read best in a narrower column; others keep the wide grid.
  const sectioned = sections.length > 0 && steps.length > 0
  const widthClass = sectioned ? 'max-w-4xl' : 'max-w-page'
  const sectionProgress = new Map(
    sections.map((section) => {
      const inSection = steps.filter((step) => step.section_id === section.id)
      return [
        section.id,
        {
          done: inSection.filter((step) => completedIds.has(step.id)).length,
          total: inSection.length,
        },
      ] as const
    }),
  )
  const progressMessage = getProgressMessage(percent)
  const ready = !loading && !error && !notFound
  const showProgress = ready && pattern !== null && !!user && steps.length > 0

  return (
    <div className="min-h-svh bg-chestnut-tertiary">
      <Header />
      <main className={`mx-auto px-3 pt-8 pb-6 sm:px-6 ${widthClass}`}>
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

        {ready && pattern && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="font-heading text-h1 font-normal tracking-[-1.5px] text-chestnut-900">
                {pattern.pattern_name}
              </h1>
              <ModeToggle experienced={experienced} onChange={setExperienced} />
            </div>
            {experienced && (
              <p className="mt-2 text-body-sm text-mushroom-primary sm:text-right">
                Additional tips and hints for beginners are hidden.
              </p>
            )}
          </>
        )}
      </main>

      {showProgress && (
        <div className="w-full border-y border-brand-border bg-white">
          <div className={`mx-auto px-3 py-5 sm:px-6 ${widthClass}`}>
            <div className="mb-3 flex items-baseline justify-between gap-4">
              <p className="font-heading text-2xl font-normal text-chestnut-900">
                {completedCount === steps.length
                  ? `All ${steps.length} steps done. Time for the kick test!`
                  : `${completedCount} of ${steps.length} steps done`}
              </p>
              <p className="text-body font-medium text-chestnut-primary">
                {Math.round(percent)}%
              </p>
            </div>
            <Progress
              value={percent}
              className="h-4"
              aria-label="Steps completed"
            />
            {progressMessage && (
              <p
                aria-live="polite"
                className="mt-3 text-body-sm font-medium text-chestnut-primary"
              >
                {progressMessage}
              </p>
            )}
          </div>
        </div>
      )}

      {ready && pattern && (
        <div className={`mx-auto px-3 pt-8 pb-8 sm:px-6 ${widthClass}`}>
          {(progressError || checklistError) && (
            <p role="alert" className="mb-4 text-body-sm text-chestnut-primary">
              {progressError ?? checklistError}
            </p>
          )}

          {steps.length === 0 ? (
            <p className="text-body text-chestnut-900">
              The steps for this project are coming soon.
            </p>
          ) : sections.length === 0 ? (
            <ol className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {steps.map((step) => (
                <li key={step.id} className="flex">
                  <div className="w-full">
                    <StepCard
                      step={step}
                      completed={completedIds.has(step.id)}
                      onToggle={toggle}
                      links={stepLinks.get(step.id)}
                      experienced={experienced}
                    />
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="flex flex-col gap-6">
              <ProjectOverview
                checklist={checklist}
                skills={skills}
                sections={sections}
                sectionProgress={sectionProgress}
                checkedIds={checkedIds}
                onToggleItem={toggleItem}
                experienced={experienced}
              />
              {sections.map((section) => (
                <StepSection
                  key={section.id}
                  section={section}
                  steps={steps.filter((step) => step.section_id === section.id)}
                  stepLinks={stepLinks}
                  completedIds={completedIds}
                  onToggle={toggle}
                  experienced={experienced}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
