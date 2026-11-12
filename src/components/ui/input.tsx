import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      className={cn(
        'h-9 w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-body-sm text-chestnut-900 outline-none placeholder:text-mushroom-primary focus-visible:ring-2 focus-visible:ring-chestnut-primary disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
