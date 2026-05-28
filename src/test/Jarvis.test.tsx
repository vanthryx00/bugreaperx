import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { JarvisPage } from '../pages/Jarvis'

describe('JarvisPage', () => {
  it('renders the jarvis header', () => {
    render(<JarvisPage />)
    expect(screen.getByText('▸ JARVIS')).toBeInTheDocument()
  })

  it('renders all 4 quick stats by label', () => {
    render(<JarvisPage />)
    expect(screen.getByText('Safety Rules Active')).toBeInTheDocument()
    expect(screen.getByText('Criminal Requests Blocked')).toBeInTheDocument()
    expect(screen.getByText('Privacy Violations')).toBeInTheDocument()
    expect(screen.getByText('Ethical Compliance')).toBeInTheDocument()
  })

  it('shows status badges with full text', () => {
    render(<JarvisPage />)
    expect(screen.getByText('Online')).toBeInTheDocument()
    expect(screen.getByText('422 blocked')).toBeInTheDocument()
    expect(screen.getByText('6 guardrails')).toBeInTheDocument()
  })

  it('shows safety notice banner', () => {
    render(<JarvisPage />)
    expect(screen.getByText('SAFETY NOTICE')).toBeInTheDocument()
    expect(screen.getByText(/JARVIS is an ethical AI assistant/)).toBeInTheDocument()
  })

  it('shows stat sub labels', () => {
    render(<JarvisPage />)
    expect(screen.getByText('100% enforcement')).toBeInTheDocument()
    expect(screen.getByText('All logged')).toBeInTheDocument()
    expect(screen.getByText('Zero tolerance')).toBeInTheDocument()
  })
})
