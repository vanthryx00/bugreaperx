import { WalletLedger } from '../components/wallet/WalletLedger'
import { cn } from '../lib/utils'

export function WalletPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-hacker-text-bright font-mono tracking-wide">▸ WALLET</h1>
        <p className="text-sm text-hacker-text-dim mt-1 font-mono">Financial tracking · Program earnings · Ledger</p>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="hacker-card p-3">
          <p className="text-[10px] font-mono text-hacker-text-dim">Total Earned</p>
          <p className="text-lg font-bold font-mono text-hacker-green">$8,300</p>
          <p className="text-[8px] font-mono text-hacker-green/60 mt-1">+$2,450 this month</p>
        </div>
        <div className="hacker-card p-3">
          <p className="text-[10px] font-mono text-hacker-text-dim">Pending Payout</p>
          <p className="text-lg font-bold font-mono text-hacker-amber">$1,500</p>
          <p className="text-[8px] font-mono text-hacker-amber/60 mt-1">2 submissions</p>
        </div>
        <div className="hacker-card p-3">
          <p className="text-[10px] font-mono text-hacker-text-dim">Programs</p>
          <p className="text-lg font-bold font-mono text-hacker-cyan">4</p>
          <p className="text-[8px] font-mono text-hacker-cyan/60 mt-1">Across 3 platforms</p>
        </div>
        <div className="hacker-card p-3">
          <p className="text-[10px] font-mono text-hacker-text-dim">Avg Payout</p>
          <p className="text-lg font-bold font-mono text-hacker-purple">$1,660</p>
          <p className="text-[8px] font-mono text-hacker-purple/60 mt-1">Per finding</p>
        </div>
        <div className="hacker-card p-3">
          <p className="text-[10px] font-mono text-hacker-text-dim">This Week</p>
          <p className="text-lg font-bold font-mono text-hacker-amber">$800</p>
          <p className="text-[8px] font-mono text-hacker-amber/60 mt-1">+22% vs last week</p>
        </div>
      </div>

      {/* Platform breakdown */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { platform: 'HackerOne', color: 'text-hacker-green', bg: 'bg-hacker-green/10', earnings: 3000, count: 2, pending: 0 },
          { platform: 'Bugcrowd', color: 'text-hacker-amber', bg: 'bg-hacker-amber/10', earnings: 1500, count: 1, pending: 1500 },
          { platform: 'Intigriti', color: 'text-hacker-cyan', bg: 'bg-hacker-cyan/10', earnings: 800, count: 1, pending: 0 },
          { platform: 'Self-Managed', color: 'text-hacker-purple', bg: 'bg-hacker-purple/10', earnings: 3000, count: 1, pending: 0 },
        ].map(p => (
          <div key={p.platform} className={cn('hacker-card p-3 text-center')}>
            <p className={cn('text-xs font-bold font-mono', p.color)}>{p.platform}</p>
            <p className="text-lg font-bold font-mono text-hacker-text mt-1">${p.earnings.toLocaleString()}</p>
            <p className="text-[8px] font-mono text-hacker-text-dim/50">{p.count} findings · ${p.pending} pending</p>
          </div>
        ))}
      </div>

      {/* Ledger */}
      <WalletLedger />
    </div>
  )
}
