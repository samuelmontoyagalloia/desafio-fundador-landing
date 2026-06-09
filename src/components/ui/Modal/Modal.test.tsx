import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from './Modal'

function TestModal(props: Partial<Parameters<typeof Modal>[0]>) {
  return (
    <Modal
      isOpen={true}
      onClose={vi.fn()}
      title="Test Modal"
      {...props}
    />
  )
}

describe('Modal', () => {
  it('does not render when isOpen is false', () => {
    render(<Modal isOpen={false} onClose={vi.fn()} title="Hidden" />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders when isOpen is true', () => {
    render(<TestModal />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('has correct ARIA attributes', () => {
    render(<TestModal title="My Dialog" description="Some description" />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title')
  })

  it('renders title', () => {
    render(<TestModal title="Delete Account" />)
    expect(screen.getByText('Delete Account')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<TestModal description="This cannot be undone." />)
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn()
    render(<TestModal onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: /close dialog/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn()
    const { container } = render(<TestModal onClose={onClose} />)
    const presentation = container.querySelector('[role="presentation"]')!
    await userEvent.click(presentation)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when Escape key is pressed', async () => {
    const onClose = vi.fn()
    render(<TestModal onClose={onClose} />)
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('renders primaryAction button', () => {
    render(<TestModal primaryAction={{ label: 'Confirm', onClick: vi.fn() }} />)
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
  })

  it('renders secondaryAction button', () => {
    render(<TestModal secondaryAction={{ label: 'Cancel', onClick: vi.fn() }} />)
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('fires primaryAction onClick', async () => {
    const onClick = vi.fn()
    render(<TestModal primaryAction={{ label: 'OK', onClick }} />)
    await userEvent.click(screen.getByRole('button', { name: 'OK' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('renders destructive variant with danger button', () => {
    render(<TestModal variant="destructive" primaryAction={{ label: 'Delete', onClick: vi.fn() }} />)
    const btn = screen.getByRole('button', { name: 'Delete' })
    expect(btn).toHaveClass('bg-ink')
  })

  it('renders children inside body', () => {
    render(<TestModal><p>Form content</p></TestModal>)
    expect(screen.getByText('Form content')).toBeInTheDocument()
  })
})
