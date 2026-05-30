import { get } from '@vercel/edge-config'

const KIT_FORM_URL = 'https://app.kit.com/forms/9504110/subscriptions'

function getEdgeConfigId() {
  // EDGE_CONFIG format: https://edge-config.vercel.com/ecfg_xxx?token=yyy
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
    const detail = await kitRes.text().catch(() => '')
    console.error(`[subscribe] Kit returned ${kitRes.status}:`, detail)
    return res.status(502).json({ error: 'Kit subscription failed', status: kitRes.status })
  }

  // 2. Increment Edge Config counter
  try {
    await incrementWaitlistCount()
  } catch (err) {
    console.error('[subscribe] Edge Config increment error:', err)
    // Kit succeeded — still report success; counter update is best-effort
  }

  return res.status(200).json({ ok: true })
}
