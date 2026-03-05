import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AnnounceStatsPage from '../../pages/AnnounceStatsPage'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', () => ({
  useParams: () => ({ id: '123' }),
  useLocation: () => ({ state: { announce: { id: 123, title: 'Appartement Paris 11e', type: 'vente', status: 'active' } } }),
  useNavigate: () => mockNavigate,
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}))

vi.mock('recharts', () => ({
  AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>,
  Area: () => null,
  CartesianGrid: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
}))

describe('AnnounceStatsPage', () => {
  it('renders the back button and header', () => {
    render(<AnnounceStatsPage />)
    expect(screen.getByRole('button', { name: /portal.announces.stats.backToList/i })).toBeInTheDocument()
    expect(screen.getByText('portal.announces.stats.title')).toBeInTheDocument()
  })

  it('displays the announce title from route state', () => {
    render(<AnnounceStatsPage />)
    expect(screen.getByText('Appartement Paris 11e')).toBeInTheDocument()
  })

  it('renders all 5 stat cards', () => {
    render(<AnnounceStatsPage />)
    expect(screen.getByText('portal.announces.stats.views')).toBeInTheDocument()
    expect(screen.getByText('portal.announces.stats.contacts')).toBeInTheDocument()
    expect(screen.getByText('portal.announces.stats.favorites')).toBeInTheDocument()
    expect(screen.getByText('portal.announces.stats.daysOnline')).toBeInTheDocument()
    expect(screen.getByText('portal.announces.stats.conversionRate')).toBeInTheDocument()
  })

  it('renders both charts', () => {
    render(<AnnounceStatsPage />)
    expect(screen.getByText('portal.announces.stats.viewsChart')).toBeInTheDocument()
    expect(screen.getByText('portal.announces.stats.contactsChart')).toBeInTheDocument()
    const charts = screen.getAllByTestId('area-chart')
    expect(charts).toHaveLength(2)
  })

  it('renders traffic sources table', () => {
    render(<AnnounceStatsPage />)
    expect(screen.getByText('portal.announces.stats.sources')).toBeInTheDocument()
    expect(screen.getByText('App mobile')).toBeInTheDocument()
    expect(screen.getByText('Web')).toBeInTheDocument()
    expect(screen.getByText('Partage direct')).toBeInTheDocument()
  })

  it('navigates back to announces list on back button click', () => {
    render(<AnnounceStatsPage />)
    fireEvent.click(screen.getByRole('button', { name: /portal.announces.stats.backToList/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/announces')
  })
})
