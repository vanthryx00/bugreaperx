import { useState, useMemo } from 'react'
import { cn } from '../lib/utils'

interface ReportForm {
  title: string
  affectedUrl: string
  impact: string
  program: string
  vulnType: string
  reward: string
  medium: string
  cvss: string
  draftCvss: string
}

interface Submission {
  id: number
  title: string
  platform: 'hackerone' | 'bugcrowd' | 'intigriti' | 'self-managed'
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  status: 'draft' | 'submitted' | 'accepted' | 'rejected' | 'paid'
  bounty: number | null
  date: string
}

const severityColors: Record<string, string> = {
  critical: 'bg-hacker-red/10 text-hacker-red border-hacker-red/20',
  high: 'bg-hacker-amber/10 text-hacker-amber border-hacker-amber/20',
  medium: 'bg-hacker-cyan/10 text-hacker-cyan border-hacker-cyan/20',
  low: 'bg-hacker-text-dim/10 text-hacker-text-dim border-hacker-text-dim/20',
  info: 'bg-hacker-purple/10 text-hacker-purple border-hacker-purple/20',
}

const statusColors: Record<string, string> = {
  draft: 'text-hacker-text-dim',
  submitted: 'text-hacker-cyan',
  accepted: 'text-hacker-green',
  rejected: 'text-hacker-red',
  paid: 'text-hacker-amber',
}

