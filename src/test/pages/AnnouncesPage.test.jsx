import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AnnouncesPage from '../../pages/AnnouncesPage'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}))

function addAnnounce() {
  fireEvent.click(screen.getByRole('button', { name: /portal.announces.add/i }))
  fireEvent.change(screen.getByLabelText('portal.announces.form.title'), { target: { value: 'Appartement Paris' } })
  fireEvent.change(screen.getByLabelText('portal.announces.form.price'), { target: { value: '350000' } })
  fireEvent.change(screen.getByLabelText('portal.announces.form.address'), { target: { value: '12 rue de Rivoli' } })
  fireEvent.click(screen.getByRole('button', { name: /portal.announces.form.submit/i }))
}

describe('AnnouncesPage', () => {
  it('renders with empty state by default', () => {
    render(<AnnouncesPage />)
    expect(screen.getByText('portal.announces.title')).toBeInTheDocument()
    expect(screen.getByText('portal.announces.list.empty')).toBeInTheDocument()
  })

  it('opens add form on button click', () => {
    render(<AnnouncesPage />)
    fireEvent.click(screen.getByRole('button', { name: /portal.announces.add/i }))
    expect(screen.getByLabelText('portal.announces.form.title')).toBeInTheDocument()
  })

  it('adds an announce and displays it in the list', () => {
    render(<AnnouncesPage />)
    addAnnounce()
    expect(screen.getByText('Appartement Paris')).toBeInTheDocument()
    expect(screen.queryByText('portal.announces.list.empty')).not.toBeInTheDocument()
  })

  it('closes the form on cancel', () => {
    render(<AnnouncesPage />)
    fireEvent.click(screen.getByRole('button', { name: /portal.announces.add/i }))
    fireEvent.click(screen.getByRole('button', { name: /portal.announces.form.cancel/i }))
    expect(screen.queryByLabelText('portal.announces.form.title')).not.toBeInTheDocument()
  })

  it('edits an existing announce', () => {
    render(<AnnouncesPage />)
    addAnnounce()

    fireEvent.click(screen.getAllByRole('button', { name: /portal.announces.list.edit/i })[0])
    fireEvent.change(screen.getByLabelText('portal.announces.form.title'), { target: { value: 'Maison Lyon' } })
    fireEvent.click(screen.getByRole('button', { name: /portal.announces.form.submitEdit/i }))

    expect(screen.getByText('Maison Lyon')).toBeInTheDocument()
    expect(screen.queryByText('Appartement Paris')).not.toBeInTheDocument()
  })

  it('deletes an announce after confirmation', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<AnnouncesPage />)
    addAnnounce()

    fireEvent.click(screen.getByRole('button', { name: /portal.announces.list.delete/i }))
    expect(screen.getByText('portal.announces.list.empty')).toBeInTheDocument()
    vi.restoreAllMocks()
  })

  it('does not delete announce when confirmation is cancelled', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    render(<AnnouncesPage />)
    addAnnounce()

    fireEvent.click(screen.getByRole('button', { name: /portal.announces.list.delete/i }))
    expect(screen.getByText('Appartement Paris')).toBeInTheDocument()
    vi.restoreAllMocks()
  })

  it('opens stats popup on stats button click', () => {
    render(<AnnouncesPage />)
    addAnnounce()

    fireEvent.click(screen.getByRole('button', { name: /portal.announces.list.stats/i }))
    expect(screen.getByText('portal.announces.stats.title')).toBeInTheDocument()
    expect(screen.getByText('portal.announces.stats.views')).toBeInTheDocument()
    expect(screen.getByText('portal.announces.stats.contacts')).toBeInTheDocument()
    expect(screen.getByText('portal.announces.stats.favorites')).toBeInTheDocument()
    expect(screen.getByText('portal.announces.stats.daysOnline')).toBeInTheDocument()
  })

  it('navigates to full stats page from popup', () => {
    render(<AnnouncesPage />)
    addAnnounce()

    fireEvent.click(screen.getByRole('button', { name: /portal.announces.list.stats/i }))
    fireEvent.click(screen.getByText(/portal.announces.stats.viewFull/))

    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringMatching(/\/dashboard\/announces\/\d+\/stats/),
      expect.objectContaining({ state: expect.anything() })
    )
  })
})
