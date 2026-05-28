import { CollabEditor } from '../components/collab/CollabEditor'

export function CollabPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-hacker-text-bright font-mono tracking-wide flex items-center gap-2">
            <span className="text-hacker-cyan">◎</span>
            <span>▸ COLLAB LAB</span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-hacker-cyan/10 text-hacker-cyan border border-hacker-cyan/20">LIVE</span>
          </h1>
          <p className="text-sm text-hacker-text-dim mt-1 font-mono">
            Real-time collaborative coding · Peer cursors · Shared terminal · Team recon sessions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-hacker-green animate-pulse" />
          <span className="text-[10px] font-mono text-hacker-green">Session active</span>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Connection', value: 'P2P Mesh', icon: '◎', color: 'text-hacker-green' },
          { label: 'Latency', value: '~12ms', icon: '⚡', color: 'text-hacker-cyan' },
          { label: 'Peers Online', value: '3', icon: '◉', color: 'text-hacker-amber' },
          { label: 'Snippets', value: 'Shared', icon: '◈', color: 'text-hacker-purple' },
        ].map((stat) => (
          <div key={stat.label} className="hacker-card p-3">
            <p className="text-[10px] text-hacker-text-dim font-mono uppercase tracking-wider">{stat.label}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-lg font-bold font-mono ${stat.color}`}>{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Collab Editor */}
      <CollabEditor />

      {/* Instructions */}
      <div className="hacker-card p-4 border-hacker-cyan/20 bg-hacker-cyan/5">
        <div className="flex items-start gap-3">
          <span className="text-hacker-cyan text-lg mt-0.5">◎</span>
          <div className="flex-1">
            <p className="text-[10px] font-mono text-hacker-cyan font-semibold">HOW TO COLLABORATE</p>
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div>
                <p className="text-[8px] font-mono text-hacker-text-dim/70 font-semibold">1. Start Coding</p>
                <p className="text-[7px] font-mono text-hacker-text-dim/50 mt-0.5">Write or paste code in the editor. Changes sync in real-time to all connected peers.</p>
              </div>
              <div>
                <p className="text-[8px] font-mono text-hacker-text-dim/70 font-semibold">2. Invite Peers</p>
                <p className="text-[7px] font-mono text-hacker-text-dim/50 mt-0.5">Click "Invite" to copy a session link. Share it with your team to collaborate live.</p>
              </div>
              <div>
                <p className="text-[8px] font-mono text-hacker-text-dim/70 font-semibold">3. Chat & Execute</p>
                <p className="text-[7px] font-mono text-hacker-text-dim/50 mt-0.5">Use the chat panel to discuss changes. Output appears in the shared terminal log.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
