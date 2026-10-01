import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Logo from '../../components/Logo.jsx'

describe('Logo', () => {
  it('renders the mark with the accent dot', () => {
    const { container } = render(<Logo />)
    expect(container.querySelector('path').getAttribute('fill')).toBe('currentColor')
    expect(container.querySelector('circle').getAttribute('fill')).toBe('var(--color-accent)')
  })

  it('scales height to size and keeps the aspect ratio', () => {
    const { container } = render(<Logo size={95} />)
    const svg = container.querySelector('svg')
    expect(svg.getAttribute('height')).toBe('95')
    expect(svg.getAttribute('width')).toBe('92')
  })
})
