const TOTAL_FREE_SPOTS = 5

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secret = process.env.CONVERTKIT_API_SECRET
  if (!secret) {
    return res.status(500).json({ error: 'API secret not configured' })
  }

  try {
    const response = await fetch(
      `https://api.convertkit.com/v3/subscribers?api_secret=${secret}`
    )

    if (!response.ok) {
      return res.status(502).json({ error: 'Failed to fetch subscribers' })
    }

    const data = await response.json()
    const count = data.total_subscribers ?? 0
    const remaining = Math.max(0, TOTAL_FREE_SPOTS - count)

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate')
    return res.status(200).json({ count, remaining })
  } catch {
    return res.status(502).json({ error: 'Failed to fetch subscribers' })
  }
}
