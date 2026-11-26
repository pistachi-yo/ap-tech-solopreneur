import { useCallback, useState } from 'react'

const STORAGE_KEY = 'unpicked:experienced-mode'

function readStored(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

// Remembered per browser; storage may be unavailable, so every access is guarded.
export function useExperiencedMode(): [boolean, (value: boolean) => void] {
  const [experienced, setExperienced] = useState<boolean>(readStored)

  const update = useCallback((value: boolean) => {
    setExperienced(value)
    try {
      window.localStorage.setItem(STORAGE_KEY, String(value))
    } catch {
      // Not remembered, but the page still works for this visit.
    }
  }, [])

  return [experienced, update]
}
