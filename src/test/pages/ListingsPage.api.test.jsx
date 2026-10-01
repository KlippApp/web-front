import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ListingsPage from '../../pages/ListingsPage'

vi.mock('../../config/api.js', async () => ({
  ...(await vi.importActual('../../config/api.js')),
  default: 'http://api',
  DEV_BYPASS: false,
}))

vi.mock('../../components/LikesChart.jsx', () => ({
  default: ({ likesPerDay }) => <div data-testid="likes-chart" data-points={likesPerDay.length} />,
}))

const ok = (data) => ({ ok: true, json: async () => data })
const listing = (uuid, overrides = {}) => ({
  uuid,
  title: `Appartement ${uuid}`,
  price_cents: 45000000,
  location: 'Paris 15e',
  listing_type: 'sale',
  like_count: 3,
  view_count: 40,
  created_at: '2026-09-20T10:00:00Z',
  owner: { uuid: 'agent-1', name: 'Jean Agent' },
  video: { status: 'READY', mux_playback_id: `pb-${uuid}` },
  photos: [],
  ...overrides,
})

function mockApi(pages) {
  globalThis.fetch = vi.fn((url) => {
    if (url.startsWith('/agents?')) return Promise.resolve(ok({ items: [{ uuid: 'agent-1', name: 'Jean Agent' }] }))
    if (url.startsWith('/agencies/listings?')) {
      const page = Number(new URLSearchParams(url.split('?')[1]).get('page'))
      return Promise.resolve(ok(pages[page - 1]))
    }
    if (url.startsWith('/agencies/listings/')) {
      return Promise.resolve(ok({ ...listing('l1'), likes_per_day: [{ date: '2026-10-01', count: 3 }] }))
    }
    return Promise.reject(new Error(`unexpected ${url}`))
  })
}

const listingCalls = () => fetch.mock.calls.map(([url]) => url).filter(url => url.startsWith('/agencies/listings?'))

describe('ListingsPage with API', () => {
  it('lists the agency listings and loads the next page', async () => {
    mockApi([
      { items: [listing('l1')], has_more: true },
      { items: [listing('l2', { listing_type: 'rent', price_cents: 125000, view_count: null })], has_more: false },
    ])
    render(<ListingsPage />)

    expect(await screen.findByRole('button', { name: 'Open listing Appartement l1' })).toBeInTheDocument()
    expect(screen.getByText('3 likes')).toBeInTheDocument()
    expect(screen.getByText('40 views')).toBeInTheDocument()
    expect(screen.getByText('Live')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Show more listings' }))
    expect(await screen.findByRole('button', { name: 'Open listing Appartement l2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open listing Appartement l1' })).toBeInTheDocument()
    expect(screen.getByText('/month')).toBeInTheDocument()
    expect(screen.getAllByText(/views$/)).toHaveLength(1)
    expect(screen.queryByRole('button', { name: 'Show more listings' })).not.toBeInTheDocument()
  })

  it('filters by agent and type from the first page', async () => {
    mockApi([{ items: [listing('l1')], has_more: false }])
    render(<ListingsPage />)
    await screen.findByRole('button', { name: 'Open listing Appartement l1' })

    fireEvent.click(screen.getByText('All agents'))
    fireEvent.click(await screen.findByText('Jean Agent'))
    await waitFor(() => expect(listingCalls().at(-1)).toContain('agent_uuid=agent-1'))

    fireEvent.click(screen.getByText('Sale and rent'))
    fireEvent.click(screen.getByText('Rent'))
    await waitFor(() => expect(listingCalls().at(-1)).toContain('listing_type=rent'))
    expect(listingCalls().at(-1)).toContain('page=1')
  })

  it('opens the preview with the likes of the last 30 days and closes it with Escape', async () => {
    mockApi([{ items: [listing('l1', { rooms: 3, surface_sqm: 62, description: 'Lumineux' })], has_more: false }])
    render(<ListingsPage />)

    fireEvent.click(await screen.findByRole('button', { name: 'Open listing Appartement l1' }))
    const dialog = screen.getByRole('dialog', { name: 'Appartement l1' })
    expect(dialog).toHaveTextContent('Lumineux')
    expect(dialog).toHaveTextContent('62 m²')
    expect(dialog).toHaveTextContent('40Views in the last 30 days')
    await waitFor(() => expect(screen.getByTestId('likes-chart')).toHaveAttribute('data-points', '1'))
    expect(fetch).toHaveBeenCalledWith('/agencies/listings/l1', expect.anything())

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
