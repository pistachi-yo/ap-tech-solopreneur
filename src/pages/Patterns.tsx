import { useState } from 'react'
import { Header } from '@/components/landing/Header'
import { PatternCard } from '@/components/patterns/PatternCard'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { useBookmarks } from '@/hooks/useBookmarks'
import { usePatterns } from '@/hooks/usePatterns'

const ALL_LEVELS = 'All'
const LEVEL_ORDER = ['Beginner', 'Intermediate', 'Advanced']

export default function Patterns() {
  const { patterns, loading, error, reload } = usePatterns()
  const { bookmarkedIds, toggle, error: bookmarkError } = useBookmarks()
  const [skillLevel, setSkillLevel] = useState(ALL_LEVELS)

  // Offer only the levels that exist, in a sensible order.
  const levels = Array.from(new Set(patterns.map((pattern) => pattern.skill_level)))
    .sort((a, b) => {
      const rank = (level: string) => {
        const index = LEVEL_ORDER.indexOf(level)
        return index === -1 ? LEVEL_ORDER.length : index
      }
      return rank(a) - rank(b) || a.localeCompare(b)
    })
  const visiblePatterns =
    skillLevel === ALL_LEVELS
      ? patterns
      : patterns.filter((pattern) => pattern.skill_level === skillLevel)

  return (
    <div className="min-h-svh bg-chestnut-tertiary">
      <Header />
      <section className="bg-chestnut-primary">
        <div className="mx-auto max-w-page px-3 py-10 sm:px-6">
          <h1 className="font-heading text-h1 font-normal tracking-[-1.5px] text-chestnut-tertiary">
            Find your next project here
            <span className="text-chestnut-900">.</span>
          </h1>
        </div>
      </section>

      <main className="mx-auto max-w-page px-3 py-8 sm:px-6">
        <div className="mb-8 flex items-center gap-6">
          <Label htmlFor="skill-level" className="w-24 shrink-0 text-body">
            Skill level
          </Label>
          <div className="w-full max-w-52">
            <Select
              id="skill-level"
              value={skillLevel}
              onChange={(event) => setSkillLevel(event.target.value)}
            >
              <option value={ALL_LEVELS}>{ALL_LEVELS}</option>
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {bookmarkError && (
          <p role="alert" className="mb-4 text-body-sm text-chestnut-primary">
            {bookmarkError}
          </p>
        )}

        {loading && (
          <div
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            aria-busy="true"
          >
            {[0, 1, 2].map((key) => (
              <div
                key={key}
                className="h-96 animate-pulse rounded-lg bg-brand-border/30"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div role="alert" className="flex flex-col items-start gap-4">
            <p className="text-body text-chestnut-primary">{error}</p>
            <Button type="button" variant="outline" onClick={reload}>
              Try again
            </Button>
          </div>
        )}

        {!loading && !error && patterns.length === 0 && (
          <p className="text-body text-chestnut-900">
            No projects yet. Check back soon!
          </p>
        )}

        {!loading && !error && patterns.length > 0 && visiblePatterns.length === 0 && (
          <p className="text-body text-chestnut-900">
            No projects match this skill level yet.
          </p>
        )}

        {!loading && !error && visiblePatterns.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visiblePatterns.map((pattern) => (
              <PatternCard
                key={pattern.id}
                pattern={pattern}
                bookmarked={bookmarkedIds.has(pattern.id)}
                onToggleBookmark={toggle}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
