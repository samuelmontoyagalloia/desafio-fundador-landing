import { render, screen, waitFor, act, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import WaitlistForm from '../components/WaitlistForm'

const LS_KEY = 'wl_submitted'

// Injects the form structure Kit would normally inject via its script.
async function injectKitForm(kitContainer) {
  await act(async () => {
    const form = document.createElement('form')
    form.className = 'formkit-form'
    form.setAttribute('data-uid', '2ee48b4cf7')
    form.innerHTML = `
      <ul class="formkit-alert formkit-alert-error" style="display:none"></ul>
      <div class="seva-fields formkit-fields">
        <div class="formkit-field">
          <input
            class="formkit-input"
            name="email_address"
            aria-label="Correo electrónico"
            placeholder="Correo electrónico"
            type="text"
          />
        </div>
      </div>
      <button data-element="submit" class="formkit-submit formkit-submit" type="submit">
        <div class="formkit-spinner"></div>
        <span>Subscribe</span>
      </button>
    `
    kitContainer.appendChild(form)
  })
}

function makeSuccessFetchMock({ remaining = 4 } = {}) {
  return vi.fn().mockImplementation(async (url) => {
    const u = typeof url === 'string' ? url : url?.url ?? ''
    if (u.includes('kit.com') && u.includes('subscriptions')) {
      return { clone: () => ({ json: () => Promise.resolve({ status: 'success' }) }) }
    }
    if (u === '/api/subscribe') {
      return { ok: true, json: () => Promise.resolve({ ok: true, remaining }) }
    }
    return { ok: false, json: () => Promise.resolve({}) }
  })
}

// ─── StrictMode double-mount guard ────────────────────────────────────────
//
// React 18 StrictMode runs every useEffect twice (mount → cleanup → remount)
// while keeping the DOM alive between the cleanup and the remount.
// Without a proper cleanup the Kit script stays in the container, Kit's script
// runs a second time, and a duplicate raw form ("SUBSCRIBE") appears below the
// styled one ("QUIERO MI LUGAR →").
//
// The fix calls script.remove() in the cleanup.  The test below verifies that
// the script element is gone from the container after cleanup fires, which is
// the invariant that prevents Kit from injecting a second form on remount.

describe('WaitlistForm — StrictMode double-mount guard', () => {
  afterEach(() => {
    localStorage.removeItem(LS_KEY)
    vi.restoreAllMocks()
  })

  it('removes the Kit script element on cleanup so StrictMode remount cannot inject a second form', () => {
    global.fetch = vi.fn().mockResolvedValue({
      clone: () => ({ json: () => Promise.resolve({}) }),
      ok: true,
      json: () => Promise.resolve({}),
    })

    const { unmount } = render(<WaitlistForm onSubscribed={vi.fn()} />)
    const container = screen.getByTestId('kit-container')

    // useEffect appends the Kit <script data-uid="…"> to the container.
    // Querying the container (not the document) works even after detach.
    expect(container.querySelector('script[data-uid="2ee48b4cf7"]')).toBeTruthy()

    unmount() // triggers the useEffect cleanup → script.remove() must fire

    // The script must be gone so Kit cannot re-run on the second mount
    expect(container.querySelector('script[data-uid="2ee48b4cf7"]')).toBeNull()
  })
})

// ─── localStorage dedup ────────────────────────────────────────────────────

describe('WaitlistForm — localStorage dedup', () => {
  afterEach(() => {
    localStorage.removeItem(LS_KEY)
    vi.restoreAllMocks()
  })

  it('shows success message immediately if browser already submitted', () => {
    localStorage.setItem(LS_KEY, '1')
    render(<WaitlistForm onSubscribed={vi.fn()} />)
    expect(
      screen.getByText('¡Tu lugar está reservado! Te avisamos cuando abramos.'),
    ).toBeInTheDocument()
  })

  it('does not render the Kit container when already submitted', () => {
    localStorage.setItem(LS_KEY, '1')
    render(<WaitlistForm onSubscribed={vi.fn()} />)
    expect(screen.queryByTestId('kit-container')).not.toBeInTheDocument()
  })

  it('renders the Kit container when not yet submitted', () => {
    global.fetch = vi.fn().mockResolvedValue({ clone: () => ({ json: () => Promise.resolve({}) }), ok: true, json: () => Promise.resolve({}) })
    render(<WaitlistForm onSubscribed={vi.fn()} />)
    expect(screen.getByTestId('kit-container')).toBeInTheDocument()
  })
})

// ─── Form validation ───────────────────────────────────────────────────────

describe('WaitlistForm — form validation', () => {
  beforeEach(() => {
    localStorage.removeItem(LS_KEY)
    global.fetch = vi.fn().mockResolvedValue({
      clone: () => ({ json: () => Promise.resolve({}) }),
      ok: true,
      json: () => Promise.resolve({}),
    })
  })

  afterEach(() => {
    localStorage.removeItem(LS_KEY)
    vi.restoreAllMocks()
  })

  it('shows "Por favor ingresa tu email" when user submits empty email', async () => {
    render(<WaitlistForm onSubscribed={vi.fn()} />)
    const kitContainer = screen.getByTestId('kit-container')
    await injectKitForm(kitContainer)

    fireEvent.submit(kitContainer.querySelector('form'))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Por favor ingresa tu email')
    })
  })

  it('shows "Por favor ingresa un email válido" for invalid email format', async () => {
    render(<WaitlistForm onSubscribed={vi.fn()} />)
    const kitContainer = screen.getByTestId('kit-container')
    await injectKitForm(kitContainer)

    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), {
      target: { value: 'not-an-email' },
    })
    fireEvent.submit(kitContainer.querySelector('form'))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Por favor ingresa un email válido')
    })
  })

  it('shows error for email missing domain (e.g. "user@")', async () => {
    render(<WaitlistForm onSubscribed={vi.fn()} />)
    const kitContainer = screen.getByTestId('kit-container')
    await injectKitForm(kitContainer)

    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), {
      target: { value: 'user@' },
    })
    fireEvent.submit(kitContainer.querySelector('form'))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Por favor ingresa un email válido')
    })
  })

  it('does not show error and does not prevent submit for valid email', async () => {
    render(<WaitlistForm onSubscribed={vi.fn()} />)
    const kitContainer = screen.getByTestId('kit-container')
    await injectKitForm(kitContainer)

    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), {
      target: { value: 'valid@example.com' },
    })

    const preventDefaultSpy = vi.spyOn(Event.prototype, 'preventDefault')
    fireEvent.submit(kitContainer.querySelector('form'))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(preventDefaultSpy).not.toHaveBeenCalled()
  })

  it('clears validation error when user edits the email field', async () => {
    render(<WaitlistForm onSubscribed={vi.fn()} />)
    const kitContainer = screen.getByTestId('kit-container')
    await injectKitForm(kitContainer)

    fireEvent.submit(kitContainer.querySelector('form'))
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())

    fireEvent.input(screen.getByPlaceholderText('Correo electrónico'), {
      target: { value: 'a' },
    })

    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
  })
})

