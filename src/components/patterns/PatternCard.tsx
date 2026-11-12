import { Link } from 'react-router'
import { BookmarkButton } from '@/components/patterns/BookmarkButton'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Pattern } from '@/types/database'

interface PatternCardProps {
  pattern: Pattern
  bookmarked: boolean
  onToggleBookmark: (patternId: number) => Promise<void>
}

export function PatternCard({
  pattern,
  bookmarked,
  onToggleBookmark,
}: PatternCardProps) {
  return (
    <Card>
      {pattern.image_url ? (
        <img
          src={pattern.image_url}
          alt={pattern.pattern_name}
          loading="lazy"
          className="aspect-video w-full object-cover"
        />
      ) : (
        <div className="aspect-video w-full bg-brand-border/30" aria-hidden="true" />
      )}
      <CardHeader className="pt-6">
        <CardTitle>{pattern.pattern_name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-body text-chestnut-900">
          {pattern.pattern_description}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link to={`/projects/${pattern.id}/instructions`}>
            View instructions
          </Link>
        </Button>
        <BookmarkButton
          patternId={pattern.id}
          bookmarked={bookmarked}
          onToggle={onToggleBookmark}
        />
      </CardFooter>
    </Card>
  )
}
