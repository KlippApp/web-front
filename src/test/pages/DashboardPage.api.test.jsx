import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import DashboardPage from '../../pages/DashboardPage'

vi.mock('../../config/api.js', async () => ({
  ...(await vi.importActual('../../config/api.js')),
  default: 'http://api',
  DEV_BYPASS: false,
}))

vi.mock('recharts', () => ({
  AreaChart: ({ data, children }) => <div data-testid="area-chart" data-points={JSON.stringify(data)}>{children}</div>,
  Area: () => null,
  CartesianGrid: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
}))

const stats = {
  active_listings: 3,
  agents: 2,
  likes_last_30_days: 7,
  likes_per_day: [
    { date: '2026-09-30', count: 4 },
    { date: '2026-10-01', count: 3 },
  ],
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('DashboardPage (API)', () => {
  it('shows the agency stats and charts likes per day', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({ ok: true, status: 200, json: async () => stats })
    render(<DashboardPage />)

    await waitFor(() => expect(screen.getByText('7')).toBeInTheDocument())
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(fetch.mock.calls[0][0]).toBe('/agencies/stats')
    expect(JSON.parse(screen.getByTestId('area-chart').dataset.points)).toEqual([
      { date: '30/09', value: 4 },
      { date: '01/10', value: 3 },
    ])
  })

  it('shows placeholders instead of fake numbers when the stats cannot be loaded', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) })
    render(<DashboardPage />)

    await waitFor(() => expect(fetch).toHaveBeenCalled())
    expect(screen.getAllByText('—')).toHaveLength(3)
    expect(JSON.parse(screen.getByTestId('area-chart').dataset.points)).toEqual([])
  })
})
