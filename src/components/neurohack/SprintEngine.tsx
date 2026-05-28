import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '../../lib/utils'
import type { NeurohackProtocol, NeurohackSprint, NeurohackPhase, FrictionItem } from '../../types'

const PROTOCOLS: NeurohackProtocol[] = [
  {
    id: 'feynman_speedrun',
    name: 'Feynman Speed-Run',
    description: 'Learn anything in 4 hours by teaching it. Fluent or nothing.',
    duration_hours: 4,
    icon: '⚡',
    color: 'text-hacker-green border-hacker-green/30',
    phases: [
      { id: 0, type: 'SKIM', name: 'SKIM', description: 'Scan 3-5 top resources', duration_min: 30, action: 'Scan 3-5 top resources. Extract core concepts ONLY. No deep reading.', output: 'List of 5-10 core concepts', completed: false },
      { id: 1, type: 'EXPLAIN', name: 'EXPLAIN', description: 'Explain to a 5-year-old', duration_min: 45, action: 'Explain each concept simply. Record yourself. If you stumble, flag it.', output: 'Voice recordings + list of gaps', completed: false },
      { id: 2, type: 'FILL_GAPS', name: 'FILL GAPS', description: 'Target flagged gaps only', duration_min: 60, action: 'Target ONLY flagged gaps. Rapid research. No rabbit holes.', output: 'Gap-filling notes', completed: false },
      { id: 3, type: 'BUILD', name: 'BUILD', description: 'Create something real', duration_min: 90, action: 'Create something with the knowledge. Code, diagram, or mini-project.', output: 'Working artifact', completed: false },
      { id: 4, type: 'TEACH', name: 'TEACH', description: '5-min final explanation', duration_min: 35, action: 'Record 5-min explanation with no notes. If fluent = learned.', output: 'Final explanation', completed: false },
    ],
  },
  {
    id: 'reverse_engineer',
    name: 'Reverse Engineering Sprint',
    description: 'Study experts, clone their work, rebuild from scratch.',
    duration_hours: 3,
    icon: '◎',
    color: 'text-hacker-cyan border-hacker-cyan/30',
    phases: [
      { id: 0, type: 'FIND_EXPERT', name: 'FIND EXPERT', description: 'Study a master', duration_min: 20, action: 'Find someone who mastered this. Study their path, stack, and repos.', output: 'Expert profile + resource list', completed: false },
      { id: 1, type: 'CLONE_MINIMAL', name: 'CLONE MINIMAL', description: 'Run their simplest example', duration_min: 60, action: 'Clone their simplest working example. Get it running locally.', output: 'Running code', completed: false },
      { id: 2, type: 'BREAK_IT', name: 'BREAK IT', description: 'Find the boundaries', duration_min: 40, action: 'Change variables. Remove components. See what breaks. Learn the edges.', output: 'Breakage log + insights', completed: false },
      { id: 3, type: 'REBUILD_YOURS', name: 'REBUILD YOURS', description: 'From scratch', duration_min: 80, action: 'Build your own version from scratch using the patterns you discovered.', output: 'Your implementation', completed: false },
    ],
  },
  {
    id: 'constraint_mastery',
    name: 'Constraint-Driven Mastery',
    description: 'Set an impossible goal. Ship the MVP. Iterate into mastery.',
    duration_hours: 4,
    icon: '◈',
    color: 'text-hacker-purple border-hacker-purple/30',
    phases: [
      { id: 0, type: 'SET_IMPOSSIBLE_GOAL', name: 'IMPOSSIBLE GOAL', description: 'Dream big', duration_min: 15, action: 'Define something you "can\'t" build yet with this skill.', output: 'Project spec', completed: false },
      { id: 1, type: 'BRUTAL_SIMPLIFY', name: 'BRUTAL SIMPLIFY', description: '80/20 the MVP', duration_min: 30, action: 'Strip project to absolute MVP. What 20% gives 80% value?', output: 'MVP spec', completed: false },
      { id: 2, type: 'SKILL_MAP', name: 'SKILL MAP', description: 'Map dependencies', duration_min: 25, action: 'List exact skills needed for MVP. Prioritize by blocker severity.', output: 'Skill dependency graph', completed: false },
      { id: 3, type: 'JUST_IN_TIME_LEARN', name: 'JIT LEARN', description: 'Learn as you build', duration_min: 120, action: 'Learn ONLY what you need WHEN you need it while building. No upfront study.', output: 'Working MVP', completed: false },
      { id: 4, type: 'ITERATE', name: 'ITERATE', description: 'Push to next level', duration_min: 50, action: 'Push MVP to next level. Learn next skill tier through iteration.', output: 'V2 + skill unlocks', completed: false },
    ],
  },
]

