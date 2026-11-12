import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabaseClient'

interface UseStepProgressResult {
  completedIds: Set<number>
  toggle: (stepId: number) => Promise<void>
  error: string | null
}

const NO_STEPS: Set<number> = new Set()

export function useStepProgress(stepIds: number[]): UseStepProgressResult {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const stepKey = stepIds.join(',')
  const [loadedIds, setLoadedIds] = useState<Set<number>>(NO_STEPS)
  const [error, setError] = useState<string | null>(null)
  // Step ids with a save in flight: a second tap on the same one is ignored.
  const pending = useRef<Set<number>>(new Set())

  useEffect(() => {
    if (!userId || stepKey === '') return
    let active = true

    async function load() {
      const { data, error: dbError } = await supabase
        .from('instruction_progress')
        .select('instruction_id, completed')
        .eq('user_id', userId!)
        .in('instruction_id', stepKey.split(',').map(Number))
      if (!active) return
      if (dbError) {
        setError('Could not load your progress.')
        return
      }
      setLoadedIds(
        new Set(
          data.filter((row) => row.completed).map((row) => row.instruction_id),
        ),
      )
    }

    void load()
    return () => {
      active = false
    }
  }, [userId, stepKey])

  const completedIds = userId ? loadedIds : NO_STEPS

  const toggle = useCallback(
    async (stepId: number) => {
      if (!userId || pending.current.has(stepId)) return
      pending.current.add(stepId)
      setError(null)

      const wasCompleted = loadedIds.has(stepId)
      const flip = (ids: Set<number>, on: boolean) => {
        const next = new Set(ids)
        if (on) next.add(stepId)
        else next.delete(stepId)
        return next
      }

      // Optimistic update, reverted below if the save fails.
      setLoadedIds((current) => flip(current, !wasCompleted))
      try {
        const { error: dbError } = wasCompleted
          ? await supabase
              .from('instruction_progress')
              .delete()
              .eq('user_id', userId)
              .eq('instruction_id', stepId)
          : await supabase.from('instruction_progress').upsert(
              {
                user_id: userId,
                instruction_id: stepId,
                completed: true,
                completed_at: new Date().toISOString(),
              },
              { onConflict: 'user_id,instruction_id' },
            )
        if (dbError) throw dbError
      } catch {
        setLoadedIds((current) => flip(current, wasCompleted))
        setError('Could not save your progress. Please try again.')
      } finally {
        pending.current.delete(stepId)
      }
    },
    [userId, loadedIds],
  )

  return { completedIds, toggle, error }
}
