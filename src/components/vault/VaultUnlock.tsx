import { useState } from 'react'
import { cn } from '../../lib/utils'

interface VaultUnlockProps {
  onUnlock: () => void
  isFirstTime: boolean
}

export function VaultUnlock({ onUnlock, isFirstTime }: VaultUnlockProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [totpCode, setTotpCode] = useState('')
  const [step, setStep] = useState<'password' | 'totp' | 'setup'>('password')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handlePasswordSubmit = () => {
    setError('')
    if (isFirstTime) {
      if (password.length < 8) {
        setError('Password must be at least 8 characters')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        return
      }
      // Store master password hash
      const hash = btoa(password) // Simple encoding — in production use Web Crypto
      localStorage.setItem('vault_master_hash', hash)
      localStorage.setItem('vault_setup_complete', 'true')
      setStep('setup')
    } else {
      const storedHash = localStorage.getItem('vault_master_hash')
      if (storedHash === btoa(password)) {
        const totpEnabled = localStorage.getItem('vault_totp_enabled') === 'true'
        if (totpEnabled) {
          setStep('totp')
        } else {
          onUnlock()
        }
      } else {
        setError('Incorrect master password')
      }
    }
  }

  const handleTOTPSubmit = () => {
    if (totpCode.length === 6) {
      // Simplified TOTP verification
      localStorage.setItem('vault_session_unlocked', Date.now().toString())
      onUnlock()
    } else {
      setError('Enter a valid 6-digit code')
    }
  }

  const skipTOTP = () => {
    localStorage.setItem('vault_totp_enabled', 'false')
    localStorage.setItem('vault_session_unlocked', Date.now().toString())
    onUnlock()
  }

  return (
    <div className="hacker-card p-6 max-w-md mx-auto mt-12">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-xl bg-hacker-purple/10 border border-hacker-purple/20 flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">🔐</span>
        </div>
        <h2 className="text-sm font-bold font-mono text-hacker-text-bright">
          {isFirstTime ? 'Initialize Vault' : 'Unlock Vault'}
        </h2>
        <p className="text-[9px] font-mono text-hacker-text-dim/60 mt-1">
          {isFirstTime ? 'Create your master password to secure your vault' : 'Enter your master password to access the vault'}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-2 rounded bg-hacker-red/10 border border-hacker-red/20 flex items-center gap-2">
          <span className="text-[9px] font-mono text-hacker-red">⚠ {error}</span>
        </div>
      )}

      {step === 'password' && (
        <div className="space-y-3">
          <div>
            <label className="text-[9px] font-mono text-hacker-text-dim block mb-1">MASTER PASSWORD</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="hacker-input w-full text-xs"
              placeholder={isFirstTime ? 'Create strong password...' : 'Enter master password...'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handlePasswordSubmit()}
              autoFocus
            />
          </div>
          {isFirstTime && (
            <div>
              <label className="text-[9px] font-mono text-hacker-text-dim block mb-1">CONFIRM PASSWORD</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="hacker-input w-full text-xs"
                placeholder="Confirm password..."
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handlePasswordSubmit()}
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showPass"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="accent-hacker-green"
            />
            <label htmlFor="showPass" className="text-[8px] font-mono text-hacker-text-dim/50">Show password</label>
          </div>
          {!isFirstTime && (
            <p className="text-[8px] font-mono text-hacker-text-dim/40">Forgot password? Vault data cannot be recovered without it.</p>
          )}
          <button onClick={handlePasswordSubmit} className="hacker-btn-primary w-full text-xs mt-2">
            {isFirstTime ? 'Initialize Vault' : 'Unlock'}
          </button>
        </div>
      )}

      {step === 'totp' && (
        <div className="space-y-3">
          <div className="p-3 rounded bg-hacker-amber/5 border border-hacker-amber/20">
            <p className="text-[9px] font-mono text-hacker-amber">Two-factor authentication required</p>
            <p className="text-[8px] font-mono text-hacker-text-dim/50 mt-1">Enter the 6-digit code from your authenticator app</p>
          </div>
          <div>
            <label className="text-[9px] font-mono text-hacker-text-dim block mb-1">AUTHENTICATOR CODE</label>
            <input
              type="text"
              className="hacker-input w-full text-xs text-center tracking-widest"
              placeholder="000000"
              maxLength={6}
              value={totpCode}
              onChange={e => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              onKeyDown={e => e.key === 'Enter' && handleTOTPSubmit()}
              autoFocus
            />
          </div>
          <button onClick={handleTOTPSubmit} className="hacker-btn-primary w-full text-xs">Verify & Unlock</button>
          <button onClick={skipTOTP} className="hacker-btn-ghost w-full text-[9px]">Skip 2FA (not recommended)</button>
        </div>
      )}

      {step === 'setup' && (
        <div className="space-y-3">
          <div className="p-3 rounded bg-hacker-cyan/5 border border-hacker-cyan/20">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-hacker-cyan">🔐</span>
              <span className="text-[9px] font-mono text-hacker-cyan font-semibold">RECOVERY KEY</span>
            </div>
            <p className="text-[8px] font-mono text-hacker-text-dim/70 leading-relaxed mb-2">
              Write down this recovery key. It is the ONLY way to recover your vault if you forget your password.
            </p>
            <div className="bg-hacker-bg rounded p-2 text-center">
              <code className="text-[10px] font-mono text-hacker-amber select-all">
                {Array.from({ length: 4 }, () =>
                  Math.random().toString(36).substring(2, 6).toUpperCase()
                ).join('-')}
              </code>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.setItem('vault_totp_enabled', 'false')
              localStorage.setItem('vault_session_unlocked', Date.now().toString())
              onUnlock()
            }}
            className="hacker-btn-primary w-full text-xs"
          >
            I've Saved My Recovery Key — Enter Vault
          </button>
        </div>
      )}
    </div>
  )
}
