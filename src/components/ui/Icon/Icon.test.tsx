import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Icon } from './Icon'

describe('Icon', () => {
  it('renders a valid icon by name', () => {
    const { container } = render(<Icon name="ArrowRight" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders with default weight regular', () => {
    const { container } = render(<Icon name="House" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders with bold weight', () => {
    const { container } = render(<Icon name="House" weight="bold" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders with fill weight', () => {
    const { container } = render(<Icon name="Star" weight="fill" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders with custom size', () => {
    const { container } = render(<Icon name="Check" size={32} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('height', '32')
  })

  it('applies aria-label when provided', () => {
    render(<Icon name="Check" aria-label="Checkmark" />)
    expect(screen.getByLabelText('Checkmark')).toBeInTheDocument()
  })

  it('is aria-hidden by default when no label provided', () => {
    const { container } = render(<Icon name="Check" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('accepts className', () => {
    const { container } = render(<Icon name="Check" className="text-electric" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('text-electric')
  })

  it('renders nothing for invalid icon name', () => {
    const { container } = render(<Icon name={'NonExistentIcon9999' as never} />)
    expect(container.firstChild).toBeNull()
  })
})
