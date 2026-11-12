import { Bookmark } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'

interface BookmarkButtonProps {
  patternId: number
  bookmarked: boolean
  onToggle: (patternId: number) => Promise<void>
}

export function BookmarkButton({
  patternId,
  bookmarked,
  onToggle,
}: BookmarkButtonProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  function handleClick() {
    if (!user) {
      navigate('/sign-in', { state: { from: location.pathname } })
      return
    }
    void onToggle(patternId)
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-pressed={bookmarked}
      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this project'}
      onClick={handleClick}
    >
      <Bookmark
        className={cn(
          'size-5',
          bookmarked && 'fill-chestnut-primary text-chestnut-primary',
        )}
      />
    </Button>
  )
}
