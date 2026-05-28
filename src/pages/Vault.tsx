import { useState, useEffect } from 'react'
import { VaultUnlock } from '../components/vault/VaultUnlock'
import { VaultDashboard } from '../components/vault/VaultDashboard'
import { TOTPSetup } from '../components/vault/TOTPSetup'
import { SessionLockOverlay } from '../components/vault/SessionLockOverlay'

export function VaultPage() {
  const [vaultState, setVaultState] = useState<'locked' | 'unlocking' | 'unlocked' | 'totp-setup'>('locked')
  const [isFirstTime, setIsFirstTime] = useState(false)

  useEffect(() => {
    const setupComplete = localStorage.getItem('vault_setup_complete')
    const sessionUnlocked = localStorage.getItem('vault_session_unlocked')

    if (!setupComplete) {
      setIsFirstTime(true)
      setVaultState('unlocking')
    } else if (sessionUnlocked) {
      const elapsed = (Date.now() - parseInt(sessionUnlocked)) / 1000
      if (elapsed < 300) { // 5 min session
        setVaultState('unlocked')
      } else {
        localStorage.removeItem('vault_session_unlocked')
        setVaultState('unlocking')
      }
    } else {
      setVaultState('unlocking')
    }
  }, [])

  const handleUnlock = () => {
    const totpEnabled = localStorage.getItem('vault_totp_enabled')
    if (!totpEnabled && !isFirstTime) {
      setVaultState('totp-setup')
    } else {
      setVaultState('unlocked')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-hacker-text-bright font-mono tracking-wide flex items-center gap-2">
            <span className="text-hacker-purple">🔐</span>
            <span>▸ PRIVACY VAULT</span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-hacker-purple/10 text-hacker-purple border border-hacker-purple/20">AES-256-GCM</span>
          </h1>
          <p className="text-sm text-hacker-text-dim mt-1 font-mono">
            End-to-end encrypted storage · Master password · 2FA · Auto-lock
          </p>
        </div>
        {vaultState === 'unlocked' && (
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-hacker-green animate-pulse" />
            <span className="text-[10px] font-mono text-hacker-green">Vault unlocked</span>
          </div>
        )}
      </div>

      {vaultState === 'unlocking' && (
        <VaultUnlock onUnlock={handleUnlock} isFirstTime={isFirstTime} />
      )}

      {vaultState === 'totp-setup' && (
        <TOTPSetup
          onComplete={() => setVaultState('unlocked')}
          onSkip={() => setVaultState('unlocked')}
        />
      )}

      {vaultState === 'unlocked' && (
        <>
          <VaultDashboard />
          <SessionLockOverlay />
        </>
      )}
    </div>
  )
}
