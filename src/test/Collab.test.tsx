import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CollabPage } from '../pages/Collab'

describe('CollabPage', () => {
  it('renders the collab header', () => {
    render(<CollabPage />)
    expect(screen.getByText('▸ COLLAB LAB')).toBeInTheDocument()
  })

  it('renders all 4 quick stats', () => {
    render(<CollabPage />)
    expect(screen.getByText('Connection')).toBeInTheDocument()
    expect(screen.getByText('Latency')).toBeInTheDocument()
    expect(screen.getByText('Peers Online')).toBeInTheDocument()
    expect(screen.getByText('Snippets')).toBeInTheDocument()
  })

  it('shows instructions panel', () => {
    render(<CollabPage />)
    expect(screen.getByText('HOW TO COLLABORATE')).toBeInTheDocument()
    expect(screen.getByText(/Start Coding/)).toBeInTheDocument()
    expect(screen.getByText(/Invite Peers/)).toBeInTheDocument()
    expect(screen.getByText(/Chat & Execute/)).toBeInTheDocument()
  })
})
