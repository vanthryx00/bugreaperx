import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VaultPage } from '../pages/Vault'

describe('VaultPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the vault header', () => {
    render(<VaultPage />)
    expect(screen.getByText('▸ PRIVACY VAULT')).toBeInTheDocument()
  })

  it('shows AES-256-GCM badge', () => {
    render(<VaultPage />)
    expect(screen.getByText('AES-256-GCM')).toBeInTheDocument()
  })

  it('shows the vault unlock screen when no setup exists', () => {
    render(<VaultPage />)
    // First-time setup shows the unlock component with setup instructions
    expect(screen.getByText(/End-to-end encrypted storage/)).toBeInTheDocument()
  })
})
