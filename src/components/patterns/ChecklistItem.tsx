import { Check } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'
import type { ChecklistEntry } from '@/hooks/usePatternSteps'

interface ChecklistItemRowProps {
  item: ChecklistEntry
  checked: boolean
  onToggle: (itemId: number) => Promise<void>
}

export function ChecklistItemRow({
  item,
  checked,
  onToggle,
}: ChecklistItemRowProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  function handleClick() {
    if (!user) {
      navigate('/sign-in', { state: { from: location.pathname } })
      return
    }
    void onToggle(item.id)
  }

  return (
    <li>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={handleClick}
        className="flex w-full items-start gap-3 rounded-lg py-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-chestnut-primary"
      >
        <span
          aria-hidden="true"
          className={cn(
            'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border border-chestnut-primary',
            checked ? 'bg-chestnut-primary text-white' : 'bg-white',
          )}
        >
          {checked && <Check className="size-3.5" />}
        </span>
        <span className="min-w-0">
          <span
            className={cn(
              'block text-body-sm text-chestnut-900',
              checked && 'line-through opacity-70',
            )}
          >
            {item.name}
            {item.optional && (
              <span className="ml-2 text-mushroom-primary">(optional)</span>
            )}
          </span>
          {item.note && (
            <span className="block text-body-sm text-mushroom-primary">
              {item.note}
            </span>
          )}
        </span>
      </button>
    </li>
  )
}
