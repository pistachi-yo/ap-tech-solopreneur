// Short, playful encouragement shown once progress reaches each milestone.
// Messages never mention the percentage or the project itself. The message
// for the highest milestone reached is returned; none below 25% or at 100%
// (the page shows its own completion headline then).
const MILESTONES: { at: number; message: string }[] = [
  { at: 90, message: 'So close you can almost taste it.' },
  { at: 75, message: 'The finish line is waving at you.' },
  { at: 50, message: 'Look at you go! This is really coming together.' },
  { at: 25, message: 'Off to a lovely start. Keep that momentum going.' },
]

export function getProgressMessage(percent: number): string | null {
  if (percent >= 100) return null
  return MILESTONES.find((milestone) => percent >= milestone.at)?.message ?? null
}
