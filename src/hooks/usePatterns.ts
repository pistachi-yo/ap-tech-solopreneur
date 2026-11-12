import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Pattern } from '@/types/database'

interface UsePatternsResult {
  patterns: Pattern[]
  loading: boolean
  error: string | null
  reload: () => void
}

export function usePatterns(): UsePatternsResult {
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let active = true

    async function load() {
      const { data, error: dbError } = await supabase
        .from('patterns')
        .select('*')
        .order('id')
      if (!active) return
      if (dbError) {
        setError('Could not load projects. Please try again.')
      } else {
        setPatterns(data)
      }
      setLoading(false)
    }

    void load()
    return () => {
      active = false
    }
  }, [version])

  function reload() {
    setLoading(true)
    setError(null)
    setVersion((current) => current + 1)
  }

  return { patterns, loading, error, reload }
}
