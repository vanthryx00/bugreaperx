import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PipelinePage } from '../pages/Pipeline'

describe('PipelinePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the pipeline header', () => {
    render(<PipelinePage />)
    expect(screen.getByText('▸ PIPELINE')).toBeInTheDocument()
  })

  it('renders initial earnings stat', () => {
    render(<PipelinePage />)
    expect(screen.getByText('$5,300')).toBeInTheDocument() // 2500 + 800 + 1500 + 500
    expect(screen.getByText(/Pending: \$3,300/)).toBeInTheDocument()
  })

  it('opens the report form when clicking New Submission', () => {
    render(<PipelinePage />)
    fireEvent.click(screen.getByText('+ New Submission'))
    expect(screen.getByText('+ New Report')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/e.g., SQL Injection/)).toBeInTheDocument()
    expect(screen.getByText('Commit to DB')).toBeInTheDocument()
  })

  it('adds a new submission when the form is submitted with title and URL', () => {
    render(<PipelinePage />)
    fireEvent.click(screen.getByText('+ New Submission'))

    const titleInput = screen.getByPlaceholderText(/e.g., SQL Injection/)
    fireEvent.change(titleInput, { target: { value: 'Test XSS finding' } })

    const urlInput = screen.getByPlaceholderText('https://target.com/vulnerable')
    fireEvent.change(urlInput, { target: { value: 'https://example.com/xss' } })

    fireEvent.click(screen.getByText('Commit to DB'))

    expect(screen.getByText('Test XSS finding')).toBeInTheDocument()
  })

  it('does not add submission when title is missing', () => {
    render(<PipelinePage />)
    fireEvent.click(screen.getByText('+ New Submission'))

    const urlInput = screen.getByPlaceholderText('https://target.com/vulnerable')
    fireEvent.change(urlInput, { target: { value: 'https://example.com/test' } })

    fireEvent.click(screen.getByText('Commit to DB'))

    // Original submissions should remain
    expect(screen.getByText('SQL Injection in login endpoint')).toBeInTheDocument()
  })

  it('filters submissions by severity', () => {
    render(<PipelinePage />)
    // Click the "critical" severity header row
    const criticalElements = screen.getAllByText('critical')
    fireEvent.click(criticalElements[0])

    expect(screen.getByText('SQL Injection in login endpoint')).toBeInTheDocument()
    expect(screen.queryByText('Open redirect')).not.toBeInTheDocument()
  })

  it('filters submissions by status when status pills are clicked', () => {
    render(<PipelinePage />)
    const draftPills = screen.getAllByText('draft')
    // The first 'draft' should be the filter pill
    const filterPill = draftPills.find(el => el.tagName === 'BUTTON')
    if (filterPill) fireEvent.click(filterPill)

    expect(screen.getByText('XSS in user profile')).toBeInTheDocument()
    expect(screen.queryByText('SQL Injection in login endpoint')).not.toBeInTheDocument()
  })

  it('clears filters when clear button is clicked', () => {
    render(<PipelinePage />)
    const draftPills = screen.getAllByText('draft')
    const filterPill = draftPills.find(el => el.tagName === 'BUTTON')
    if (filterPill) fireEvent.click(filterPill)

    const clearButton = screen.getByText('✕ clear')
    fireEvent.click(clearButton)

    expect(screen.getByText('SQL Injection in login endpoint')).toBeInTheDocument()
    expect(screen.getByText('XSS in user profile')).toBeInTheDocument()
    expect(screen.getByText('Open redirect')).toBeInTheDocument()
  })

  it('shows severity breakdown labels', () => {
    render(<PipelinePage />)
    expect(screen.getAllByText('critical').length).toBeGreaterThan(0)
    expect(screen.getAllByText('high').length).toBeGreaterThan(0)
    expect(screen.getAllByText('medium').length).toBeGreaterThan(0)
    expect(screen.getAllByText('low').length).toBeGreaterThan(0)
    expect(screen.getAllByText('info').length).toBeGreaterThan(0)
  })

  it('closes the form when Cancel is clicked', () => {
    render(<PipelinePage />)
    fireEvent.click(screen.getByText('+ New Submission'))
    expect(screen.getByText('+ New Report')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Cancel'))
    expect(screen.queryByText('+ New Report')).not.toBeInTheDocument()
  })

  it('shows correct bounty amounts in the table', () => {
    render(<PipelinePage />)
    expect(screen.getByText('$2,500')).toBeInTheDocument()
    expect(screen.getByText('$800')).toBeInTheDocument()
    expect(screen.getByText('$1,500')).toBeInTheDocument()
    expect(screen.getByText('$500')).toBeInTheDocument()
  })

  it('shows count for submissions without bounty', () => {
    render(<PipelinePage />)
    const dashes = screen.getAllByText('—')
    expect(dashes.length).toBeGreaterThanOrEqual(1)
  })

  it('shows status for all mock submissions', () => {
    render(<PipelinePage />)
    const submittedElements = screen.getAllByText('submitted')
    expect(submittedElements.length).toBeGreaterThanOrEqual(2)
    const acceptedElements = screen.getAllByText('accepted')
    expect(acceptedElements.length).toBeGreaterThanOrEqual(1)
    const paidElements = screen.getAllByText('paid')
    expect(paidElements.length).toBeGreaterThanOrEqual(1)
  })

  it('shows platform names in the table', () => {
    render(<PipelinePage />)
    const hackeroneElements = screen.getAllByText(/hackerone/)
    expect(hackeroneElements.length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText(/bugcrowd/)).toBeInTheDocument()
    expect(screen.getByText(/intigriti/)).toBeInTheDocument()
    expect(screen.getByText(/self-managed/)).toBeInTheDocument()
  })
})
