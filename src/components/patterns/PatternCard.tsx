import { Link } from 'react-router'
import { BookmarkButton } from '@/components/patterns/BookmarkButton'
import { ComingSoonBand } from '@/components/patterns/ComingSoonBand'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
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
    <Card className={cn(pattern.coming_soon && 'bg-brand-border/15')}>
      {pattern.image_url ? (
        <img
          src={pattern.image_url}
          alt={pattern.pattern_name}
          loading="lazy"
          className={cn(
            'aspect-video w-full object-cover',
            pattern.coming_soon && 'grayscale',
          )}
        />
      ) : (
        <div className="aspect-video w-full bg-brand-border/30" aria-hidden="true" />
      )}
      {pattern.coming_soon && <ComingSoonBand />}
      <div
        className={cn('flex flex-1 flex-col', pattern.coming_soon && 'opacity-60')}
      >
        <CardHeader className="pt-6">
          <Badge variant={pattern.skill_level === 'Advanced' ? 'advanced' : 'beginner'}>
            {pattern.skill_level}
          </Badge>
          <CardTitle>{pattern.pattern_name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-body text-chestnut-900">
            {pattern.pattern_description}
          </p>
        </CardContent>
        <CardFooter>
          {pattern.coming_soon ? (
            <p className="text-body-sm font-medium text-mushroom-primary">
              Instructions aren’t available yet.
            </p>
          ) : (
            <Button asChild>
              <Link to={`/projects/${pattern.id}/instructions`}>
                Start making
              </Link>
            </Button>
          )}
          <BookmarkButton
            patternId={pattern.id}
            bookmarked={bookmarked}
            onToggle={onToggleBookmark}
          />
        </CardFooter>
      </div>
    </Card>
  )
}
