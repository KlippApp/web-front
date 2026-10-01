import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import OfficesPage from '../../pages/OfficesPage'

vi.mock('../../config/api.js', async () => ({
  ...(await vi.importActual('../../config/api.js')),
  default: 'http://api',
  DEV_BYPASS: false,
}))

vi.mock('../../hooks/useAuth.js', () => ({
  useAuth: () => ({ token: 'tok' }),
}))

const office = { uuid: 'o1', name: 'Office 1', address: 'Addr 1', email: 'o1@o.com', phone: '+33 0123456789', country_code: '+33', photo: null }

beforeEach(() => {
  vi.restoreAllMocks()
  globalThis.fetch = vi.fn().mockResolvedValueOnce({ ok: true, json: async () => ({ items: [office] }) })
})

describe('OfficesPage (API)', () => {
  it('loads offices from the paginated endpoint', async () => {
    render(<OfficesPage />)
    await waitFor(() => expect(screen.getByText('Office 1')).toBeInTheDocument())
    expect(fetch).toHaveBeenCalledWith('http://api/offices?items_per_page=100', expect.anything())
  })

  it('updates an office with PATCH and keeps it in the list', async () => {
    render(<OfficesPage />)
    await waitFor(() => expect(screen.getByText('Office 1')).toBeInTheDocument())
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ message: 'Office updated' }) })

    fireEvent.click(screen.getByRole('button', { name: /list.edit/i }))
    fireEvent.change(screen.getByLabelText('portal.offices.form.name'), { target: { value: 'Office 2' } })
    fireEvent.click(screen.getByRole('button', { name: /form.submitEdit/i }))

    await waitFor(() => expect(screen.getByText('Office 2')).toBeInTheDocument())
    expect(screen.getByText('Addr 1')).toBeInTheDocument()
    const [url, init] = fetch.mock.calls[1]
    expect(url).toBe('http://api/offices/o1')
    expect(init.method).toBe('PATCH')
  })
})
