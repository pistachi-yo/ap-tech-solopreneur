import { ChevronDown } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

// Native <select> themed like Input, with a chevron. Native keeps it accessible
// and gives phones their own picker.
function Select({
  className,
  children,
  ...props
}: React.ComponentProps<'select'>) {
  return (
    <div className="relative">
      <select
        className={cn(
          'h-9 w-full appearance-none rounded-lg border border-brand-border/60 bg-transparent py-2 pr-9 pl-3 text-body-sm text-chestnut-900 outline-none focus-visible:ring-2 focus-visible:ring-chestnut-primary disabled:opacity-50',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-chestnut-900"
        aria-hidden="true"
      />
    </div>
  )
}

export { Select }
