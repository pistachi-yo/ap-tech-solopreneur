import { Header } from '@/components/landing/Header'
import { PatternCard } from '@/components/patterns/PatternCard'
import { Button } from '@/components/ui/button'
import { useBookmarks } from '@/hooks/useBookmarks'
import { usePatterns } from '@/hooks/usePatterns'

export default function Patterns() {
  const { patterns, loading, error, reload } = usePatterns()
  const { bookmarkedIds, toggle, error: bookmarkError } = useBookmarks()

  return (
    <div className="min-h-svh bg-chestnut-tertiary">
      <Header />
      <main className="mx-auto max-w-page px-3 py-8 sm:px-6">
        <h1 className="font-heading text-h1 font-normal tracking-[-1.5px] text-chestnut-900">
          Sewing projects
        </h1>
        <p className="mt-4 mb-8 text-body text-chestnut-900">
          Pick a project and follow the steps, one stitch at a time.
        </p>

        {bookmarkError && (
          <p role="alert" className="mb-4 text-body-sm text-chestnut-primary">
            {bookmarkError}
          </p>
        )}

        {loading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2" aria-busy="true">
            {[0, 1].map((key) => (
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

        {!loading && !error && patterns.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {patterns.map((pattern) => (
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
