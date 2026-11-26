// Short encouragement shown once progress reaches each milestone. The message
// for the highest milestone reached is returned; none below 25% or at 100%
// (the page shows its own completion headline then).
const MILESTONES: { at: number; message: string }[] = [
  { at: 90, message: 'Almost there. Just a few steps to go.' },
  { at: 75, message: 'Three quarters done. The finish line is in sight.' },
  { at: 50, message: 'Halfway there. Keep it up.' },
  { at: 25, message: 'A quarter done. Great start.' },
]

export function getProgressMessage(percent: number): string | null {
  if (percent >= 100) return null
  return MILESTONES.find((milestone) => percent >= milestone.at)?.message ?? null
}
