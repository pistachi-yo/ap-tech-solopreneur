import { Check } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'

interface StepToggleProps {
  stepId: number
  completed: boolean
  onToggle: (stepId: number) => Promise<void>
}

export function StepToggle({ stepId, completed, onToggle }: StepToggleProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  function handleClick() {
    if (!user) {
      navigate('/sign-in', { state: { from: location.pathname } })
      return
    }
    void onToggle(stepId)
  }

  return (
    <Button
      type="button"
      variant={completed ? 'default' : 'outline'}
      aria-pressed={completed}
      onClick={handleClick}
    >
      {completed && <Check className="size-4" />}
      {completed ? 'Completed' : 'Mark complete'}
    </Button>
  )
}
