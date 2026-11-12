import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

// Matches the landing page "Button - Nova" styles:
// primary = chestnut fill, outline = chestnut border, ghost = light hover.
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg text-body-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-chestnut-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-chestnut-primary text-white hover:bg-chestnut-primary/90',
        outline:
          'border border-chestnut-primary text-chestnut-900 hover:bg-chestnut-primary/10',
        ghost: 'text-chestnut-900 hover:bg-white/60',
      },
      size: {
        default: 'px-2.5 py-2',
        icon: 'min-h-9 min-w-9 p-2.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

interface ButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants }
