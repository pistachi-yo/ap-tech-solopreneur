import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabaseClient'

interface UseChecklistProgressResult {
  checkedIds: Set<number>
  toggle: (itemId: number) => Promise<void>
  error: string | null
}

const NO_ITEMS: Set<number> = new Set()

export function useChecklistProgress(
  itemIds: number[],
): UseChecklistProgressResult {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const itemKey = itemIds.join(',')
  const [loadedIds, setLoadedIds] = useState<Set<number>>(NO_ITEMS)
  const [error, setError] = useState<string | null>(null)
  // Item ids with a save in flight: a second tap on the same one is ignored.
  const pending = useRef<Set<number>>(new Set())

  useEffect(() => {
    if (!userId || itemKey === '') return
    let active = true

    async function load() {
      const { data, error: dbError } = await supabase
        .from('checklist_progress')
        .select('item_id, checked')
        .eq('user_id', userId!)
        .in('item_id', itemKey.split(',').map(Number))
      if (!active) return
      if (dbError) {
        setError('Could not load your checklist.')
        return
      }
      setLoadedIds(
        new Set(data.filter((row) => row.checked).map((row) => row.item_id)),
      )
    }

    void load()
    return () => {
      active = false
    }
  }, [userId, itemKey])

  const checkedIds = userId ? loadedIds : NO_ITEMS

  const toggle = useCallback(
    async (itemId: number) => {
      if (!userId || pending.current.has(itemId)) return
      pending.current.add(itemId)
      setError(null)

      const wasChecked = loadedIds.has(itemId)
      const flip = (ids: Set<number>, on: boolean) => {
        const next = new Set(ids)
        if (on) next.add(itemId)
        else next.delete(itemId)
        return next
      }

      // Optimistic update, reverted below if the save fails.
      setLoadedIds((current) => flip(current, !wasChecked))
      try {
        const { error: dbError } = wasChecked
          ? await supabase
              .from('checklist_progress')
              .delete()
              .eq('user_id', userId)
              .eq('item_id', itemId)
          : await supabase.from('checklist_progress').upsert(
              { user_id: userId, item_id: itemId, checked: true },
              { onConflict: 'user_id,item_id' },
            )
        if (dbError) throw dbError
      } catch {
        setLoadedIds((current) => flip(current, wasChecked))
        setError('Could not save your checklist. Please try again.')
      } finally {
        pending.current.delete(itemId)
      }
    },
    [userId, loadedIds],
  )

  return { checkedIds, toggle, error }
}
