import { ArrowLeft } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router'
import { Header } from '@/components/landing/Header'
import { MarkdownBody } from '@/components/resources/MarkdownBody'
import { Button } from '@/components/ui/button'
import { useResource } from '@/hooks/useResource'

// Only same-site paths are accepted as a "back" target.
function backTarget(state: unknown): string {
  const from =
    state && typeof state === 'object' && 'from' in state
      ? (state as { from: unknown }).from
      : null
  return typeof from === 'string' && from.startsWith('/') && !from.startsWith('//')
    ? from
    : '/projects'
}

export default function Resource() {
  const { slug } = useParams()
  const location = useLocation()
  const { resource, loading, error, notFound, reload } = useResource(slug)
  const back = backTarget(location.state)

  return (
    <div className="min-h-svh bg-chestnut-tertiary">
      <Header />
      <main className="mx-auto max-w-3xl px-3 py-8 sm:px-6">
        <Link
          to={back}
          className="mb-6 inline-flex items-center gap-2 text-body-sm font-medium text-chestnut-900 hover:underline"
        >
          <ArrowLeft className="size-4" />
          {back === '/projects' ? 'All projects' : 'Back to the project'}
        </Link>

        {loading && (
          <div className="flex flex-col gap-4" aria-busy="true">
            <div className="h-12 w-2/3 animate-pulse rounded-lg bg-brand-border/30" />
            <div className="h-64 animate-pulse rounded-lg bg-brand-border/30" />
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

        {!loading && !error && notFound && (
          <div className="flex flex-col items-start gap-4">
            <h1 className="font-heading text-h1 font-normal tracking-[-1.5px] text-chestnut-900">
              We couldn’t find that page
            </h1>
            <p className="text-body text-chestnut-900">
              It may have been moved or the link may be wrong.
            </p>
            <Button asChild>
              <Link to="/projects">Browse projects</Link>
            </Button>
          </div>
        )}

        {!loading && !error && resource && (
          <article>
            <h1 className="font-heading text-h1 font-normal tracking-[-1.5px] text-chestnut-900">
              {resource.title}
            </h1>
            {resource.summary && (
              <p className="mt-3 text-body text-mushroom-primary">
                {resource.summary}
              </p>
            )}
            <div className="mt-6">
              <MarkdownBody markdown={resource.body_md} />
            </div>
          </article>
        )}
      </main>
    </div>
  )
}
