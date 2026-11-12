import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabaseClient'

interface UseBookmarksResult {
  bookmarkedIds: Set<number>
  toggle: (patternId: number) => Promise<void>
  error: string | null
}

const NO_BOOKMARKS: Set<number> = new Set()

export function useBookmarks(): UseBookmarksResult {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const [loadedIds, setLoadedIds] = useState<Set<number>>(NO_BOOKMARKS)
  const [error, setError] = useState<string | null>(null)
  // Pattern ids with a save in flight: a second tap on the same one is ignored.
  const pending = useRef<Set<number>>(new Set())

  useEffect(() => {
    if (!userId) return
    let active = true

    async function load() {
      const { data, error: dbError } = await supabase
        .from('bookmarks')
        .select('pattern_id')
        .eq('user_id', userId!)
      if (!active) return
      if (dbError) {
        setError('Could not load your bookmarks.')
        return
      }
      setLoadedIds(new Set(data.map((row) => row.pattern_id)))
    }

    void load()
    return () => {
      active = false
    }
  }, [userId])

  const bookmarkedIds = userId ? loadedIds : NO_BOOKMARKS

  const toggle = useCallback(
    async (patternId: number) => {
      if (!userId || pending.current.has(patternId)) return
      pending.current.add(patternId)
      setError(null)

      const wasBookmarked = loadedIds.has(patternId)
      const flip = (ids: Set<number>, on: boolean) => {
        const next = new Set(ids)
        if (on) next.add(patternId)
        else next.delete(patternId)
        return next
      }

      // Optimistic update, reverted below if the save fails.
      setLoadedIds((current) => flip(current, !wasBookmarked))
      try {
        const { error: dbError } = wasBookmarked
          ? await supabase
              .from('bookmarks')
              .delete()
              .eq('user_id', userId)
              .eq('pattern_id', patternId)
          : await supabase
              .from('bookmarks')
              .insert({ user_id: userId, pattern_id: patternId })
        if (dbError) throw dbError
      } catch {
        setLoadedIds((current) => flip(current, wasBookmarked))
        setError('Could not save your bookmark. Please try again.')
      } finally {
        pending.current.delete(patternId)
      }
    },
    [userId, loadedIds],
  )

  return { bookmarkedIds, toggle, error }
}