// ─── Form submission — success ─────────────────────────────────────────────

describe('WaitlistForm — form submission success', () => {
  beforeEach(() => {
    localStorage.removeItem(LS_KEY)
  })

  afterEach(() => {
    localStorage.removeItem(LS_KEY)
    vi.restoreAllMocks()
  })

  it('shows success message when Kit reports status=success', async () => {
    global.fetch = makeSuccessFetchMock()
    render(<WaitlistForm onSubscribed={vi.fn()} />)

    await act(async () => {
      await window.fetch('https://app.kit.com/v3/subscriptions', { method: 'POST' })
      await Promise.resolve()
    })

    await waitFor(() => {
      expect(
        screen.getByText('¡Tu lugar está reservado! Te avisamos cuando abramos.'),
      ).toBeInTheDocument()
    })
  })

  it('calls onSubscribed with the updated remaining count', async () => {
    const mockOnSubscribed = vi.fn()
    global.fetch = makeSuccessFetchMock({ remaining: 3 })
    render(<WaitlistForm onSubscribed={mockOnSubscribed} />)

    await act(async () => {
      await window.fetch('https://app.kit.com/v3/subscriptions', { method: 'POST' })
      await Promise.resolve()
    })

    await waitFor(() => expect(mockOnSubscribed).toHaveBeenCalledWith(3))
  })

  it('writes localStorage flag so the same browser cannot double-submit', async () => {
    global.fetch = makeSuccessFetchMock()
    render(<WaitlistForm onSubscribed={vi.fn()} />)

    await act(async () => {
      await window.fetch('https://app.kit.com/v3/subscriptions', { method: 'POST' })
      await Promise.resolve()
    })

    await waitFor(() => expect(localStorage.getItem(LS_KEY)).toBe('1'))
  })

  it('calls /api/subscribe exactly once even if Kit fires success twice', async () => {
    const fetchMock = makeSuccessFetchMock()
    global.fetch = fetchMock
    render(<WaitlistForm onSubscribed={vi.fn()} />)

    await act(async () => {
      await window.fetch('https://app.kit.com/v3/subscriptions', { method: 'POST' })
      await window.fetch('https://app.kit.com/v3/subscriptions', { method: 'POST' })
      await Promise.resolve()
    })

    const subscribeCalls = fetchMock.mock.calls.filter(([u]) => u === '/api/subscribe')
    expect(subscribeCalls).toHaveLength(1)
  })

  it('does not increment counter (no /api/subscribe) if Kit does not confirm success', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      clone: () => ({ json: () => Promise.resolve({ status: 'error' }) }),
    })
    global.fetch = fetchMock
    render(<WaitlistForm onSubscribed={vi.fn()} />)

    await act(async () => {
      await window.fetch('https://app.kit.com/v3/subscriptions', { method: 'POST' })
      await Promise.resolve()
    })

    const subscribeCalls = fetchMock.mock.calls.filter(([u]) => u === '/api/subscribe')
    expect(subscribeCalls).toHaveLength(0)
    expect(screen.queryByText(/reservado/)).not.toBeInTheDocument()
  })
})
