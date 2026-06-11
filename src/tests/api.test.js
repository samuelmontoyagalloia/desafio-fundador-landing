import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { get } from '@vercel/edge-config'
import subscribersHandler from '../../api/subscribers.js'
import subscribeHandler from '../../api/subscribe.js'

vi.mock('@vercel/edge-config', () => ({ get: vi.fn() }))

function makeRes() {
  const res = {
    statusCode: null,
    data: null,
    headers: {},
    status(code) { this.statusCode = code; return this },
    json(data) { this.data = data; return this },
    setHeader(k, v) { this.headers[k] = v },
  }
  return res
}

beforeEach(() => {
  process.env.EDGE_CONFIG = 'https://edge-config.vercel.com/ecfg_test123'
  process.env.VERCEL_API_TOKEN = 'test_token'
})

afterEach(() => {
  vi.clearAllMocks()
})

// ─── GET /api/subscribers ─────────────────────────────────────────────────

describe('GET /api/subscribers', () => {
  it('returns remaining=6 when waitlist_count=0', async () => {
    get.mockResolvedValueOnce(0)
    const res = makeRes()
    await subscribersHandler({ method: 'GET' }, res)
    expect(res.statusCode).toBe(200)
    expect(res.data.remaining).toBe(6)
    expect(res.data.count).toBe(0)
  })

  it('returns remaining=5 when waitlist_count=1', async () => {
    get.mockResolvedValueOnce(1)
    const res = makeRes()
    await subscribersHandler({ method: 'GET' }, res)
    expect(res.statusCode).toBe(200)
    expect(res.data.remaining).toBe(5)
  })

  it('returns remaining=2 when waitlist_count=4', async () => {
    get.mockResolvedValueOnce(4)
    const res = makeRes()
    await subscribersHandler({ method: 'GET' }, res)
    expect(res.statusCode).toBe(200)
    expect(res.data.remaining).toBe(2)
  })

  it('returns remaining=1 when waitlist_count=5', async () => {
    get.mockResolvedValueOnce(5)
    const res = makeRes()
    await subscribersHandler({ method: 'GET' }, res)
    expect(res.statusCode).toBe(200)
    expect(res.data.remaining).toBe(1)
  })

  it('returns remaining=0 when waitlist_count=6', async () => {
    get.mockResolvedValueOnce(6)
    const res = makeRes()
    await subscribersHandler({ method: 'GET' }, res)
    expect(res.statusCode).toBe(200)
    expect(res.data.remaining).toBe(0)
  })

  it('never returns negative remaining (clamps at 0)', async () => {
    get.mockResolvedValueOnce(99)
    const res = makeRes()
    await subscribersHandler({ method: 'GET' }, res)
    expect(res.statusCode).toBe(200)
    expect(res.data.remaining).toBe(0)
  })

  it('treats null Edge Config value as 0', async () => {
    get.mockResolvedValueOnce(null)
    const res = makeRes()
    await subscribersHandler({ method: 'GET' }, res)
    expect(res.statusCode).toBe(200)
    expect(res.data.remaining).toBe(6)
  })

  it('returns 500 when Edge Config read fails', async () => {
    get.mockRejectedValueOnce(new Error('Edge Config unavailable'))
    const res = makeRes()
    await subscribersHandler({ method: 'GET' }, res)
    expect(res.statusCode).toBe(500)
    expect(res.data.error).toBeTruthy()
  })

  it('returns 405 for non-GET methods', async () => {
    const res = makeRes()
    await subscribersHandler({ method: 'POST' }, res)
    expect(res.statusCode).toBe(405)
  })
})

// ─── POST /api/subscribe ──────────────────────────────────────────────────

describe('POST /api/subscribe', () => {
  let fetchMock

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => '' })
    global.fetch = fetchMock
  })

  it('increments count and returns updated remaining', async () => {
    get.mockResolvedValueOnce(0)
    const res = makeRes()
    await subscribeHandler({ method: 'POST' }, res)
    expect(res.statusCode).toBe(200)
    expect(res.data.ok).toBe(true)
    expect(res.data.remaining).toBe(5) // 6 - 1
  })

  it('returns remaining=0 when incrementing from count=5 to 6', async () => {
    get.mockResolvedValueOnce(5)
    const res = makeRes()
    await subscribeHandler({ method: 'POST' }, res)
    expect(res.statusCode).toBe(200)
    expect(res.data.remaining).toBe(0) // 6 - 6
  })

  it('does NOT call Vercel API when already at cap (count=6)', async () => {
    get.mockResolvedValueOnce(6)
    const res = makeRes()
    await subscribeHandler({ method: 'POST' }, res)
    expect(res.statusCode).toBe(200)
    expect(res.data.remaining).toBe(0)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('does NOT call Vercel API when count already exceeds cap', async () => {
    get.mockResolvedValueOnce(10)
    const res = makeRes()
    await subscribeHandler({ method: 'POST' }, res)
    expect(fetchMock).not.toHaveBeenCalled()
    expect(res.data.remaining).toBe(0)
  })

  it('returns 500 when Vercel PATCH fails', async () => {
    get.mockResolvedValueOnce(2)
    fetchMock.mockResolvedValueOnce({ ok: false, text: async () => 'Unauthorized' })
    const res = makeRes()
    await subscribeHandler({ method: 'POST' }, res)
    expect(res.statusCode).toBe(500)
    expect(res.data.error).toBeTruthy()
  })

  it('returns 500 when Edge Config read fails', async () => {
    get.mockRejectedValueOnce(new Error('Edge Config unavailable'))
    const res = makeRes()
    await subscribeHandler({ method: 'POST' }, res)
    expect(res.statusCode).toBe(500)
  })

  it('returns 405 for non-POST methods', async () => {
    const res = makeRes()
    await subscribeHandler({ method: 'GET' }, res)
    expect(res.statusCode).toBe(405)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
