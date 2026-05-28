import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { HuntPage } from '../pages/Hunt'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('HuntPage', () => {
  it('renders the hunt header', () => {
    render(<HuntPage />)
    expect(screen.getByText('▸ HUNT')).toBeInTheDocument()
    expect(screen.getByText(/Target management/)).toBeInTheDocument()
  })

  it('shows correct program count', () => {
    render(<HuntPage />)
    const statElements = screen.getAllByText('3')
    expect(statElements.length).toBeGreaterThanOrEqual(1)
  })

  it('shows correct active targets count (2)', () => {
    render(<HuntPage />)
    const statElements = screen.getAllByText('2')
    expect(statElements.length).toBeGreaterThanOrEqual(1)
  })

  it('shows correct findings count (10)', () => {
    render(<HuntPage />)
    const statElements = screen.getAllByText('10')
    expect(statElements.length).toBeGreaterThanOrEqual(1)
  })

  it('shows earnings stat', () => {
    render(<HuntPage />)
    expect(screen.getByText('$3,300')).toBeInTheDocument()
  })

  it('has an Add Program button', () => {
    render(<HuntPage />)
    expect(screen.getByText('+ Add Program')).toBeInTheDocument()
  })

  it('opens the program form when clicking Add Program', () => {
    render(<HuntPage />)
    fireEvent.click(screen.getByText('+ Add Program'))
    expect(screen.getByText('+ New Program')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/e.g., MegaCorp VDP/)).toBeInTheDocument()
    expect(screen.getByText('Add')).toBeInTheDocument()
  })

  it('adds a new program when form is submitted with a name', () => {
    render(<HuntPage />)
    fireEvent.click(screen.getByText('+ Add Program'))

    const nameInput = screen.getByPlaceholderText(/e.g., MegaCorp VDP/)
    fireEvent.change(nameInput, { target: { value: 'New Test Program' } })

    const platformSelect = screen.getByRole('combobox')
    fireEvent.change(platformSelect, { target: { value: 'bugcrowd' } })

    fireEvent.click(screen.getByText('Add'))

    expect(screen.getByText('New Test Program')).toBeInTheDocument()
    // Program count should now be 4
    const countElements = screen.getAllByText('4')
    expect(countElements.length).toBeGreaterThanOrEqual(1)
  })

  it('does not add program when name is empty', () => {
    render(<HuntPage />)
    fireEvent.click(screen.getByText('+ Add Program'))

    fireEvent.click(screen.getByText('Add'))

    // MegaCorp VDP should still be there (original programs unchanged)
    expect(screen.getByText('MegaCorp VDP')).toBeInTheDocument()
    // Still 3 programs
    const countElements = screen.getAllByText('3')
    expect(countElements.length).toBeGreaterThanOrEqual(1)
  })

  it('shows all default program names', () => {
    render(<HuntPage />)
    expect(screen.getByText('MegaCorp VDP')).toBeInTheDocument()
    expect(screen.getByText('Startup Inc.')).toBeInTheDocument()
    expect(screen.getByText('Private Program')).toBeInTheDocument()
  })

  it('shows target names for MegaCorp VDP', () => {
    render(<HuntPage />)
    expect(screen.getByText('target.example.com')).toBeInTheDocument()
    expect(screen.getByText('admin.example.org')).toBeInTheDocument()
  })

  it('shows host IPs when available', () => {
    render(<HuntPage />)
    expect(screen.getByText('192.168.1.1')).toBeInTheDocument()
    expect(screen.getByText('10.0.0.5')).toBeInTheDocument()
    expect(screen.getByText('203.0.113.10')).toBeInTheDocument()
  })

  it('shows last scanned date for scanned programs', () => {
    render(<HuntPage />)
    expect(screen.getByText(/Last scanned: 2026-05-27/)).toBeInTheDocument()
    expect(screen.getByText(/Last scanned: 2026-05-26/)).toBeInTheDocument()
  })

  it('shows empty targets message for new programs with no targets', () => {
    render(<HuntPage />)
    fireEvent.click(screen.getByText('+ Add Program'))
    const nameInput = screen.getByPlaceholderText(/e.g., MegaCorp VDP/)
    fireEvent.change(nameInput, { target: { value: 'Empty Program' } })
    fireEvent.click(screen.getByText('Add'))

    // The new program with no targets should show the empty state
    const emptyMessages = screen.getAllByText(/No targets yet/)
    expect(emptyMessages.length).toBeGreaterThanOrEqual(1)
  })

  it('shows platform badges for each program', () => {
    render(<HuntPage />)
    expect(screen.getAllByText('H1').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('BC')).toBeInTheDocument()
    expect(screen.getByText('SM')).toBeInTheDocument()
  })

  it('shows tool counts for targets', () => {
    render(<HuntPage />)
    const toolElements = screen.getAllByText(/tools/)
    expect(toolElements.some(el => el.textContent?.includes('8'))).toBe(true)
    expect(toolElements.some(el => el.textContent?.includes('12'))).toBe(true)
    expect(toolElements.some(el => el.textContent?.includes('4'))).toBe(true)
  })

  it('shows finding counts for targets', () => {
    render(<HuntPage />)
    const findingElements = screen.getAllByText(/findings/)
    expect(findingElements.some(el => el.textContent?.includes('3'))).toBe(true)
    expect(findingElements.some(el => el.textContent?.includes('7'))).toBe(true)
    expect(findingElements.some(el => el.textContent?.includes('0'))).toBe(true)
  })

  it('closes the form when Cancel is clicked', () => {
    render(<HuntPage />)
    fireEvent.click(screen.getByText('+ Add Program'))
    expect(screen.getByText('+ New Program')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Cancel'))
    expect(screen.queryByText('+ New Program')).not.toBeInTheDocument()
  })

  it('cancels the form without adding a program', () => {
    render(<HuntPage />)
    fireEvent.click(screen.getByText('+ Add Program'))

    const nameInput = screen.getByPlaceholderText(/e.g., MegaCorp VDP/) as HTMLInputElement
    fireEvent.change(nameInput, { target: { value: 'Should Not Appear' } })
    fireEvent.click(screen.getByText('Cancel'))

    expect(screen.queryByText('Should Not Appear')).not.toBeInTheDocument()
  })

  it('closes the form after successfully adding a program', () => {
    render(<HuntPage />)
    fireEvent.click(screen.getByText('+ Add Program'))

    const nameInput = screen.getByPlaceholderText(/e.g., MegaCorp VDP/)
    fireEvent.change(nameInput, { target: { value: 'Post-Add Program' } })
    fireEvent.click(screen.getByText('Add'))

    // Form should close after successful add
    expect(screen.queryByText('+ New Program')).not.toBeInTheDocument()
  })

  it('defaults platform to self-managed in the add form', () => {
    render(<HuntPage />)
    fireEvent.click(screen.getByText('+ Add Program'))

    const platformSelect = screen.getByRole('combobox') as HTMLSelectElement
    expect(platformSelect.value).toBe('self-managed')
  })
})
