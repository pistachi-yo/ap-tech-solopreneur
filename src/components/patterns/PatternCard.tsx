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
    <Card
      className={cn(
        pattern.coming_soon
          ? 'bg-brand-border/15'
          : [
              // The whole card is the link target (see the stretched link
              // below), so hover and pressed states are driven by that link.
              'relative transition-[transform,box-shadow,border-color,background-color] duration-150 motion-reduce:transition-none',
              'has-[a:hover]:border-chestnut-primary',
              'has-[a:hover:not(:active)]:-translate-y-0.5 has-[a:hover:not(:active)]:shadow-[0_8px_18px_-8px_rgba(149,54,35,0.45)] motion-reduce:has-[a:hover:not(:active)]:translate-y-0',
              'has-[a:active]:border-chestnut-primary has-[a:active]:bg-chestnut-tertiary',
              'has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-chestnut-primary has-[a:focus-visible]:ring-offset-2',
            ],
      )}
    >
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
              <Link
                to={`/projects/${pattern.id}/instructions`}
                className="after:absolute after:inset-0 after:content-['']"
              >
                Start making
              </Link>
            </Button>
          )}
          <div className="relative z-10">
            <BookmarkButton
              patternId={pattern.id}
              bookmarked={bookmarked}
              onToggle={onToggleBookmark}
            />
          </div>
        </CardFooter>
      </div>
    </Card>
  )
}
