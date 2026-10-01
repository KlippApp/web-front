import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import DashboardPage from '../../pages/DashboardPage'

vi.mock('recharts', () => ({
  AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>,
  Area: () => null,
  CartesianGrid: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
}))

function renderDashboard() {
  return render(
    <MemoryRouter>
      <DashboardPage />
    </MemoryRouter>
  )
}

describe('DashboardPage', () => {
  it('renders the stat cards', () => {
    renderDashboard()
    expect(screen.getByText('Active listings')).toBeInTheDocument()
    expect(screen.getByText('Likes (30 days)')).toBeInTheDocument()
    expect(screen.getByText('Agents')).toBeInTheDocument()
    expect(screen.queryByText('Messages')).not.toBeInTheDocument()
  })

  it('shows zeros without a configured API', () => {
    renderDashboard()
    expect(screen.getAllByText('0')).toHaveLength(3)
  })

  it('renders the chart title', () => {
    renderDashboard()
    expect(screen.getByText('Likes received — Last 30 days')).toBeInTheDocument()
  })

  it('renders the chart', () => {
    renderDashboard()
    expect(screen.getByTestId('area-chart')).toBeInTheDocument()
  })
})
