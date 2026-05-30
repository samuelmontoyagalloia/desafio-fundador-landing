export default async function handler(req, res) {
  const apiKey = process.env.CONVERTKIT_API_SECRET

  if (!apiKey) {
    return res.status(500).json({ error: 'CONVERTKIT_API_SECRET is not set' })
  }

  console.log('[test-kit] API key prefix:', apiKey.slice(0, 4))

  let kitRes
  try {
    kitRes = await fetch('https://api.kit.com/v4/account', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'X-Kit-Api-Version': '2025-01-01',
      },
    })
  } catch (err) {
    return res.status(502).json({ error: 'Network error', detail: err.message })
  }

  const rawText = await kitRes.text().catch(() => '')
  let body = null
  try { body = JSON.parse(rawText) } catch {}

  return res.status(200).json({
    kitStatus: kitRes.status,
    kitOk: kitRes.ok,
    apiKeyPrefix: apiKey.slice(0, 4),
    body: body ?? rawText,
  })
}
