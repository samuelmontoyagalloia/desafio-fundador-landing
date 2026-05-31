import { get } from '@vercel/edge-config'

function getEdgeConfigId() {
  return new URL(process.env.EDGE_CONFIG).pathname.replace('/', '')
}

async function incrementWaitlistCount() {
  const current = (await get('waitlist_count')) ?? 0
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
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body ?? {}
  if (!email) {
    return res.status(400).json({ error: 'Missing email' })
  }

  try {
    await incrementWaitlistCount()
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[subscribe] Edge Config increment failed:', err.message)
    return res.status(500).json({ error: 'Counter update failed', detail: err.message })
  }
}
