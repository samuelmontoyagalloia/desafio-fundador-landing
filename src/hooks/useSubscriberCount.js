import { useState, useEffect, useCallback } from 'react'

const TOTAL_SPOTS = 6

export function useSubscriberCount() {
  const [remaining, setRemaining] = useState(4)

  const refresh = useCallback((knownRemaining) => {
    if (typeof knownRemaining === 'number') {
      setRemaining(knownRemaining)
      return
    }
    fetch('/api/subscribers')
      .then(res => res.json())
      .then(data => {
        if (typeof data.count === 'number') {
          setRemaining(Math.max(0, TOTAL_SPOTS - data.count))
        } else if (typeof data.remaining === 'number') {
          setRemaining(data.remaining)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => { refresh() }, [refresh])

  return [remaining, refresh]
}
