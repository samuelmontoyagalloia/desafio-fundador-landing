import { get } from '@vercel/edge-config'

const KIT_FORM_ID = '9504110'
const KIT_API_URL = `https://api.kit.com/v4/forms/${KIT_FORM_ID}/subscribers`

function getEdgeConfigId() {
  // EDGE_CONFIG format: https://edge-config.vercel.com/ecfg_xxx?token=yyy
  return new URL(process.env.EDGE_CONFIG).pathname.replace('/', '')
}

async function subscribeToKit(email) {
  const apiKey = process.env.CONVERTKIT_API_SECRET
  if (!apiKey) {
    throw Object.assign(new Error('CONVERTKIT_API_SECRET is not set'), { code: 'NO_SECRET' })
  }

  const requestBody = JSON.stringify({ email_address: email })
  console.log('[subscribe] API key prefix:', apiKey.slice(0, 4))
  console.log('[subscribe] URL:', KIT_API_URL)
  console.log('[subscribe] Request body:', requestBody)

  let res
  try {
    res = await fetch(KIT_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-Kit-Api-Version': '2025-01-01',
      },
      body: requestBody,
    })
  } catch (networkErr) {
    throw Object.assign(
      new Error(`Network error reaching Kit: ${networkErr.message}`),
      { code: 'KIT_NETWORK' }
    )
  }

  // Always read the raw body first so we can log it regardless of content-type
  const rawText = await res.text().catch(() => '')
  let kitBody = null
  try { kitBody = JSON.parse(rawText) } catch {}

  console.log(`[subscribe] Kit ${KIT_FORM_ID} → status ${res.status}`)
  console.log('[subscribe] Kit full response body:', rawText)

  if (!res.ok) {
    const message = kitBody?.message ?? kitBody?.error ?? rawText.slice(0, 200) ?? 'no body'
    throw Object.assign(
      new Error(`Kit returned ${res.status}: ${message}`),
      { code: 'KIT_ERROR', kitStatus: res.status, kitMessage: message }
    )
  }

  // Kit can return 200 with an error field
  if (kitBody?.error) {
    throw Object.assign(
      new Error(`Kit error: ${kitBody.message ?? kitBody.error}`),
      { code: 'KIT_ERROR', kitStatus: res.status, kitMessage: kitBody.message ?? kitBody.error }
    )
  }

  return kitBody
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
  // Top-level safety net — ensures we never return a bare Vercel 503
  try {
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
      console.error('[subscribe] Kit failed:', err.message)
      return res.status(502).json({
        error: 'Kit subscription failed',
        detail: err.kitMessage ?? err.message,
        kitStatus: err.kitStatus ?? null,
        code: err.code ?? 'UNKNOWN',
      })
    }

    // 2. Kit confirmed — now increment the counter
    try {
      await incrementWaitlistCount()
    } catch (err) {
      // Counter is best-effort; Kit already confirmed the subscription
      console.error('[subscribe] Edge Config increment failed:', err.message)
    }

    return res.status(200).json({ ok: true })
  } catch (unexpected) {
    console.error('[subscribe] Unexpected error:', unexpected)
    return res.status(500).json({
      error: 'Internal server error',
      detail: unexpected?.message ?? 'unknown',
    })
  }
}
