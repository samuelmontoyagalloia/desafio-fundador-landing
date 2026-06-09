import { get } from '@vercel/edge-config'

const TOTAL_FREE_SPOTS = 6

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const count = (await get('waitlist_count')) ?? 0
    console.log('[subscribers] waitlist_count:', count)
    const remaining = Math.max(0, TOTAL_FREE_SPOTS - count)
    res.setHeader('Cache-Control', 'no-store')
    return res.status(200).json({ count, remaining })
  } catch (err) {
    console.error('[subscribers] Edge Config read error:', err)
    return res.status(500).json({ error: 'Failed to read subscriber count' })
  }
}
