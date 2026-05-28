import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NeurohackPage } from '../pages/Neurohack'

describe('NeurohackPage', () => {
  it('renders the neurohack header', () => {
    render(<NeurohackPage />)
    expect(screen.getByText('▸ NEUROHACK SOVEREIGN')).toBeInTheDocument()
  })

  it('renders all 4 quick stats by label', () => {
    render(<NeurohackPage />)
    // Use getAllByText for labels that appear in both stats and protocol cards
    const feynmanLabels = screen.getAllByText('Feynman Speed-Run')
    expect(feynmanLabels.length).toBeGreaterThanOrEqual(1)

    expect(screen.getByText('Reverse Engineer')).toBeInTheDocument()
    expect(screen.getByText('Constraint Mastery')).toBeInTheDocument()
    expect(screen.getByText('Dopamine Triggers')).toBeInTheDocument()
  })

  it('shows neurohack principles', () => {
    render(<NeurohackPage />)
    expect(screen.getByText('NEUROHACK PRINCIPLES')).toBeInTheDocument()
    expect(screen.getByText(/1. Compress learning/)).toBeInTheDocument()
    expect(screen.getByText(/2. Remove friction/)).toBeInTheDocument()
  })

  it('shows python CLI reference', () => {
    render(<NeurohackPage />)
    expect(screen.getByText('neurohack_sovereign.py')).toBeInTheDocument()
  })

  it('shows unique stat values', () => {
    render(<NeurohackPage />)
    expect(screen.getByText('Learn → Teach')).toBeInTheDocument()
    expect(screen.getByText('Expert → Rebuild')).toBeInTheDocument()
    expect(screen.getByText('MVP → Iterate')).toBeInTheDocument()
    expect(screen.getByText('Momentum hits')).toBeInTheDocument()
  })
})
