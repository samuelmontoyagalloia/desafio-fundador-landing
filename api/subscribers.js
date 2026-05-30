const TOTAL_FREE_SPOTS = 5

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secret = process.env.CONVERTKIT_API_SECRET
  if (!secret) {
    console.error('[subscribers] CONVERTKIT_API_SECRET is not defined')
    return res.status(400).json({ error: 'Missing API secret' })
  }

  let response
  try {
    response = await fetch(
      `https://api.convertkit.com/v3/subscribers?api_secret=${secret}`
    )
  } catch (err) {
    console.error('[subscribers] Network error calling ConvertKit:', err)
    return res.status(502).json({ error: 'Network error reaching ConvertKit' })
  }

  if (!response.ok) {
    let body = ''
    try { body = await response.text() } catch {}
    console.error(
      `[subscribers] ConvertKit returned ${response.status}:`,
      body
    )
    return res.status(502).json({
      error: 'ConvertKit API error',
      status: response.status,
      detail: body,
    })
  }

  let data
  try {
    data = await response.json()
  } catch (err) {
    console.error('[subscribers] Failed to parse ConvertKit response:', err)
    return res.status(502).json({ error: 'Invalid response from ConvertKit' })
  }

  console.log('[subscribers] total_subscribers:', data.total_subscribers)

  const count = data.total_subscribers ?? 0
  const remaining = Math.max(0, TOTAL_FREE_SPOTS - count)

  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate')
  return res.status(200).json({ count, remaining })
}
