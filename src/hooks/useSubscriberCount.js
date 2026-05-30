import { useState, useEffect } from 'react'

export function useSubscriberCount() {
  const [remaining, setRemaining] = useState(null)

  useEffect(() => {
    fetch('/api/subscribers')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setRemaining(data.remaining))
      .catch(() => {})
  }, [])

  return remaining
}