export function PipelinePage() {
  const [form, setForm] = useState<ReportForm>({
    title: '', affectedUrl: '', impact: '', program: '',
    vulnType: '', reward: '', medium: '', cvss: '', draftCvss: '',
  })
  const [showForm, setShowForm] = useState(false)
  const [submissions, setSubmissions] = useState<Submission[]>([
    { id: 1, title: 'SQL Injection in login endpoint', platform: 'hackerone', severity: 'critical', status: 'submitted', bounty: 2500, date: '2026-05-27' },
    { id: 2, title: 'XSS in user profile', platform: 'bugcrowd', severity: 'high', status: 'draft', bounty: null, date: '2026-05-26' },
    { id: 3, title: 'IDOR in payment API', platform: 'intigriti', severity: 'medium', status: 'submitted', bounty: 800, date: '2026-05-25' },
    { id: 4, title: 'Subdomain takeover', platform: 'self-managed', severity: 'high', status: 'accepted', bounty: 1500, date: '2026-05-24' },
    { id: 5, title: 'Open redirect', platform: 'hackerone', severity: 'low', status: 'paid', bounty: 500, date: '2026-05-23' },
  ])
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  const stats = useMemo(() => {
    const totalEarnings = submissions.reduce((s, sub) => s + (sub.bounty || 0), 0)
    const pending = submissions.filter(s => s.status === 'submitted').reduce((s, sub) => s + (sub.bounty || 0), 0)
    const drafts = submissions.filter(s => s.status === 'draft').length
    const submitted = submissions.filter(s => s.status === 'submitted').length
    const bySeverity = {
      critical: submissions.filter(s => s.severity === 'critical').length,
      high: submissions.filter(s => s.severity === 'high').length,
      medium: submissions.filter(s => s.severity === 'medium').length,
      low: submissions.filter(s => s.severity === 'low').length,
      info: submissions.filter(s => s.severity === 'info').length,
    }
    const paid = submissions.filter(s => s.status === 'paid').length
    return { totalEarnings, pending, drafts, submitted, bySeverity, paid, total: submissions.length }
  }, [submissions])

  const filteredSubmissions = useMemo(() => {
    return submissions.filter(s => {
      if (filterSeverity && s.severity !== filterSeverity) return false
      if (filterStatus && s.status !== filterStatus) return false
      return true
    })
  }, [submissions, filterSeverity, filterStatus])

  const handleSubmitReport = () => {
    if (!form.title.trim() || !form.affectedUrl.trim()) return
    const newSub: Submission = {
      id: Date.now(),
      title: form.title,
      platform: 'self-managed',
      severity: 'medium',
      status: 'draft',
      bounty: form.reward ? parseInt(form.reward) : null,
      date: new Date().toISOString().split('T')[0],
    }
    setSubmissions([newSub, ...submissions])
    setForm({ title: '', affectedUrl: '', impact: '', program: '', vulnType: '', reward: '', medium: '', cvss: '', draftCvss: '' })
    setShowForm(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-hacker-text-bright font-mono tracking-wide">▸ PIPELINE</h1>
          <p className="text-sm text-hacker-text-dim mt-1 font-mono">Submissions · Earnings tracker · Wallet</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="hacker-btn-primary text-xs"
        >
          + New Submission
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4">
        <div className="hacker-card p-3">
          <p className="text-[10px] text-hacker-text-dim font-mono">Total Earnings</p>
          <p className="text-lg font-bold font-mono text-hacker-green">${stats.totalEarnings.toLocaleString()}</p>
          <p className="text-[9px] font-mono text-hacker-text-dim/50">Pending: ${stats.pending.toLocaleString()}</p>
        </div>
        <div className="hacker-card p-3">
          <p className="text-[10px] text-hacker-text-dim font-mono">Submissions</p>
          <p className="text-lg font-bold font-mono text-hacker-cyan">{stats.submitted}</p>
          <p className="text-[9px] font-mono text-hacker-text-dim/50">Submitted</p>
        </div>
        <div className="hacker-card p-3">
          <p className="text-[10px] text-hacker-text-dim font-mono">Drafts</p>
          <p className="text-lg font-bold font-mono text-hacker-amber">{stats.drafts}</p>
          <p className="text-[9px] font-mono text-hacker-text-dim/50">Awaiting submission</p>
        </div>
        <div className="hacker-card p-3">
          <p className="text-[10px] text-hacker-text-dim font-mono">Paid</p>
          <p className="text-lg font-bold font-mono text-hacker-purple">{stats.paid}</p>
          <p className="text-[9px] font-mono text-hacker-text-dim/50">Total accepted</p>
        </div>
      </div>

      {/* Severity Breakdown */}
      <div className="grid grid-cols-5 gap-2">
        {(['critical', 'high', 'medium', 'low', 'info'] as const).map(sev => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(filterSeverity === sev ? null : sev)}
            className={cn(
              'hacker-card p-3 text-center transition-all',
              filterSeverity === sev ? 'border-hacker-green/50 bg-hacker-green/5' : ''
            )}
          >
            <p className={cn('text-lg font-bold font-mono', severityColors[sev].split(' ')[1])}>{stats.bySeverity[sev]}</p>
            <p className="text-[9px] font-mono text-hacker-text-dim capitalize">{sev}</p>
          </button>
        ))}
      </div>

      {/* Report Form */}
      {showForm && (
        <div className="hacker-card p-4 border-hacker-green/30">
          <h3 className="text-xs font-semibold text-hacker-green font-mono mb-3">+ New Report</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-[10px] font-mono text-hacker-text-dim block mb-1">Title *</label>
              <input className="hacker-input w-full" placeholder="e.g., SQL Injection in login endpoint" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="text-[10px] font-mono text-hacker-text-dim block mb-1">Affected URL</label>
              <input className="hacker-input w-full" placeholder="https://target.com/vulnerable" value={form.affectedUrl} onChange={e => setForm({ ...form, affectedUrl: e.target.value })} />
            </div>
            <div>
              <label className="text-[10px] font-mono text-hacker-text-dim block mb-1">Program</label>
              <select className="hacker-input w-full" value={form.program} onChange={e => setForm({ ...form, program: e.target.value })}>
                <option value="">Select program</option>
                <option value="hackerone">HackerOne</option>
                <option value="bugcrowd">Bugcrowd</option>
                <option value="intigriti">Intigriti</option>
                <option value="self">Self-Managed</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-mono text-hacker-text-dim block mb-1">Vulnerability Type</label>
              <select className="hacker-input w-full" value={form.vulnType} onChange={e => setForm({ ...form, vulnType: e.target.value })}>
                <option value="">Select type</option>
                <option value="sqli">SQL Injection</option>
                <option value="xss">Cross-Site Scripting (XSS)</option>
                <option value="csfr">CSRF</option>
                <option value="idor">IDOR</option>
                <option value="rce">RCE</option>
                <option value="lfi">LFI/RFI</option>
                <option value="ssrf">SSRF</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-mono text-hacker-text-dim block mb-1">Reward $</label>
              <input className="hacker-input w-full" type="number" placeholder="2500" value={form.reward} onChange={e => setForm({ ...form, reward: e.target.value })} />
            </div>
            <div>
              <label className="text-[10px] font-mono text-hacker-text-dim block mb-1">CVSS Score</label>
              <input className="hacker-input w-full" placeholder="7.5" value={form.cvss} onChange={e => setForm({ ...form, cvss: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="text-[10px] font-mono text-hacker-text-dim block mb-1">Impact / Summary</label>
              <textarea className="hacker-input w-full h-24 resize-none" placeholder="Describe the vulnerability and its impact..." value={form.impact} onChange={e => setForm({ ...form, impact: e.target.value })} />
            </div>
            <div className="col-span-2 flex gap-2">
              <button onClick={handleSubmitReport} className="hacker-btn-primary text-xs">Commit to DB</button>
              <button onClick={() => setShowForm(false)} className="hacker-btn-ghost text-xs">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-1.5">
        <span className="text-[10px] font-mono text-hacker-text-dim mr-1">Filter:</span>
        {['draft', 'submitted', 'accepted', 'rejected', 'paid'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(filterStatus === status ? null : status)}
            className={cn(
              'px-2 py-0.5 rounded text-[10px] font-mono transition-colors border',
              filterStatus === status
                ? 'bg-hacker-green/10 text-hacker-green border-hacker-green/30'
                : 'bg-hacker-surface2 text-hacker-text-dim border-hacker-border hover:text-hacker-text'
            )}
          >
            {status}
          </button>
        ))}
        {(filterSeverity || filterStatus) && (
          <button
            onClick={() => { setFilterSeverity(null); setFilterStatus(null) }}
            className="px-2 py-0.5 rounded text-[10px] font-mono text-hacker-red/70 hover:text-hacker-red"
          >
            ✕ clear
          </button>
        )}
      </div>

      {/* Submissions Table */}
      <div className="hacker-card overflow-hidden">
        <div className="px-4 py-2 border-b border-hacker-border bg-hacker-surface2/50">
          <div className="grid grid-cols-6 gap-4 text-[10px] font-mono text-hacker-text-dim uppercase tracking-wider">
            <span className="col-span-2">Finding</span>
            <span>Severity</span>
            <span>Status</span>
            <span>Bounty</span>
            <span className="text-right">Date</span>
          </div>
        </div>
        <div className="divide-y divide-hacker-border max-h-96 overflow-y-auto">
          {filteredSubmissions.length === 0 ? (
            <div className="px-4 py-8 text-center text-[10px] font-mono text-hacker-text-dim/50">
              No submissions match the filter
            </div>
          ) : filteredSubmissions.map(sub => (
            <div key={sub.id} className="px-4 py-3 hover:bg-hacker-surface2 transition-colors group">
              <div className="grid grid-cols-6 gap-4 items-center">
                <div className="col-span-2">
                  <p className="text-xs font-mono text-hacker-text truncate group-hover:text-hacker-green transition-colors">{sub.title}</p>
                  <p className="text-[10px] text-hacker-text-dim font-mono">{sub.date} · {sub.platform}</p>
                </div>
                <span className={cn('text-[10px] font-mono px-1.5 py-0.5 rounded w-fit border', severityColors[sub.severity])}>
                  {sub.severity}
                </span>
                <span className={cn('text-[10px] font-mono', statusColors[sub.status])}>
                  {sub.status}
                </span>
                <span className="text-xs font-mono text-hacker-amber">
                  {sub.bounty ? `$${sub.bounty.toLocaleString()}` : '—'}
                </span>
                <span className="text-[10px] font-mono text-hacker-text-dim text-right">
                  {sub.status === 'draft' ? (
                    <button className="text-hacker-cyan hover:text-hacker-green transition-colors">Submit →</button>
                  ) : sub.status === 'paid' ? (
                    <span className="text-hacker-green">✓ Paid</span>
                  ) : (
                    <span className="text-hacker-text-dim">—</span>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
