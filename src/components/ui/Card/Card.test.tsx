import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card } from './Card'

describe('Card', () => {
  it('renders with default props', () => {
    render(<Card>Content</Card>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders base variant with cream background', () => {
    const { container } = render(<Card variant="base">Base</Card>)
    expect(container.firstChild).toHaveClass('bg-cream')
  })

  it('renders featured variant with ink background', () => {
    const { container } = render(<Card variant="featured">Featured</Card>)
    expect(container.firstChild).toHaveClass('bg-ink')
  })

  it('renders accent variant with accent border class', () => {
    const { container } = render(<Card variant="accent" accentColor="blue">Accent</Card>)
    expect(container.firstChild).toHaveClass('border-l-electric')
  })

  it('renders amber accent color', () => {
    const { container } = render(<Card variant="accent" accentColor="amber">Amber</Card>)
    expect(container.firstChild).toHaveClass('border-l-[#C8860A]')
  })

  it('renders ink accent color', () => {
    const { container } = render(<Card variant="accent" accentColor="ink">Ink</Card>)
    expect(container.firstChild).toHaveClass('border-l-ink')
  })

  it('renders as article by default', () => {
    const { container } = render(<Card>Article</Card>)
    expect(container.firstChild?.nodeName).toBe('ARTICLE')
  })

  it('renders as custom element via as prop', () => {
    const { container } = render(<Card as="div">Div</Card>)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('renders all sub-components', () => {
    render(
      <Card>
        <Card.Media data-testid="media" />
        <Card.Body>
          <Card.Category>Category</Card.Category>
          <Card.Title>Title</Card.Title>
          <Card.Text>Body text</Card.Text>
          <Card.Footer>
            <Card.Metadata>4 min</Card.Metadata>
            <Card.Action href="#">Read</Card.Action>
          </Card.Footer>
        </Card.Body>
      </Card>
    )
    expect(screen.getByText('Category')).toBeInTheDocument()
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Body text')).toBeInTheDocument()
    expect(screen.getByText('4 min')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Read' })).toBeInTheDocument()
  })

  it('accepts className for extension', () => {
    const { container } = render(<Card className="custom-class">Content</Card>)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
