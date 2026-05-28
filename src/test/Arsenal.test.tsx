import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { ArsenalPage } from '../pages/Arsenal'

vi.mock('../data/arsenal', () => {
  const mockWeapons = [
    { id: 'subfinder-basic', name: 'subfinder-basic', description: 'Basic subdomain discovery', category: 'recon', command: 'subfinder -d {{DOMAIN}} -all', tags: ['subdomain', 'dns'] },
    { id: 'nuclei-critical', name: 'nuclei-critical', description: 'Run critical severity nuclei templates', category: 'vuln', command: 'nuclei -l alive.txt -severity critical', tags: ['nuclei', 'critical'] },
    { id: 'sqlmap', name: 'sqlmap', description: 'SQL injection detection', category: 'vuln', command: 'sqlmap -u "{{URL}}" --batch', tags: ['sqli', 'sqlmap'] },
    { id: 'aws-s3', name: 'aws-s3-list', description: 'List S3 bucket contents', category: 'cloud', command: 'aws s3 ls s3://{{BUCKET}}/', tags: ['aws', 's3'] },
    { id: 'wafw00f', name: 'wafw00f', description: 'WAF fingerprinting', category: 'waf', command: 'wafw00f https://{{TARGET}}', tags: ['waf', 'detect'] },
    { id: 'chain-full-recon', name: 'chain-full-recon', description: 'Full recon chain', category: 'chain', command: 'subfinder -d {{DOMAIN}} | httpx | nuclei', tags: ['chain', 'recon'] },
    { id: 'trufflehog-git', name: 'trufflehog-git', description: 'TruffleHog Git scan', category: 'secrets', command: 'trufflehog git https://github.com/{{ORG}}/{{REPO}}', tags: ['secrets', 'git'] },
  ]

  const mockCategories = [
    { id: 'recon', name: 'Recon', icon: '◎', color: 'text-hacker-green', targetCount: 71, count: 71 },
    { id: 'vuln', name: 'Vulnerability', icon: '⚔', color: 'text-hacker-red', targetCount: 79, count: 79 },
    { id: 'cloud', name: 'Cloud', icon: '◈', color: 'text-hacker-cyan', targetCount: 10, count: 10 },
    { id: 'waf', name: 'WAF', icon: '◎', color: 'text-hacker-purple', targetCount: 6, count: 6 },
    { id: 'chain', name: 'Chains', icon: '◉', color: 'text-hacker-red', targetCount: 7, count: 7 },
    { id: 'secrets', name: 'Secrets', icon: '◈', color: 'text-hacker-green', targetCount: 6, count: 6 },
  ]

  return { arsenalWeapons: mockWeapons, weaponCategories: mockCategories }
})

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
})

describe('ArsenalPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the arsenal header', () => {
    render(<ArsenalPage />)
    expect(screen.getByText('▸ ARSENAL')).toBeInTheDocument()
  })

  it('renders all weapon names in default Show All mode', () => {
    render(<ArsenalPage />)
    expect(screen.getByText('subfinder-basic')).toBeInTheDocument()
    expect(screen.getByText('nuclei-critical')).toBeInTheDocument()
    expect(screen.getByText('sqlmap')).toBeInTheDocument()
    expect(screen.getByText('aws-s3-list')).toBeInTheDocument()
    expect(screen.getByText('wafw00f')).toBeInTheDocument()
    expect(screen.getByText('chain-full-recon')).toBeInTheDocument()
    expect(screen.getByText('trufflehog-git')).toBeInTheDocument()
  })

  it('renders the ALL button', () => {
    render(<ArsenalPage />)
    expect(screen.getByText('ALL')).toBeInTheDocument()
  })

  it('shows total weapons stat', () => {
    render(<ArsenalPage />)
    const statCards = screen.getAllByText('7')
    expect(statCards.length).toBeGreaterThanOrEqual(1)
  })

  it('filters weapons by search query (name)', () => {
    render(<ArsenalPage />)
    const searchInput = screen.getByPlaceholderText(/Search weapons/)
    fireEvent.change(searchInput, { target: { value: 'sqlmap' } })
    expect(screen.getByText('sqlmap')).toBeInTheDocument()
    expect(screen.queryByText('subfinder-basic')).not.toBeInTheDocument()
  })

  it('filters weapons by search query (description)', () => {
    render(<ArsenalPage />)
    const searchInput = screen.getByPlaceholderText(/Search weapons/)
    fireEvent.change(searchInput, { target: { value: 'S3 bucket' } })
    expect(screen.getByText('aws-s3-list')).toBeInTheDocument()
    expect(screen.queryByText('subfinder-basic')).not.toBeInTheDocument()
  })

  it('filters weapons by search query (tag)', () => {
    render(<ArsenalPage />)
    const searchInput = screen.getByPlaceholderText(/Search weapons/)
    fireEvent.change(searchInput, { target: { value: 'sqli' } })
    expect(screen.getByText('sqlmap')).toBeInTheDocument()
    expect(screen.queryByText('wafw00f')).not.toBeInTheDocument()
  })

  it('toggles to Smart Hunt mode and shows filtered weapons', () => {
    render(<ArsenalPage />)
    const toggleButton = screen.getByText('◈ Show All')
    fireEvent.click(toggleButton)
    // Smart Hunt shows only recon, vuln, secrets, api categories
    expect(screen.getByText('◎ Smart Hunt')).toBeInTheDocument()
    expect(screen.getByText('subfinder-basic')).toBeInTheDocument()   // recon
    expect(screen.getByText('nuclei-critical')).toBeInTheDocument()   // vuln
    // Cloud weapons should NOT be visible in Smart Hunt
    expect(screen.queryByText('aws-s3-list')).not.toBeInTheDocument()
    // WAF should NOT be visible
    expect(screen.queryByText('wafw00f')).not.toBeInTheDocument()
  })

  it('copies command to clipboard when Copy button is clicked', async () => {
    render(<ArsenalPage />)
    const weaponName = screen.getByText('subfinder-basic')
    const card = weaponName.closest('[class*="hacker-card"]')
    if (card) fireEvent.click(card)
    else fireEvent.click(weaponName)

    const copyButton = screen.getByText('Copy')
    fireEvent.click(copyButton)

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('subfinder -d {{DOMAIN}} -all')
    expect(await screen.findByText('✓ Copied!')).toBeInTheDocument()
  })

  it('shows empty state when no weapons match search', () => {
    render(<ArsenalPage />)
    const searchInput = screen.getByPlaceholderText(/Search weapons/)
    fireEvent.change(searchInput, { target: { value: 'xyznonexistent999' } })
    expect(screen.getByText('No weapons match your search')).toBeInTheDocument()
  })

  it('clears search with clear button', () => {
    render(<ArsenalPage />)
    const searchInput = screen.getByPlaceholderText(/Search weapons/)
    fireEvent.change(searchInput, { target: { value: 'sqlmap' } })

    const clearButton = screen.getByText('✕')
    fireEvent.click(clearButton)

    expect(screen.getByText('subfinder-basic')).toBeInTheDocument()
  })

  it('toggles between Show All and Smart Hunt modes', () => {
    render(<ArsenalPage />)
    expect(screen.getByText('◈ Show All')).toBeInTheDocument()

    fireEvent.click(screen.getByText('◈ Show All'))
    expect(screen.getByText('◎ Smart Hunt')).toBeInTheDocument()

    fireEvent.click(screen.getByText('◎ Smart Hunt'))
    expect(screen.getByText('◈ Show All')).toBeInTheDocument()
  })
})
