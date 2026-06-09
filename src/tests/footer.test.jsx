import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Footer from '../sections/Footer'

describe('Footer', () => {
  it('renders the brand name', () => {
    render(<Footer />)
    expect(screen.getByText('Encuentra tu negocio — Samuel Montoya')).toBeInTheDocument()
  })

  it('renders the copyright notice', () => {
    render(<Footer />)
    expect(screen.getByText(/© 2026 Samuel Montoya/)).toBeInTheDocument()
  })

  it('renders all three social media links', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: 'TikTok' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Instagram' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'YouTube' })).toBeInTheDocument()
  })

  it('TikTok link points to the correct URL', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: 'TikTok' })
    expect(link).toHaveAttribute(
      'href',
      'https://www.tiktok.com/@smontoya.g?_r=1&_t=ZS-96sLCTr8R2z',
    )
  })

  it('Instagram link points to the correct URL', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: 'Instagram' })
    expect(link).toHaveAttribute(
      'href',
      'https://www.instagram.com/smontoyag?igsh=NTJkamw3bDM3ZGU3&utm_source=qr',
    )
  })

  it('YouTube link points to the correct URL', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: 'YouTube' })
    expect(link).toHaveAttribute('href', 'https://www.youtube.com/@SamuelMontoyaIA')
  })

  it('TikTok link opens in a new tab', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: 'TikTok' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('Instagram link opens in a new tab', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: 'Instagram' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('YouTube link opens in a new tab', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: 'YouTube' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
