import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Resource } from '@/types/database'

interface UseResourceResult {
  resource: Resource | null
  loading: boolean
  error: string | null
  notFound: boolean
  reload: () => void
}

interface Loaded {
  slug: string
  resource: Resource | null
}

export function useResource(slug: string | undefined): UseResourceResult {
  // Results are stored with the slug they belong to, so navigating between
  // resources never shows the previous page's content.
  const [loaded, setLoaded] = useState<Loaded | null>(null)
  const [failedSlug, setFailedSlug] = useState<string | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    if (!slug) return
    let active = true

    async function load(current: string) {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('slug', current)
        .maybeSingle()
      if (!active) return
      if (error) {
        setFailedSlug(current)
        return
      }
      setLoaded({ slug: current, resource: data })
    }

    void load(slug)
    return () => {
      active = false
    }
  }, [slug, version])

  function reload() {
    setFailedSlug(null)
    setVersion((current) => current + 1)
  }

  if (!slug) {
    return { resource: null, loading: false, error: null, notFound: true, reload }
  }

  const current = loaded?.slug === slug ? loaded : null
  const error =
    failedSlug === slug && !current
      ? 'Could not load this page. Please try again.'
      : null

  return {
    resource: current?.resource ?? null,
    loading: !current && !error,
    error,
    notFound: current !== null && current.resource === null,
    reload,
  }
}
