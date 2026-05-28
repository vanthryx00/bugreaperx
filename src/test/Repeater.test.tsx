import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RepeaterPage } from '../pages/Repeater'

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  // Clean up electronAPI mock to prevent cross-test contamination
  delete (window as unknown as Record<string, unknown>).electronAPI
})

describe('RepeaterPage', () => {
  it('renders the repeater header', () => {
    render(<RepeaterPage />)
    expect(screen.getByText('▸ REPEATER')).toBeInTheDocument()
    expect(screen.getByText(/HTTP request crafting/)).toBeInTheDocument()
  })

  it('has a method selector with common HTTP methods', () => {
    render(<RepeaterPage />)
    const selector = screen.getByRole('combobox')
    expect(selector).toBeInTheDocument()
    expect(selector).toHaveValue('GET')

    // Check methods exist
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD']
    methods.forEach(m => {
      expect(screen.getByRole('option', { name: m })).toBeInTheDocument()
    })
  })

  it('has a URL input field', () => {
    render(<RepeaterPage />)
    const urlInput = screen.getByPlaceholderText('https://target.com/path')
    expect(urlInput).toBeInTheDocument()
    expect(urlInput).toHaveValue('https://example.com')
  })

  it('has a FIRE button', () => {
    render(<RepeaterPage />)
    expect(screen.getByText('▸ FIRE')).toBeInTheDocument()
  })

  it('has a RAW toggle button', () => {
    render(<RepeaterPage />)
    expect(screen.getByText('RAW')).toBeInTheDocument()
  })

  it('displays the request editor with headers by default', () => {
    render(<RepeaterPage />)
    expect(screen.getByText('REQUEST')).toBeInTheDocument()
    expect(screen.getByText(/structured/)).toBeInTheDocument()
    // Headers textarea should be present (it has a label "Headers")
    expect(screen.getByText('Headers')).toBeInTheDocument()
  })

  it('does not show body textarea for GET method', () => {
    render(<RepeaterPage />)
    // For GET, body textarea should not be rendered
    const bodyLabels = screen.queryByText('Body')
    expect(bodyLabels).not.toBeInTheDocument()
  })

  it('shows body textarea when method is POST', () => {
    render(<RepeaterPage />)
    const selector = screen.getByRole('combobox')
    fireEvent.change(selector, { target: { value: 'POST' } })
    expect(screen.getByText('Body')).toBeInTheDocument()
  })

  it('shows body textarea when method is PUT', () => {
    render(<RepeaterPage />)
    const selector = screen.getByRole('combobox')
    fireEvent.change(selector, { target: { value: 'PUT' } })
    expect(screen.getByText('Body')).toBeInTheDocument()
  })

  it('shows body textarea when method is PATCH', () => {
    render(<RepeaterPage />)
    const selector = screen.getByRole('combobox')
    fireEvent.change(selector, { target: { value: 'PATCH' } })
    expect(screen.getByText('Body')).toBeInTheDocument()
  })

  it('switches to raw mode when RAW toggle is clicked', () => {
    render(<RepeaterPage />)
    fireEvent.click(screen.getByText('RAW'))
    expect(screen.getByText(/Raw HTTP/)).toBeInTheDocument()
  })

  it('shows empty state in response area by default', () => {
    render(<RepeaterPage />)
    expect(screen.getByText('Hit FIRE to send request')).toBeInTheDocument()
  })

  it('displays error when URL is empty on fire', () => {
    render(<RepeaterPage />)
    const urlInput = screen.getByPlaceholderText('https://target.com/path')
    fireEvent.change(urlInput, { target: { value: '' } })
    fireEvent.click(screen.getByText('▸ FIRE'))
    expect(screen.getByText('URL is required')).toBeInTheDocument()
  })

  it('displays error when URL does not start with http', () => {
    render(<RepeaterPage />)
    const urlInput = screen.getByPlaceholderText('https://target.com/path')
    fireEvent.change(urlInput, { target: { value: 'ftp://bad.com' } })
    fireEvent.click(screen.getByText('▸ FIRE'))
    expect(screen.getByText('URL must start with http:// or https://')).toBeInTheDocument()
  })

  it('shows loading state while sending', () => {
    // Mock electronAPI to return a promise that never resolves during test
    const mockMakeHttpRequest = vi.fn(() => new Promise(() => {}))
    ;(window as unknown as Record<string, unknown>).electronAPI = { makeHttpRequest: mockMakeHttpRequest }

    render(<RepeaterPage />)
    fireEvent.click(screen.getByText('▸ FIRE'))
    expect(screen.getByText(/SENDING/)).toBeInTheDocument()
  })

  it('FIRE button text changes to SENDING while request is in flight', () => {
    const mockMakeHttpRequest = vi.fn(() => new Promise(() => {}))
    ;(window as unknown as Record<string, unknown>).electronAPI = { makeHttpRequest: mockMakeHttpRequest }

    render(<RepeaterPage />)
    fireEvent.click(screen.getByText('▸ FIRE'))
    const fireBtn = screen.getByText('▸ SENDING...')
    expect(fireBtn).toBeInTheDocument()
  })
})
