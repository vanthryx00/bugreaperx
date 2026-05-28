export function ReportsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-hacker-text-bright font-mono tracking-wide">▸ REPORTS</h1>
        <p className="text-sm text-hacker-text-dim mt-1 font-mono">Report generation · Templates · Export</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="hacker-card p-4 col-span-2">
          <h3 className="text-xs font-semibold text-hacker-green font-mono mb-3">GENERATE REPORT</h3>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-mono text-hacker-text-dim block mb-1">Report Type</label>
              <select className="hacker-input w-full">
                <option>Bug Bounty Submission</option>
                <option>Pentest Report</option>
                <option>Scope Analysis</option>
                <option>Vulnerability Assessment</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-mono text-hacker-text-dim block mb-1">Template</label>
              <select className="hacker-input w-full">
                <option>Standard Markdown</option>
                <option>HackerOne Format</option>
                <option>Bugcrowd Format</option>
                <option>Custom</option>
              </select>
            </div>
            <button className="hacker-btn-primary text-xs">Generate Report</button>
          </div>
        </div>
        <div className="hacker-card p-4">
          <h3 className="text-xs font-semibold text-hacker-amber font-mono mb-3">RECENT</h3>
          <div className="space-y-2 text-[10px] font-mono text-hacker-text-dim">
            <p>SQLi report — draft</p>
            <p>XSS report — draft</p>
            <p>Scope analysis — completed</p>
          </div>
        </div>
      </div>
    </div>
  )
}
