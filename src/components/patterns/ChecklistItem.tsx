import { Check } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router'
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
    <li className="flex items-start gap-3">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-label={item.name}
        onClick={handleClick}
        className={cn(
          'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border border-chestnut-primary outline-none focus-visible:ring-2 focus-visible:ring-chestnut-primary focus-visible:ring-offset-2',
          checked ? 'bg-chestnut-primary text-white' : 'bg-white',
        )}
      >
        {checked && <Check className="size-3.5" aria-hidden="true" />}
      </button>
      <div className="min-w-0">
        <p
          className={cn(
            'text-body-sm text-chestnut-900',
            checked && 'line-through opacity-70',
          )}
        >
          {item.name}
          {item.optional && (
            <span className="ml-2 text-mushroom-primary">(optional)</span>
          )}
        </p>
        {item.note && (
          <p className="text-body-sm text-mushroom-primary">{item.note}</p>
        )}
        {item.resource && (
          <Link
            to={`/resources/${item.resource.slug}`}
            state={{ from: location.pathname }}
            className="text-body-sm font-medium text-chestnut-primary underline underline-offset-2"
          >
            Learn more
          </Link>
        )}
      </div>
    </li>
  )
}
