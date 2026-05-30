import { useState, useEffect } from 'react'

const TOTAL_FREE_SPOTS = 5

export function useSubscriberCount() {
  const [remaining, setRemaining] = useState(TOTAL_FREE_SPOTS)

  useEffect(() => {
    fetch('/api/subscribers')
      .then(res => res.json())
      .then(data => {
        if (typeof data.remaining === 'number') {
          setRemaining(data.remaining)
        }
      })
      .catch(() => {})
  }, [])

  return remaining
}