const PHASE_COLORS: Record<string, string> = {
  MAP: 'border-l-hacker-green',
  CONSUME: 'border-l-hacker-cyan',
  BUILD: 'border-l-hacker-amber',
  TEST: 'border-l-hacker-red',
  CONNECT: 'border-l-hacker-purple',
  APPLY: 'border-l-hacker-green',
  SKIM: 'border-l-hacker-green',
  EXPLAIN: 'border-l-hacker-cyan',
  FILL_GAPS: 'border-l-hacker-amber',
  TEACH: 'border-l-hacker-purple',
  FIND_EXPERT: 'border-l-hacker-cyan',
  CLONE_MINIMAL: 'border-l-hacker-green',
  BREAK_IT: 'border-l-hacker-red',
  REBUILD_YOURS: 'border-l-hacker-purple',
  SET_IMPOSSIBLE_GOAL: 'border-l-hacker-purple',
  BRUTAL_SIMPLIFY: 'border-l-hacker-amber',
  SKILL_MAP: 'border-l-hacker-cyan',
  JUST_IN_TIME_LEARN: 'border-l-hacker-green',
  ITERATE: 'border-l-hacker-cyan',
}

const PHASE_ICONS: Record<string, string> = {
  MAP: '◉', CONSUME: '◈', BUILD: '⚔', TEST: '◻',
  CONNECT: '◎', APPLY: '⚡',
  SKIM: '◻', EXPLAIN: '◉', FILL_GAPS: '◈', TEACH: '⚡',
  FIND_EXPERT: '◎', CLONE_MINIMAL: '◈', BREAK_IT: '⚔', REBUILD_YOURS: '◉',
  SET_IMPOSSIBLE_GOAL: '⚡', BRUTAL_SIMPLIFY: '◻', SKILL_MAP: '◉',
  JUST_IN_TIME_LEARN: '⚔', ITERATE: '◎',
}

const FRICTION_ITEMS: FrictionItem[] = [
  { id: 'f1', label: 'Phone on airplane mode', icon: '◻', checked: false },
  { id: 'f2', label: 'Browser: only docs tab open', icon: '◎', checked: false },
  { id: 'f3', label: 'Notifications OFF', icon: '◉', checked: false },
  { id: 'f4', label: 'Music set (lo-fi/binaural/silent)', icon: '◈', checked: false },
  { id: 'f5', label: 'Water bottle full', icon: '◻', checked: false },
  { id: 'f6', label: 'Snacks prepped', icon: '◎', checked: false },
  { id: 'f7', label: 'Bathroom done', icon: '◉', checked: false },
  { id: 'f8', label: 'Timer set (25 min pomodoro)', icon: '◈', checked: false },
  { id: 'f9', label: 'Next action visible as sticky note', icon: '◎', checked: false },
]

