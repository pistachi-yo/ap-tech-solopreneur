import { ModeToggle } from '@/components/patterns/ModeToggle'

interface ModePanelProps {
  experienced: boolean
  onChange: (experienced: boolean) => void
}

// The mode switch and its help text, framed as one card.
export function ModePanel({ experienced, onChange }: ModePanelProps) {
  return (
    <section
      aria-label="Instruction mode"
      className="flex w-full flex-col gap-2 rounded-lg border border-brand-border bg-white p-3 sm:w-auto sm:max-w-xs sm:items-end sm:p-4"
    >
      <ModeToggle experienced={experienced} onChange={onChange} />
      <p
        aria-live="polite"
        className="text-body-sm text-mushroom-primary sm:text-right"
      >
        {experienced
          ? 'Additional tips and hints for beginners are hidden.'
          : null}
      </p>
    </section>
  )
}
