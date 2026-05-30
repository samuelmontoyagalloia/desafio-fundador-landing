import { kv } from '@vercel/kv'

const TOTAL_FREE_SPOTS = 5
const KIT_FORM_URL = 'https://app.kit.com/forms/9504110/subscriptions'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body ?? {}
  if (!email) {
    return res.status(400).json({ error: 'Missing email' })
  }

  // 1. Submit to Kit
  let kitRes
  try {
    const body = new FormData()
    body.append('email_address', email)
    kitRes = await fetch(KIT_FORM_URL, {
      method: 'POST',
      body,
      headers: { Accept: 'application/json' },
    })
  } catch (err) {
    console.error('[subscribe] Network error calling Kit:', err)
    return res.status(502).json({ error: 'Failed to reach Kit' })
  }

  if (!kitRes.ok) {
    let detail = ''
    try { detail = await kitRes.text() } catch {}
    console.error(`[subscribe] Kit returned ${kitRes.status}:`, detail)
    return res.status(502).json({ error: 'Kit subscription failed', status: kitRes.status })
  }

  // 2. Increment KV counter and return new remaining count
  try {
    const newCount = await kv.incr('waitlist_count')
    console.log('[subscribe] waitlist_count after incr:', newCount)
    const remaining = Math.max(0, TOTAL_FREE_SPOTS - newCount)
    return res.status(200).json({ remaining })
  } catch (err) {
    console.error('[subscribe] KV incr error:', err)
    // Kit subscription succeeded — still report success to the user
    return res.status(200).json({ remaining: null })
  }
}
