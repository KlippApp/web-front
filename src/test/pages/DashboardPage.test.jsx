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
  it('renders stat cards', () => {
    renderDashboard()
    expect(screen.getByText('Messages')).toBeInTheDocument()
    expect(screen.getByText('Active listings')).toBeInTheDocument()
    expect(screen.getByText('Sales this month')).toBeInTheDocument()
  })

  it('renders chart title', () => {
    renderDashboard()
    expect(screen.getByText('Sales — Last 30 days')).toBeInTheDocument()
  })

  it('renders the chart', () => {
    renderDashboard()
    expect(screen.getByTestId('area-chart')).toBeInTheDocument()
  })
})
