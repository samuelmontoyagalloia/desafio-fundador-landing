import { get } from '@vercel/edge-config'

const KIT_FORM_ID = '9504110'
const KIT_API_URL = `https://api.convertkit.com/v3/forms/${KIT_FORM_ID}/subscribe`

function getEdgeConfigId() {
  // EDGE_CONFIG format: https://edge-config.vercel.com/ecfg_xxx?token=yyy
  return new URL(process.env.EDGE_CONFIG).pathname.replace('/', '')
}

async function subscribeToKit(email) {
  const apiSecret = process.env.CONVERTKIT_API_SECRET
  if (!apiSecret) {
    throw new Error('CONVERTKIT_API_SECRET is not defined')
  }

  const res = await fetch(KIT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ api_secret: apiSecret, email_address: email }),
  })

  const body = await res.json().catch(() => null)
  console.log(`[subscribe] Kit status: ${res.status}`)
  console.log('[subscribe] Kit body:', JSON.stringify(body))

  if (!res.ok || body?.error) {
    throw new Error(
      `Kit error ${res.status}: ${body?.message ?? body?.error ?? 'unknown'}`
    )
  }

  return body
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

  // 1. Subscribe to Kit — must succeed before touching Edge Config
  try {
    await subscribeToKit(email)
  } catch (err) {
    console.error('[subscribe] Kit subscription failed:', err.message)
    return res.status(502).json({ error: 'Kit subscription failed' })
  }

  // 2. Kit confirmed — now increment the counter
  try {
    await incrementWaitlistCount()
  } catch (err) {
    console.error('[subscribe] Edge Config increment error:', err.message)
    // Counter update is best-effort; Kit subscription already succeeded
  }

  return res.status(200).json({ ok: true })
}
