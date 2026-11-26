import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

// shadcn/ui Badge, themed with the brand tokens.
// beginner = light chestnut fill, advanced = solid chestnut fill.
const badgeVariants = cva(
  'inline-flex w-fit items-center rounded-full border px-3 py-0.5 text-body-sm font-medium whitespace-nowrap',
  {
    variants: {
      variant: {
        beginner:
          'border-brand-border bg-chestnut-tertiary text-chestnut-900',
        advanced:
          'border-chestnut-primary bg-chestnut-primary text-white',
      },
    },
    defaultVariants: {
      variant: 'beginner',
    },
  },
)

interface BadgeProps
  extends React.ComponentProps<'span'>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants }
