import { useState } from 'react'
import { cn } from '../../lib/utils'

const REPORT_TEMPLATES = [
  { id: 'standard', name: 'Standard Markdown', description: 'Clean markdown format with sections' },
  { id: 'hackerone', name: 'HackerOne Format', description: 'HackerOne submission template' },
  { id: 'bugcrowd', name: 'Bugcrowd Format', description: 'Bugcrowd vulnerability report' },
  { id: 'pentest', name: 'Pentest Report', description: 'Full pentest engagement report' },
  { id: 'custom', name: 'Custom Template', description: 'User-defined template' },
]

const DEMO_FINDINGS = [
  { id: 'f1', title: 'SQL Injection in login endpoint', severity: 'critical', endpoint: '/api/login', status: 'selected' },
  { id: 'f2', title: 'XSS in user profile bio', severity: 'high', endpoint: '/profile/update', status: 'selected' },
  { id: 'f3', title: 'IDOR in payment API', severity: 'medium', endpoint: '/api/payment/status', status: 'available' },
  { id: 'f4', title: 'Subdomain takeover', severity: 'high', endpoint: 'admin.example.com', status: 'available' },
]

const severityColors: Record<string, string> = {
  critical: 'text-hacker-red bg-hacker-red/10',
  high: 'text-hacker-amber bg-hacker-amber/10',
  medium: 'text-hacker-cyan bg-hacker-cyan/10',
  low: 'text-hacker-text-dim bg-hacker-text-dim/10',
}

const DEMO_OUTPUT = `# Vulnerability Report

**Target:** target.example.com
**Generated:** ${new Date().toLocaleDateString()}
**Template:** Standard Markdown

---

## Executive Summary

During a security assessment of target.example.com, 2 vulnerabilities were identified:
- 1 Critical: SQL Injection
- 1 High: Cross-Site Scripting (XSS)

---

## Findings

### 1. SQL Injection in login endpoint

**Severity:** Critical
**Endpoint:** /api/login
**CVSS:** 9.1

**Description:**
The login endpoint is vulnerable to SQL injection via the email parameter.

**Steps to Reproduce:**
1. Navigate to https://target.example.com/login
2. Intercept the request with Burp Suite
3. Inject: ' OR '1'='1

**Impact:**
An attacker can bypass authentication and gain unauthorized access.

---

## Recommendations
1. Use parameterized queries
2. Implement input validation
3. Deploy WAF rules
`

export function ReportEditor() {
  const [template, setTemplate] = useState('standard')
  const [title, setTitle] = useState('')
  const [target, setTarget] = useState('')
  const [content, setContent] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [findings, setFindings] = useState(DEMO_FINDINGS)

  const generateReport = () => {
    setGenerating(true)
    setTimeout(() => {
      setContent(DEMO_OUTPUT)
      setGenerating(false)
    }, 800)
  }

  const copyReport = () => {
    navigator.clipboard.writeText(content || DEMO_OUTPUT)
  }

  const toggleFinding = (id: string) => {
    setFindings(prev => prev.map(f => f.id === id ? { ...f, status: f.status === 'selected' ? 'available' : 'selected' } : f))
  }

  return (
    <div className="space-y-4">
      {/* Report config */}
      <div className="hacker-card p-4">
        <h3 className="text-xs font-semibold text-hacker-green font-mono mb-3">▸ Report Generator</h3>
        <div className="grid grid-cols-4 gap-3">
          <div>
            <label className="text-[9px] font-mono text-hacker-text-dim block mb-1">Report Title</label>
            <input className="hacker-input w-full text-xs" placeholder="Security Assessment Report" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="text-[9px] font-mono text-hacker-text-dim block mb-1">Target</label>
            <input className="hacker-input w-full text-xs" placeholder="target.example.com" value={target} onChange={e => setTarget(e.target.value)} />
          </div>
          <div>
            <label className="text-[9px] font-mono text-hacker-text-dim block mb-1">Template</label>
            <select className="hacker-input w-full text-xs" value={template} onChange={e => setTemplate(e.target.value)}>
              {REPORT_TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button onClick={generateReport} disabled={generating} className="hacker-btn-primary text-xs disabled:opacity-30 h-8">
              {generating ? '◉ Generating...' : '▸ Generate'}
            </button>
            <button onClick={() => setShowPreview(!showPreview)} className={cn('hacker-btn-ghost text-xs h-8', showPreview && 'text-hacker-green')}>
              {showPreview ? 'Edit' : 'Preview'}
            </button>
          </div>
        </div>
      </div>

      {/* Findings selector */}
      <div className="hacker-card p-3">
        <h4 className="text-[10px] font-semibold text-hacker-amber font-mono mb-2">Select Findings to Include</h4>
        <div className="flex flex-wrap gap-1.5">
          {findings.map(f => (
            <button
              key={f.id}
              onClick={() => toggleFinding(f.id)}
              className={cn(
                'text-[9px] font-mono px-1.5 py-0.5 rounded border transition-colors',
                f.status === 'selected'
                  ? 'bg-hacker-green/10 text-hacker-green border-hacker-green/30'
                  : 'bg-hacker-surface2 text-hacker-text-dim border-hacker-border hover:text-hacker-text'
              )}
            >
              <span className={cn('inline-block w-1.5 h-1.5 rounded-full mr-1', severityColors[f.severity].split(' ')[0])} />
              {f.title}
            </button>
          ))}
        </div>
      </div>

      {/* Editor / Preview */}
      <div className="hacker-card p-4">
        {showPreview ? (
          <div className="bg-hacker-bg rounded p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-96 text-hacker-text">
            {(content || DEMO_OUTPUT).split('---').map((section, i) => (
              <div key={i} className="mb-4">
                {section.split('\n').map((line, j) => {
                  if (line.startsWith('# ')) return <h1 key={j} className="text-sm font-bold text-hacker-green mb-2">{line.slice(2)}</h1>
                  if (line.startsWith('## ')) return <h2 key={j} className="text-xs font-bold text-hacker-cyan mt-3 mb-1">{line.slice(3)}</h2>
                  if (line.startsWith('### ')) return <h3 key={j} className="text-[11px] font-bold text-hacker-amber mt-2 mb-1">{line.slice(4)}</h3>
                  if (line.startsWith('**')) return <p key={j} className="text-hacker-text-dim/80 mt-2">{line}</p>
                  if (line.startsWith('- ')) return <li key={j} className="text-hacker-text-dim ml-4 list-disc">{line.slice(2)}</li>
                  if (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.')) return <li key={j} className="text-hacker-text-dim ml-4 list-decimal">{line.slice(3)}</li>
                  if (line.trim()) return <p key={j} className="text-hacker-text-dim/70">{line}</p>
                  return <br key={j} />
                })}
              </div>
            ))}
          </div>
        ) : (
          <textarea
            className="hacker-input w-full h-96 resize-none font-mono text-xs leading-relaxed"
            value={content || DEMO_OUTPUT}
            onChange={e => setContent(e.target.value)}
            spellCheck={false}
          />
        )}
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-2">
            <button onClick={copyReport} className="hacker-btn-primary text-[10px]">Copy to Clipboard</button>
            <button className="hacker-btn-ghost text-[10px]">Export PDF</button>
            <button className="hacker-btn-ghost text-[10px]">Export HTML</button>
          </div>
          <span className="text-[8px] font-mono text-hacker-text-dim/50">
            {content || DEMO_OUTPUT} · ~{((content || DEMO_OUTPUT).length / 1000).toFixed(1)}K chars
          </span>
        </div>
      </div>
    </div>
  )
}
