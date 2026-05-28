import { ReportEditor } from '../components/reports-generator/ReportEditor'

export function ReportsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-hacker-text-bright font-mono tracking-wide">▸ REPORTS</h1>
        <p className="text-sm text-hacker-text-dim mt-1 font-mono">Report generation · Templates · Export · AI writing</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="hacker-card p-3">
          <p className="text-[10px] font-mono text-hacker-text-dim">Templates</p>
          <p className="text-lg font-bold font-mono text-hacker-green">5</p>
          <p className="text-[8px] font-mono text-hacker-text-dim/50">Standard · H1 · BC · Pentest · Custom</p>
        </div>
        <div className="hacker-card p-3">
          <p className="text-[10px] font-mono text-hacker-text-dim">Reports Generated</p>
          <p className="text-lg font-bold font-mono text-hacker-cyan">12</p>
          <p className="text-[8px] font-mono text-hacker-text-dim/50">This month</p>
        </div>
        <div className="hacker-card p-3">
          <p className="text-[10px] font-mono text-hacker-text-dim">AI Ready</p>
          <p className="text-lg font-bold font-mono text-hacker-amber">Ollama</p>
          <p className="text-[8px] font-mono text-hacker-amber/60">Not connected</p>
        </div>
        <div className="hacker-card p-3">
          <p className="text-[10px] font-mono text-hacker-text-dim">Export Formats</p>
          <p className="text-lg font-bold font-mono text-hacker-purple">3</p>
          <p className="text-[8px] font-mono text-hacker-text-dim/50">Markdown · PDF · HTML</p>
        </div>
      </div>

      {/* Report Editor */}
      <ReportEditor />
    </div>
  )
}
