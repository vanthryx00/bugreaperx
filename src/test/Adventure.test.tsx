import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AdventurePage } from '../pages/Adventure'

describe('AdventurePage', () => {
  it('renders the adventure header', () => {
    render(<AdventurePage />)
    expect(screen.getByText('▸ ADVENTURE MODE')).toBeInTheDocument()
  })

  it('shows GAMIFIED badge', () => {
    render(<AdventurePage />)
    expect(screen.getByText('GAMIFIED')).toBeInTheDocument()
  })

  it('renders all 4 quick stats', () => {
    render(<AdventurePage />)
    expect(screen.getByText('XP per Sprint')).toBeInTheDocument()
    expect(screen.getByText('Badges')).toBeInTheDocument()
    expect(screen.getByText('Max Streak Reward')).toBeInTheDocument()
    expect(screen.getByText('Max Level')).toBeInTheDocument()
  })

  it('shows stat values', () => {
    render(<AdventurePage />)
    expect(screen.getByText('25 + 10/phase')).toBeInTheDocument()
    expect(screen.getByText('12 total')).toBeInTheDocument()
    expect(screen.getByText('2x XP')).toBeInTheDocument()
  })

  it('shows XP guide banner', () => {
    render(<AdventurePage />)
    expect(screen.getByText('XP EARNED PER SPRINT')).toBeInTheDocument()
    expect(screen.getByText(/Base: 25 XP per completed sprint/)).toBeInTheDocument()
  })
})
