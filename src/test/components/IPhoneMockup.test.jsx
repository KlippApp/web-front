import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import IPhoneMockup from '../../components/IPhoneMockup'

describe('IPhoneMockup', () => {
  it('renders its content inside the screen with the status bar and island', () => {
    const { container } = render(<IPhoneMockup><p>Screen content</p></IPhoneMockup>)
    expect(container.querySelector('.iphone-screen')).toContainElement(screen.getByText('Screen content'))
    expect(screen.getByText('9:41')).toBeInTheDocument()
    expect(container.querySelector('.iphone-island')).toBeInTheDocument()
    expect(container.querySelectorAll('.iphone-button')).toHaveLength(4)
  })

  it('sizes every part from the screen width', () => {
    const { container } = render(<IPhoneMockup width="200px" />)
    expect(container.querySelector('.iphone').style.getPropertyValue('--w')).toBe('200px')
  })
})
