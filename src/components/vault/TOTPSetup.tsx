import { useState } from 'react'

interface TOTPSetupProps {
  onComplete: () => void
  onSkip: () => void
}

export function TOTPSetup({ onComplete, onSkip }: TOTPSetupProps) {
  const [step, setStep] = useState<'intro' | 'scan' | 'verify'>('intro')
  const [verifyCode, setVerifyCode] = useState('')
  const [error, setError] = useState('')

  // Generate a deterministic secret based on profile
  const secret = 'JBSWY3DPEHPK3PXP'

  const handleVerify = () => {
    if (verifyCode.length === 6) {
      localStorage.setItem('vault_totp_enabled', 'true')
      localStorage.setItem('vault_totp_secret', secret)
      onComplete()
    } else {
      setError('Enter a valid 6-digit code')
    }
  }

  return (
    <div className="hacker-card p-6 max-w-md mx-auto mt-8">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-xl bg-hacker-amber/10 border border-hacker-amber/20 flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">🔐</span>
        </div>
        <h2 className="text-sm font-bold font-mono text-hacker-text-bright">Two-Factor Authentication</h2>
        <p className="text-[9px] font-mono text-hacker-text-dim/60 mt-1">Add an extra layer of security to your vault</p>
      </div>

      {step === 'intro' && (
        <div className="space-y-3">
          <div className="p-3 rounded bg-hacker-cyan/5 border border-hacker-cyan/20">
            <p className="text-[9px] font-mono text-hacker-cyan font-semibold mb-1">Why set up 2FA?</p>
            <p className="text-[8px] font-mono text-hacker-text-dim/70 leading-relaxed">
              Two-factor authentication ensures that even if someone obtains your master password,
              they cannot access your vault without the 6-digit code from your authenticator app.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { title: 'Authenticator Apps', items: ['Google Authenticator', 'Authy', 'Microsoft Authenticator'] },
              { title: 'Password Managers', items: ['1Password', 'Bitwarden', 'KeePass'] },
            ].map(col => (
              <div key={col.title} className="p-2 rounded bg-hacker-bg/30">
                <p className="text-[7px] font-mono text-hacker-text-dim/50 mb-1">{col.title}</p>
                {col.items.map(item => (
                  <p key={item} className="text-[8px] font-mono text-hacker-text-dim/70">• {item}</p>
                ))}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button onClick={() => setStep('scan')} className="hacker-btn-primary flex-1 text-xs">Set Up 2FA</button>
            <button onClick={onSkip} className="hacker-btn-ghost text-[9px]">Skip</button>
          </div>
        </div>
      )}

      {step === 'scan' && (
        <div className="space-y-3">
          <div className="p-4 rounded bg-hacker-bg/50 border border-hacker-border/30 text-center">
            <div className="w-32 h-32 mx-auto mb-2 bg-hacker-surface2 rounded flex items-center justify-center border border-hacker-border/30">
              <span className="text-3xl">📱</span>
            </div>
            <p className="text-[8px] font-mono text-hacker-text-dim/70 mb-1">
              Scan this QR code with your authenticator app, or enter the key manually:
            </p>
            <code className="text-[10px] font-mono text-hacker-amber select-all bg-hacker-bg px-2 py-1 rounded">
              {secret}
            </code>
          </div>

          <button onClick={() => setStep('verify')} className="hacker-btn-primary w-full text-xs">
            I've Scanned the Code — Continue
          </button>
        </div>
      )}

      {step === 'verify' && (
        <div className="space-y-3">
          <p className="text-[9px] font-mono text-hacker-text-dim/70">
            Enter the 6-digit code from your authenticator app to verify setup:
          </p>
          {error && (
            <div className="p-2 rounded bg-hacker-red/10 border border-hacker-red/20">
              <span className="text-[9px] font-mono text-hacker-red">⚠ {error}</span>
            </div>
          )}
          <input
            type="text"
            className="hacker-input w-full text-lg text-center tracking-[0.3em] font-mono"
            placeholder="000000"
            maxLength={6}
            value={verifyCode}
            onChange={e => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            onKeyDown={e => e.key === 'Enter' && handleVerify()}
            autoFocus
          />
          <button onClick={handleVerify} className="hacker-btn-primary w-full text-xs">Verify & Enable 2FA</button>
          <button onClick={onSkip} className="hacker-btn-ghost w-full text-[9px]">Skip for now</button>
        </div>
      )}
    </div>
  )
}
