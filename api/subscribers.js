import { kv } from '@vercel/kv'

const TOTAL_FREE_SPOTS = 5

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const count = (await kv.get('waitlist_count')) ?? 0
    console.log('[subscribers] waitlist_count:', count)
    const remaining = Math.max(0, TOTAL_FREE_SPOTS - count)
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
    return res.status(200).json({ count, remaining })
  } catch (err) {
    console.error('[subscribers] KV read error:', err)
    return res.status(500).json({ error: 'Failed to read subscriber count' })
  }
}
