import { get } from '@vercel/edge-config'

const TOTAL_FREE_SPOTS = 6

function getEdgeConfigId() {
  return new URL(process.env.EDGE_CONFIG).pathname.replace('/', '')
}

async function incrementWaitlistCount() {
  const current = Number((await get('waitlist_count')) ?? 0)

  if (current >= TOTAL_FREE_SPOTS) {
    console.log('[subscribe] already at cap, skipping increment')
    return current
  }

  const next = current + 1

  const edgeConfigId = getEdgeConfigId()
  const res = await fetch(
    `https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ operation: 'upsert', key: 'waitlist_count', value: next }],
      }),
    }
  )

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Edge Config PATCH ${res.status}: ${detail}`)
  }

  console.log('[subscribe] waitlist_count after increment:', next)
  return next
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const next = await incrementWaitlistCount()
    const remaining = Math.max(0, TOTAL_FREE_SPOTS - next)
    return res.status(200).json({ ok: true, remaining })
  } catch (err) {
    console.error('[subscribe] Edge Config increment failed:', err.message)
    return res.status(500).json({ error: 'Counter update failed', detail: err.message })
  }
}
