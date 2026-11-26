import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ComingSoonBandProps {
  className?: string
}

// Full-width saffron band that marks a project as not available yet.
export function ComingSoonBand({ className }: ComingSoonBandProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 bg-saffron-primary px-6 py-3 text-body font-medium text-chestnut-900',
        className,
      )}
    >
      <Clock className="size-5" aria-hidden="true" />
      Coming soon
    </div>
  )
}
