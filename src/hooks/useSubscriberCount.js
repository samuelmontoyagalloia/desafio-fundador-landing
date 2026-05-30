import { useState, useEffect, useCallback } from 'react'

const TOTAL_FREE_SPOTS = 5

export function useSubscriberCount() {
  const [remaining, setRemaining] = useState(TOTAL_FREE_SPOTS)

  const refresh = useCallback(() => {
    fetch('/api/subscribers')
      .then(res => res.json())
      .then(data => {
        if (typeof data.remaining === 'number') {
          setRemaining(data.remaining)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => { refresh() }, [refresh])

  return [remaining, refresh]
}
