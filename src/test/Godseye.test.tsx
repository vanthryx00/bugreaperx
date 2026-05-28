import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GodseyePage } from '../pages/Godseye'

describe('GodseyePage', () => {
  it('renders the godseye header', () => {
    render(<GodseyePage />)
    expect(screen.getByText('▸ GODSEYE')).toBeInTheDocument()
  })

  it('renders all 5 quick stats by label', () => {
    render(<GodseyePage />)
    expect(screen.getByText('Safety Railguards')).toBeInTheDocument()
    expect(screen.getByText('Threats Blocked')).toBeInTheDocument()
    expect(screen.getByText('Privacy Layers')).toBeInTheDocument()
    expect(screen.getByText('Code Gen Blocks')).toBeInTheDocument()
    expect(screen.getByText('Uptime')).toBeInTheDocument()
  })

  it('shows unique stat values by full text', () => {
    render(<GodseyePage />)
    expect(screen.getByText('422')).toBeInTheDocument()
    expect(screen.getByText('142')).toBeInTheDocument()
    expect(screen.getByText('99.97%')).toBeInTheDocument()
  })

  it('shows integration banner and security status', () => {
    render(<GodseyePage />)
    expect(screen.getByText('SYSTEM INTEGRITY: VERIFIED')).toBeInTheDocument()
    expect(screen.getByText('All systems secure')).toBeInTheDocument()
  })
})
