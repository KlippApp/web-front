import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AgentsPage from '../../pages/AgentsPage'

vi.mock('../../config/api.js', async () => ({
  ...(await vi.importActual('../../config/api.js')),
  default: 'http://api',
  DEV_BYPASS: false,
}))

vi.mock('../../hooks/useAuth.js', () => ({
  useAuth: () => ({ token: 'tok' }),
}))

const ok = (data) => ({ ok: true, json: async () => data })
const office = { uuid: 'office-1', name: 'Klipp Paris' }

function mockLists(agents = [], pendingLinks = []) {
  globalThis.fetch = vi.fn((url) => {
    if (url.startsWith('/agents?')) return Promise.resolve(ok({ items: agents }))
    if (url === '/agents/pending-links') return Promise.resolve(ok(pendingLinks))
    if (url.startsWith('/offices?')) return Promise.resolve(ok({ items: [office] }))
    return Promise.reject(new Error(`unexpected ${url}`))
  })
}

async function fillAndSubmit() {
  fireEvent.click(screen.getByRole('button', { name: /addAgent/i }))
  fireEvent.change(document.getElementById('agent-firstName'), { target: { value: 'John' } })
  fireEvent.change(document.getElementById('agent-lastName'), { target: { value: 'Doe' } })
  fireEvent.change(document.getElementById('agent-email'), { target: { value: 'john@doe.fr' } })
  fireEvent.change(document.getElementById('agent-phone'), { target: { value: '0612345678' } })
  fireEvent.click(screen.getByText('No office assigned'))
  fireEvent.click(screen.getAllByText('Klipp Paris').at(-1))
  fireEvent.click(screen.getByRole('button', { name: /form.submit/i }))
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('AgentsPage (API)', () => {
  it('loads agents and resolves their office name from office_uuid', async () => {
    mockLists([{ uuid: 'a1', name: 'Jane Roe', email: 'jane@roe.fr', phone: '+33611111111', office_uuid: 'office-1', has_set_password: true }])
    render(<AgentsPage />)
    await waitFor(() => expect(screen.getByText('Jane Roe')).toBeInTheDocument())
    expect(screen.getByText('Klipp Paris')).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledWith('/agents?items_per_page=100', expect.anything())
  })

  it('creates an agent with office_uuid', async () => {
    mockLists()
    render(<AgentsPage />)
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3))
    fetch.mockResolvedValueOnce(ok({ uuid: 'a2', name: 'John Doe', email: 'john@doe.fr', phone: '+33612345678', office_uuid: 'office-1', has_set_password: false }))

    await fillAndSubmit()

    await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument())
    const [url, init] = fetch.mock.calls[3]
    expect(url).toBe('/agents')
    expect(JSON.parse(init.body)).toMatchObject({ first_name: 'John', last_name: 'Doe', office_uuid: 'office-1' })
  })

  it('keeps the form open and shows the backend error on failure', async () => {
    mockLists()
    render(<AgentsPage />)
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3))
    fetch.mockResolvedValueOnce({ ok: false, json: async () => ({ detail: 'An account with this email already exists' }) })

    await fillAndSubmit()

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('An account with this email already exists'))
    expect(document.getElementById('agent-firstName')).toBeInTheDocument()
  })

  it('lists pending link invitations with their own badge', async () => {
    mockLists([], [{ uuid: 'u1', name: 'App User', email: 'app@user.fr', phone: null, office_uuid: 'office-1', has_set_password: true, link_pending: true }])
    render(<AgentsPage />)
    await waitFor(() => expect(screen.getByText('App User')).toBeInTheDocument())
    expect(screen.getByText('Invitation sent')).toBeInTheDocument()
  })

  it('asks for confirmation when the email already has an account, then sends a link invitation', async () => {
    mockLists()
    render(<AgentsPage />)
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3))
    fetch
      .mockResolvedValueOnce({ ok: false, status: 409, json: async () => ({ detail: 'An account with this email already exists' }) })
      .mockResolvedValueOnce(ok({ uuid: 'u1', name: 'App User', email: 'john@doe.fr', phone: null, office_uuid: 'office-1', has_set_password: true, link_pending: true }))

    await fillAndSubmit()

    await waitFor(() => expect(screen.getByRole('alertdialog')).toBeInTheDocument())
    expect(JSON.parse(fetch.mock.calls[3][1].body).link_existing).toBe(false)
    fireEvent.click(screen.getByRole('button', { name: 'Send invitation' }))

    await waitFor(() => expect(screen.getByText('Invitation sent')).toBeInTheDocument())
    expect(JSON.parse(fetch.mock.calls[4][1].body)).toMatchObject({ email: 'john@doe.fr', link_existing: true })
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(document.getElementById('agent-firstName')).not.toBeInTheDocument()
  })

  it('keeps the form open without inviting when the confirmation is cancelled', async () => {
    mockLists()
    render(<AgentsPage />)
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3))
    fetch.mockResolvedValueOnce({ ok: false, status: 409, json: async () => ({ detail: 'An account with this email already exists' }) })

    await fillAndSubmit()
    await waitFor(() => expect(screen.getByRole('alertdialog')).toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(document.getElementById('agent-firstName')).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledTimes(4)
  })
})
