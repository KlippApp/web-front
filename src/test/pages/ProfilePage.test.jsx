import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ProfilePage from '../../pages/ProfilePage'

const mockUpdateProfile = vi.fn()
const mockLogout = vi.fn()
const mockNavigate = vi.fn()

vi.mock('../../hooks/useAuth.js', () => ({
  useAuth: () => ({
    agency: 'Test Agency',
    managerName: 'Jean Dupont',
    token: 'valid-token',
    updateProfile: mockUpdateProfile,
    logout: mockLogout,
  }),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

beforeEach(() => {
  vi.clearAllMocks()
})

function renderProfilePage() {
  return render(
    <MemoryRouter>
      <ProfilePage />
    </MemoryRouter>
  )
}

describe('ProfilePage', () => {
  it('renders page title', () => {
    renderProfilePage()
    expect(screen.getByText('Agency profile')).toBeInTheDocument()
  })

  it('renders agency info section', () => {
    renderProfilePage()
    expect(screen.getByText('Agency information')).toBeInTheDocument()
  })

  it('renders password section', () => {
    renderProfilePage()
    expect(screen.getByText('Change password')).toBeInTheDocument()
  })

  it('pre-fills manager name and agency name from auth', () => {
    renderProfilePage()
    expect(document.getElementById('prof-managerName').value).toBe('Jean Dupont')
    expect(document.getElementById('prof-agencyName').value).toBe('Test Agency')
  })

  it('shows error when new passwords do not match', async () => {
    renderProfilePage()
    fireEvent.change(document.getElementById('prof-currentPassword'), { target: { value: 'oldpass' } })
    fireEvent.change(document.getElementById('prof-newPassword'), { target: { value: 'newpass1' } })
    fireEvent.change(document.getElementById('prof-confirmNewPassword'), { target: { value: 'newpass2' } })
    fireEvent.click(screen.getByRole('button', { name: /update password/i }))
    await waitFor(() => expect(screen.getByText('Passwords do not match.')).toBeInTheDocument())
  })

  it('shows success and calls updateProfile on successful agency info save', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })
    renderProfilePage()
    fireEvent.change(document.getElementById('prof-email'), { target: { value: 'agency@test.com' } })
    fireEvent.change(document.getElementById('prof-phone'), { target: { value: '+33600000000' } })
    fireEvent.change(document.getElementById('prof-streetNumber'), { target: { value: '12' } })
    fireEvent.change(document.getElementById('prof-street'), { target: { value: 'Rue de la Paix' } })
    fireEvent.change(document.getElementById('prof-postalCode'), { target: { value: '75001' } })
    fireEvent.change(document.getElementById('prof-city'), { target: { value: 'Paris' } })
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))
    await waitFor(() => expect(screen.getByText('Information updated successfully.')).toBeInTheDocument())
    expect(mockUpdateProfile).toHaveBeenCalledWith('Test Agency', 'Jean Dupont')
  })

  it('shows error on agency info save failure', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Server error' }),
    })
    renderProfilePage()
    fireEvent.change(document.getElementById('prof-email'), { target: { value: 'agency@test.com' } })
    fireEvent.change(document.getElementById('prof-phone'), { target: { value: '+33600000000' } })
    fireEvent.change(document.getElementById('prof-streetNumber'), { target: { value: '12' } })
    fireEvent.change(document.getElementById('prof-street'), { target: { value: 'Rue de la Paix' } })
    fireEvent.change(document.getElementById('prof-postalCode'), { target: { value: '75001' } })
    fireEvent.change(document.getElementById('prof-city'), { target: { value: 'Paris' } })
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))
    await waitFor(() => expect(screen.getByText('Server error')).toBeInTheDocument())
  })

  it('shows success on successful password update', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })
    renderProfilePage()
    fireEvent.change(document.getElementById('prof-currentPassword'), { target: { value: 'oldpass' } })
    fireEvent.change(document.getElementById('prof-newPassword'), { target: { value: 'newpass' } })
    fireEvent.change(document.getElementById('prof-confirmNewPassword'), { target: { value: 'newpass' } })
    fireEvent.click(screen.getByRole('button', { name: /update password/i }))
    await waitFor(() => expect(screen.getByText('Password updated successfully.')).toBeInTheDocument())
  })

  it('shows error on password update failure', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Wrong current password' }),
    })
    renderProfilePage()
    fireEvent.change(document.getElementById('prof-currentPassword'), { target: { value: 'wrongpass' } })
    fireEvent.change(document.getElementById('prof-newPassword'), { target: { value: 'newpass' } })
    fireEvent.change(document.getElementById('prof-confirmNewPassword'), { target: { value: 'newpass' } })
    fireEvent.click(screen.getByRole('button', { name: /update password/i }))
    await waitFor(() => expect(screen.getByText('Wrong current password')).toBeInTheDocument())
  })

  it('opens delete modal on delete button click', () => {
    renderProfilePage()
    fireEvent.click(screen.getByRole('button', { name: /delete account/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('This action is irreversible and will permanently delete all your data.')).toBeInTheDocument()
  })

  it('close button resets input and closes modal', () => {
    renderProfilePage()
    fireEvent.click(screen.getByRole('button', { name: /delete account/i }))
    fireEvent.change(document.getElementById('delete-confirm-input'), { target: { value: 'Test Agency' } })
    fireEvent.click(screen.getByRole('button', { name: /^cancel$/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('confirm button is disabled when input does not match agency name', () => {
    renderProfilePage()
    fireEvent.click(screen.getByRole('button', { name: /delete account/i }))
    fireEvent.change(document.getElementById('delete-confirm-input'), { target: { value: 'Wrong Name' } })
    const confirmBtn = screen.getAllByRole('button', { name: /delete account/i }).find(b => b.disabled !== undefined && b.closest('[role="dialog"]'))
    expect(document.getElementById('delete-confirm-input').value).toBe('Wrong Name')
    const dialogButtons = screen.getByRole('dialog').querySelectorAll('button')
    const confirmButton = Array.from(dialogButtons).find(b => b.textContent === 'Delete account')
    expect(confirmButton).toBeDisabled()
  })

  it('confirm button is enabled when input matches agency name exactly', () => {
    renderProfilePage()
    fireEvent.click(screen.getByRole('button', { name: /delete account/i }))
    fireEvent.change(document.getElementById('delete-confirm-input'), { target: { value: 'Test Agency' } })
    const dialogButtons = screen.getByRole('dialog').querySelectorAll('button')
    const confirmButton = Array.from(dialogButtons).find(b => b.textContent === 'Delete account')
    expect(confirmButton).not.toBeDisabled()
  })

  it('calls logout and navigates to /login on successful delete', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({ ok: true })
    renderProfilePage()
    fireEvent.click(screen.getByRole('button', { name: /delete account/i }))
    fireEvent.change(document.getElementById('delete-confirm-input'), { target: { value: 'Test Agency' } })
    const dialogButtons = screen.getByRole('dialog').querySelectorAll('button')
    const confirmButton = Array.from(dialogButtons).find(b => b.textContent === 'Delete account')
    fireEvent.click(confirmButton)
    await waitFor(() => expect(mockLogout).toHaveBeenCalled())
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('shows error on delete failure without closing modal', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Delete failed' }),
    })
    renderProfilePage()
    fireEvent.click(screen.getByRole('button', { name: /delete account/i }))
    fireEvent.change(document.getElementById('delete-confirm-input'), { target: { value: 'Test Agency' } })
    const dialogButtons = screen.getByRole('dialog').querySelectorAll('button')
    const confirmButton = Array.from(dialogButtons).find(b => b.textContent === 'Delete account')
    fireEvent.click(confirmButton)
    await waitFor(() => expect(screen.getByText('Delete failed')).toBeInTheDocument())
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