export function SprintEngine() {
  const [activeView, setActiveView] = useState<'select' | 'sprint' | 'history'>('select')
  const [selectedProtocol, setSelectedProtocol] = useState<NeurohackProtocol | null>(null)
  const [sprint, setSprint] = useState<NeurohackSprint | null>(null)
  const [topic, setTopic] = useState('')
  const [phaseTimer, setPhaseTimer] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [momentumScore, setMomentumScore] = useState(0)
  const [dopamineFlash, setDopamineFlash] = useState(false)
  const [frictionChecked, setFrictionChecked] = useState<string[]>([])
  const [showFriction, setShowFriction] = useState(true)
  const [phaseOutput, setPhaseOutput] = useState('')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timerStartRef = useRef<number>(0)
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current)
    }
  }, [])

  const startTimer = useCallback((durationMin: number) => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerStartRef.current = Date.now()
    setPhaseTimer(0)
    setTimerRunning(true)

    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - timerStartRef.current) / 1000 / 60
      setPhaseTimer(Math.min(elapsed, durationMin))
      if (elapsed >= durationMin) {
        if (timerRef.current) clearInterval(timerRef.current)
        setTimerRunning(false)
      }
    }, 100)
  }, [])

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setTimerRunning(false)
  }, [])

  const startSprint = () => {
    if (!selectedProtocol || !topic.trim()) return
    const phases = selectedProtocol.phases.map(p => ({ ...p, completed: false, output_notes: undefined }))
    const newSprint: NeurohackSprint = {
      id: `sprint-${Date.now()}`,
      protocol_id: selectedProtocol.id,
      topic: topic.trim(),
      started_at: new Date().toISOString(),
      deadline_hours: selectedProtocol.duration_hours,
      current_phase: 0,
      phases,
      momentum_score: 0,
      completed: false,
    }
    setSprint(newSprint)
    setMomentumScore(0)
    setPhaseOutput('')
    setActiveView('sprint')
    startTimer(phases[0].duration_min)
  }

  const completePhase = () => {
    if (!sprint) return
    const idx = sprint.current_phase
    const updated = { ...sprint }
    updated.phases = [...updated.phases]
    updated.phases[idx] = { ...updated.phases[idx], completed: true, output_notes: phaseOutput || 'Completed' }

    if (idx < updated.phases.length - 1) {
      updated.current_phase = idx + 1
      startTimer(updated.phases[idx + 1].duration_min)
    } else {
      updated.completed = true
      updated.completed_at = new Date().toISOString()
      stopTimer()
    }

    const newMomentum = Math.min(momentumScore + 10, 100)
    setMomentumScore(newMomentum)
    updated.momentum_score = newMomentum
    setSprint(updated)
    setPhaseOutput('')

    // Dopamine flash animation
    setDopamineFlash(true)
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current)
    flashTimeoutRef.current = setTimeout(() => setDopamineFlash(false), 600)
  }

  const skipPhase = () => {
    if (!sprint) return
    const idx = sprint.current_phase
    const updated = { ...sprint }
    updated.phases = [...updated.phases]
    updated.phases[idx] = { ...updated.phases[idx], completed: false, output_notes: 'Skipped' }

    if (idx < updated.phases.length - 1) {
      updated.current_phase = idx + 1
      startTimer(updated.phases[idx + 1].duration_min)
    } else {
      updated.completed = true
      updated.completed_at = new Date().toISOString()
      stopTimer()
    }
    setSprint(updated)
    setPhaseOutput('')
  }

  const resetSprint = () => {
    stopTimer()
    setSprint(null)
    setSelectedProtocol(null)
    setTopic('')
    setMomentumScore(0)
    setPhaseOutput('')
    setActiveView('select')
  }

  const toggleFriction = (id: string) => {
    setFrictionChecked(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const currentPhase = sprint ? sprint.phases[sprint.current_phase] : null
  const progress = sprint ? (sprint.current_phase / sprint.phases.length) * 100 : 0
  const timerProgress = currentPhase ? (phaseTimer / currentPhase.duration_min) * 100 : 0
  const timerDisplay = `${Math.floor(phaseTimer)}:${String(Math.floor((phaseTimer % 1) * 60)).padStart(2, '0')}`
  const totalMinutes = currentPhase ? currentPhase.duration_min - phaseTimer : 0

  return (
    <div className="space-y-4">
      {/* Protocol Selection */}
      {activeView === 'select' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {PROTOCOLS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProtocol(p)}
                className={cn(
                  'hacker-card p-4 text-left transition-all duration-200',
                  selectedProtocol?.id === p.id
                    ? 'ring-1 ring-hacker-green/40 border-hacker-green/30'
                    : 'hover:border-hacker-text-dim/20'
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn('text-lg', p.color.split(' ')[0])}>{p.icon}</span>
                  <h3 className="text-xs font-semibold font-mono text-hacker-text">{p.name}</h3>
                </div>
                <p className="text-[9px] font-mono text-hacker-text-dim/70 leading-relaxed mb-2">{p.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-hacker-text-dim/50">{p.duration_hours}h sprint</span>
                  <span className="text-[9px] font-mono text-hacker-text-dim/50">· {p.phases.length} phases</span>
                </div>
                {/* Phase preview */}
                <div className="mt-2 pt-2 border-t border-hacker-border/30 space-y-1">
                  {p.phases.map((ph, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className={cn('text-[7px]', PHASE_COLORS[ph.type]?.split(' ')[0] || 'text-hacker-text-dim')}>
                        {PHASE_ICONS[ph.type] || '●'}
                      </span>
                      <span className="text-[7px] font-mono text-hacker-text-dim/50">{ph.name}</span>
                      <span className="text-[7px] font-mono text-hacker-text-dim/30">{ph.duration_min}m</span>
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>

          {/* Topic + Start */}
          <div className="hacker-card p-4">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="text-[9px] font-mono text-hacker-text-dim block mb-1">SPRINT TOPIC</label>
                <input
                  className="hacker-input w-full text-xs"
                  placeholder="e.g. Rust async programming, Kubernetes networking, React Server Components..."
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && startSprint()}
                />
              </div>
              <button
                onClick={startSprint}
                disabled={!selectedProtocol || !topic.trim()}
                className="hacker-btn-primary text-xs disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span>⚡</span>
                <span>LAUNCH SPRINT</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Sprint */}
      {activeView === 'sprint' && sprint && currentPhase && (
        <div className="space-y-4">
          {/* Sprint header */}
          <div className="hacker-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-hacker-green text-lg">⚡</span>
                <div>
                  <h3 className="text-xs font-semibold font-mono text-hacker-text">{sprint.topic}</h3>
                  <p className="text-[9px] font-mono text-hacker-text-dim/50">
                    {PROTOCOLS.find(p => p.id === sprint.protocol_id)?.name || 'Custom'} · Phase {sprint.current_phase + 1}/{sprint.phases.length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Momentum */}
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-hacker-surface2">
                  <span className={cn(
                    'text-[10px] font-bold font-mono transition-colors',
                    momentumScore >= 80 ? 'text-hacker-green' :
                    momentumScore >= 50 ? 'text-hacker-cyan' :
                    momentumScore >= 20 ? 'text-hacker-amber' : 'text-hacker-text-dim'
                  )}>{momentumScore}</span>
                  <span className="text-[7px] font-mono text-hacker-text-dim/50">MOMENTUM</span>
                </div>
                <button onClick={resetSprint} className="text-[8px] font-mono text-hacker-text-dim/40 hover:text-hacker-red transition-colors px-1">ABORT</button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 bg-hacker-surface2 rounded overflow-hidden mb-3">
              <div
                className="h-full rounded bg-gradient-to-r from-hacker-green to-hacker-cyan transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Phase steps */}
            <div className="flex gap-1.5">
              {sprint.phases.map((ph, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex-1 h-1 rounded transition-all duration-300',
                    ph.completed ? 'bg-hacker-green' :
                    i === sprint.current_phase ? 'bg-hacker-cyan animate-pulse' :
                    'bg-hacker-surface2'
                  )}
                />
              ))}
            </div>
          </div>

          {/* Current Phase */}
          <div className="grid grid-cols-2 gap-4">
            {/* Phase focus */}
            <div className={cn(
              'hacker-card p-4 border-l-4',
              PHASE_COLORS[currentPhase.type] || 'border-l-hacker-green'
            )}>
              <div className="flex items-center gap-2 mb-3">
                <span className={cn('text-lg', PHASE_COLORS[currentPhase.type]?.split(' ')[0] || 'text-hacker-green')}>
                  {PHASE_ICONS[currentPhase.type] || '●'}
                </span>
                <div>
                  <h4 className="text-sm font-bold font-mono text-hacker-text-bright">{currentPhase.name}</h4>
                  <p className="text-[9px] font-mono text-hacker-text-dim/60">{currentPhase.description}</p>
                </div>
              </div>
              <p className="text-[10px] font-mono text-hacker-text leading-relaxed">{currentPhase.action}</p>

              {/* Timer */}
              <div className="mt-4 p-3 rounded bg-hacker-bg/50 border border-hacker-border/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[8px] font-mono text-hacker-text-dim">PHASE TIMER</span>
                  <span className="text-lg font-bold font-mono tabular-nums text-hacker-text">{timerDisplay}</span>
                </div>
                <div className="w-full h-1.5 bg-hacker-surface2 rounded overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded transition-all duration-200',
                      timerProgress > 80 ? 'bg-hacker-red' :
                      timerProgress > 50 ? 'bg-hacker-amber' : 'bg-hacker-green'
                    )}
                    style={{ width: `${timerProgress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[8px] font-mono text-hacker-text-dim/50">{Math.floor(totalMinutes)}m remaining</span>
                  <span className="text-[8px] font-mono text-hacker-text-dim/50">{currentPhase.duration_min}m total</span>
                </div>
              </div>

              {/* Output log */}
              <div className="mt-3">
                <label className="text-[8px] font-mono text-hacker-text-dim block mb-1">PHASE OUTPUT / NOTES</label>
                <textarea
                  className="hacker-input w-full text-[10px] font-mono min-h-[60px] resize-none"
                  placeholder="What did you accomplish? Key insights, questions, blockers..."
                  value={phaseOutput}
                  onChange={e => setPhaseOutput(e.target.value)}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={completePhase}
                  className="hacker-btn-primary text-[10px] flex items-center gap-1"
                >
                  <span>✓</span>
                  <span>COMPLETE PHASE +10 MOMENTUM</span>
                </button>
                <button
                  onClick={skipPhase}
                  className="hacker-btn-ghost text-[9px]"
                >
                  Skip
                </button>
              </div>
            </div>

            {/* Right panel: Friction checklist + momentum */}
            <div className="space-y-4">
              {/* Momentum display */}
              <div className="hacker-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-hacker-amber text-lg">⚡</span>
                    <h4 className="text-xs font-mono text-hacker-text">MOMENTUM</h4>
                  </div>
                  <span className={cn(
                    'text-sm font-bold font-mono',
                    momentumScore >= 80 ? 'text-hacker-green' :
                    momentumScore >= 50 ? 'text-hacker-cyan' :
                    momentumScore >= 20 ? 'text-hacker-amber' : 'text-hacker-text-dim'
                  )}>{momentumScore}%</span>
                </div>
                <div className="w-full h-2 bg-hacker-surface2 rounded overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded transition-all duration-500',
                      momentumScore >= 80 ? 'bg-gradient-to-r from-hacker-green to-hacker-cyan' :
                      momentumScore >= 50 ? 'bg-gradient-to-r from-hacker-amber to-hacker-green' :
                      'bg-gradient-to-r from-hacker-red to-hacker-amber'
                    )}
                    style={{ width: `${momentumScore}%` }}
                  />
                </div>
                {/* Dopamine triggers */}
                <div className="mt-3 space-y-1">
                  {[
                    { score: 10, label: 'Phase complete', icon: '✓' },
                    { score: 25, label: 'Halfway milestone', icon: '◈' },
                    { score: 50, label: 'Flow state achieved', icon: '⚡' },
                    { score: 75, label: 'Deep focus locked', icon: '◉' },
                    { score: 100, label: 'SPRINT COMPLETE', icon: '🏆' },
                  ].map((t) => (
                    <div key={t.score} className="flex items-center gap-1.5">
                      <span className={cn(
                        'text-[8px] w-4 text-center',
                        momentumScore >= t.score ? 'text-hacker-green' : 'text-hacker-text-dim/20'
                      )}>{t.icon}</span>
                      <span className={cn(
                        'text-[8px] font-mono',
                        momentumScore >= t.score ? 'text-hacker-text-dim/70' : 'text-hacker-text-dim/20'
                      )}>{t.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Friction checklist */}
              <div className="hacker-card p-4">
                <button
                  onClick={() => setShowFriction(!showFriction)}
                  className="w-full flex items-center justify-between mb-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-hacker-cyan text-sm">◈</span>
                    <h4 className="text-xs font-mono text-hacker-text">FRICTION CHECKLIST</h4>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] font-mono text-hacker-text-dim/50">{frictionChecked.length}/{FRICTION_ITEMS.length}</span>
                    <span className="text-[8px] text-hacker-text-dim/30">{showFriction ? '▲' : '▼'}</span>
                  </div>
                </button>
                {showFriction && (
                  <div className="space-y-0.5 max-h-36 overflow-y-auto">
                    {FRICTION_ITEMS.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => toggleFriction(item.id)}
                        className="w-full flex items-center gap-2 px-2 py-1 rounded text-left hover:bg-hacker-surface2/50 transition-colors"
                      >
                        <span className={cn(
                          'w-3.5 h-3.5 rounded border flex items-center justify-center text-[7px] font-mono flex-shrink-0',
                          frictionChecked.includes(item.id)
                            ? 'bg-hacker-green/20 border-hacker-green text-hacker-green'
                            : 'border-hacker-border text-transparent'
                        )}>
                          {frictionChecked.includes(item.id) ? '✓' : ''}
                        </span>
                        <span className={cn(
                          'text-[8px] font-mono flex-1',
                          frictionChecked.includes(item.id) ? 'text-hacker-text-dim/50 line-through' : 'text-hacker-text-dim/70'
                        )}>{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dopamine flash overlay */}
          {dopamineFlash && (
            <div className="fixed inset-0 pointer-events-none z-50">
              <div className="absolute inset-0 bg-gradient-to-t from-hacker-green/10 to-transparent animate-pulse" style={{ animationDuration: '600ms' }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-4xl">⚡</span>
                <p className="text-lg font-bold font-mono text-hacker-green mt-1">+10 MOMENTUM</p>
              </div>
            </div>
          )}

          {/* Sprint complete banner */}
          {sprint.completed && (
            <div className="hacker-card p-6 border-hacker-green/30 bg-hacker-green/5 text-center">
              <span className="text-3xl block mb-2">🏆</span>
              <h3 className="text-lg font-bold font-mono text-hacker-green mb-1">SPRINT COMPLETE</h3>
              <p className="text-[10px] font-mono text-hacker-text-dim/70 mb-3">
                {sprint.topic} · {sprint.phases.filter(p => p.completed).length}/{sprint.phases.length} phases completed · Momentum: {momentumScore}%
              </p>
              <div className="flex items-center justify-center gap-3">
                <button onClick={resetSprint} className="hacker-btn-primary text-xs">NEW SPRINT</button>
                <button onClick={() => { stopTimer(); setSprint(null); setActiveView('history') }} className="hacker-btn-ghost text-xs">VIEW HISTORY</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* History view */}
      {activeView === 'history' && (
        <div className="hacker-card p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-hacker-text-dim text-lg">◻</span>
              <h3 className="text-xs font-mono text-hacker-text">SPRINT HISTORY</h3>
            </div>
            <button onClick={() => setActiveView('select')} className="hacker-btn-primary text-[9px]">SPRINT AGAIN</button>
          </div>
          <div className="text-center py-8">
            <span className="text-2xl block mb-2">⚡</span>
            <p className="text-[10px] font-mono text-hacker-text-dim/50">No completed sprints yet. Complete a sprint to see it here.</p>
          </div>
        </div>
      )}
    </div>
  )
}
