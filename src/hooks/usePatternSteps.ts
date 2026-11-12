import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Pattern, PatternStep } from '@/types/database'

interface UsePatternStepsResult {
  pattern: Pattern | null
  steps: PatternStep[]
  loading: boolean
  error: string | null
  notFound: boolean
  reload: () => void
}

interface Loaded {
  id: number
  pattern: Pattern | null
  steps: PatternStep[]
}

export function usePatternSteps(patternId: number | null): UsePatternStepsResult {
  // Results are stored with the id they belong to, so navigating between
  // patterns never shows the previous pattern's data.
  const [loaded, setLoaded] = useState<Loaded | null>(null)
  const [failedId, setFailedId] = useState<number | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    if (patternId === null) return
    let active = true

    async function load(id: number) {
      const [patternResult, stepsResult] = await Promise.all([
        supabase.from('patterns').select('*').eq('id', id).maybeSingle(),
        supabase
          .from('pattern_instructions')
          .select('*')
          .eq('pattern_id', id)
          .order('step_number'),
      ])
      if (!active) return
      if (patternResult.error || stepsResult.error) {
        setFailedId(id)
        return
      }
      setLoaded({
        id,
        pattern: patternResult.data,
        steps: stepsResult.data,
      })
    }

    void load(patternId)
    return () => {
      active = false
    }
  }, [patternId, version])

  function reload() {
    setFailedId(null)
    setVersion((current) => current + 1)
  }

  if (patternId === null) {
    return {
      pattern: null,
      steps: [],
      loading: false,
      error: null,
      notFound: true,
      reload,
    }
  }

  const current = loaded?.id === patternId ? loaded : null
  const error =
    failedId === patternId && !current
      ? 'Could not load this project. Please try again.'
      : null

  return {
    pattern: current?.pattern ?? null,
    steps: current?.steps ?? [],
    loading: !current && !error,
    error,
    notFound: current !== null && current.pattern === null,
    reload,
  }
}
