import { useState } from 'react'
import { useGameStore } from '../../lib/game/store'

export function WalletPanel() {
  const hero = useGameStore(s => s.hero)
  const setScreen = useGameStore(s => s.setScreen)
  const [amount, setAmount] = useState('')
  const [action, setAction] = useState<'deposit' | 'withdraw' | null>(null)
  const [connected, setConnected] = useState(false)
  const [walletAddress] = useState('0x' + Array.from({ length: 40 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join(''))

  if (!hero) return null

  const handleConnect = () => {
    setConnected(true)
  }

  const handleTransaction = () => {
    if (!amount || parseFloat(amount) <= 0) return
    // Simulated transaction
    setAction(null)
    setAmount('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-hacker-bg/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-hacker-bg border border-hacker-border/50 rounded-xl p-6 shadow-[0_0_60px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-hacker-text-bright">Crypto Wallet</h2>
          <button
            onClick={() => setScreen('hub')}
            className="text-xs font-mono text-hacker-text-dim/50 hover:text-hacker-text-dim transition-colors"
          >
            ✕ Close
          </button>
        </div>

        {/* Wallet Status */}
        <div className="bg-hacker-bg/50 border border-hacker-border/30 rounded-lg p-4 mb-4">
          {connected ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-hacker-green animate-pulse" />
                <span className="text-xs font-mono text-hacker-green">Connected</span>
              </div>
              <p className="text-[10px] font-mono text-hacker-text-dim/50 truncate">
                {walletAddress}
              </p>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              className="w-full py-2 bg-hacker-cyan/10 border border-hacker-cyan/30 rounded-lg text-xs font-mono text-hacker-cyan hover:bg-hacker-cyan/20 transition-all"
            >
              Connect Wallet (MetaMask / Phantom)
            </button>
          )}
        </div>

        {/* Balance Display */}
        <div className="text-center mb-6">
          <div className="text-[10px] font-mono text-hacker-text-dim/50 mb-1">BALANCE</div>
          <div className="text-3xl font-bold text-hacker-green animate-pulse-glow">
            {hero.brxTokens.toLocaleString()}
          </div>
          <div className="text-xs font-mono text-hacker-text-dim/40">BRX Tokens</div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => setAction('deposit')}
            className={`py-2.5 rounded-lg text-xs font-mono border transition-all ${
              action === 'deposit'
                ? 'bg-hacker-green/10 border-hacker-green/50 text-hacker-green'
                : 'bg-hacker-bg border-hacker-border/30 text-hacker-text-dim hover:border-hacker-green/30'
            }`}
          >
            ↓ Deposit
          </button>
          <button
            onClick={() => setAction('withdraw')}
            className={`py-2.5 rounded-lg text-xs font-mono border transition-all ${
              action === 'withdraw'
                ? 'bg-hacker-red/10 border-hacker-red/50 text-hacker-red'
                : 'bg-hacker-bg border-hacker-border/30 text-hacker-text-dim hover:border-hacker-red/30'
            }`}
          >
            ↑ Withdraw
          </button>
        </div>

        {/* Transaction Input */}
        {action && (
          <div className="bg-hacker-bg/50 border border-hacker-border/20 rounded-lg p-4 mb-4">
            <label className="block text-[10px] font-mono text-hacker-text-dim/50 mb-2">
              {action === 'deposit' ? 'Deposit Amount (ETH/SOL/USDC)' : 'Withdraw Amount (BRX)'}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="flex-1 px-3 py-2 bg-hacker-bg border border-hacker-border/30 rounded text-xs font-mono text-hacker-text-bright placeholder:text-hacker-text-dim/20 focus:outline-none focus:border-hacker-green/50"
              />
              <button
                onClick={handleTransaction}
                disabled={!amount || parseFloat(amount) <= 0}
                className={`px-4 py-2 rounded text-xs font-mono font-bold ${
                  action === 'deposit'
                    ? 'bg-hacker-green text-hacker-bg hover:bg-hacker-green-dim'
                    : 'bg-hacker-red text-white hover:bg-red-700'
                } disabled:opacity-30 disabled:cursor-not-allowed transition-all`}
              >
                {action === 'deposit' ? 'Deposit' : 'Withdraw'}
              </button>
            </div>
            {action === 'withdraw' && (
              <p className="text-[9px] font-mono text-hacker-text-dim/30 mt-2">
                Withdrawal fee: 2.5% · Min: 10 BRX
              </p>
            )}
          </div>
        )}

        {/* Transaction History Placeholder */}
        <div className="border-t border-hacker-border/20 pt-4 mt-2">
          <div className="text-[10px] font-mono text-hacker-text-dim/40 mb-2">RECENT TRANSACTIONS</div>
          <div className="text-[10px] font-mono text-hacker-text-dim/20 text-center py-4">
            No transactions yet. Your bounty earnings will appear here.
          </div>
        </div>
      </div>
    </div>
  )
}
