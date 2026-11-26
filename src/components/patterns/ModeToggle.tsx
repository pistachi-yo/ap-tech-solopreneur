import { cn } from '@/lib/utils'

interface ModeToggleProps {
  experienced: boolean
  onChange: (experienced: boolean) => void
}

const OPTIONS = [
  { label: 'Beginner', value: false },
  { label: 'Experienced', value: true },
] as const

export function ModeToggle({ experienced, onChange }: ModeToggleProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Instruction mode"
      className="inline-flex overflow-hidden rounded-lg border border-chestnut-primary text-body-sm"
    >
      {OPTIONS.map((option) => {
        const selected = experienced === option.value
        return (
          <button
            key={option.label}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              'px-3 py-1.5 font-medium outline-none focus-visible:ring-2 focus-visible:ring-chestnut-primary focus-visible:ring-inset',
              selected
                ? 'bg-chestnut-primary text-white'
                : 'bg-white text-chestnut-900 hover:bg-chestnut-tertiary',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
