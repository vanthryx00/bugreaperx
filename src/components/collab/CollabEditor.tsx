import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '../../lib/utils'
import type { CollabPeer, CollabCursor, CollabMessage } from '../../types'

const PEER_COLORS = ['text-hacker-green', 'text-hacker-cyan', 'text-hacker-amber', 'text-hacker-purple', 'text-hacker-red', 'text-hacker-orange']
const PEER_BG_COLORS = ['bg-hacker-green/20', 'bg-hacker-cyan/20', 'bg-hacker-amber/20', 'bg-hacker-purple/20', 'bg-hacker-red/20', 'bg-hacker-orange/20']

const SNIPPETS = [
  `// Welcome to Collab Lab!\n// Start typing or paste code below\n\nfunction scanTarget(url) {\n  const results = [];\n  const endpoints = await discoverEndpoints(url);\n  \n  for (const endpoint of endpoints) {\n    const vulns = await testForVulns(endpoint);\n    results.push(...vulns);\n  }\n  \n  return results;\n}`,
  `# Shared Recon Script\n\nsubdomains=$(subfinder -d $1 -silent)\nhttpx -l <(echo "$subdomains") -silent | \\\n  nuclei -t cves/ -t exposures/ -severity critical,high\n`,
]

export function CollabEditor() {
  const [code, setCode] = useState(SNIPPETS[0])
  const [language, setLanguage] = useState('javascript')
  const [peers, setPeers] = useState<CollabPeer[]>([
    { id: 'local', name: 'You', color: PEER_COLORS[0], cursor: null, connected: true, joinedAt: new Date().toISOString() },
    { id: 'p2', name: 'Ghost_00x', color: PEER_COLORS[1], cursor: { line: 8, column: 4 }, connected: true, joinedAt: new Date().toISOString() },
    { id: 'p3', name: 'reaper_sec', color: PEER_COLORS[2], cursor: { line: 3, column: 12 }, connected: true, joinedAt: new Date().toISOString() },
  ])
  const [messages, setMessages] = useState<CollabMessage[]>([
    { id: 'm1', peerId: 'p2', peerName: 'Ghost_00x', type: 'peer-join', content: 'Ghost_00x joined the session', timestamp: new Date().toISOString() },
    { id: 'm2', peerId: 'p3', peerName: 'reaper_sec', type: 'peer-join', content: 'reaper_sec joined the session', timestamp: new Date().toISOString() },
    { id: 'm3', peerId: 'p3', peerName: 'reaper_sec', type: 'chat', content: 'Found some interesting endpoints on line 7', timestamp: new Date().toISOString() },
  ])
  const [chatInput, setChatInput] = useState('')
  const [cursorLine, setCursorLine] = useState(0)
  const [cursorCol, setCursorCol] = useState(0)
  const [showShareModal, setShowShareModal] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendChat = () => {
    if (!chatInput.trim()) return
    const msg: CollabMessage = {
      id: `m-${Date.now()}`,
      peerId: 'local',
      peerName: 'You',
      type: 'chat',
      content: chatInput.trim(),
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, msg])
    setChatInput('')

    // Simulate peer response
    setTimeout(() => {
      const peer = [peers[1], peers[2]][Math.floor(Math.random() * 2)]
      const responses = [
        'Nice find! Try adding a few more test cases.',
        'I see the issue — check the regex on line 12.',
        'Let me test this against the staging server.',
        'We need to handle the edge case on line 22.',
      ]
      const response: CollabMessage = {
        id: `m-${Date.now()}-resp`,
        peerId: peer.id,
        peerName: peer.name,
        type: 'chat',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, response])
    }, 1500 + Math.random() * 2000)
  }

  const handleCodeCursor = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget
    const pos = textarea.selectionStart
    const text = textarea.value
    const before = text.substring(0, pos)
    setCursorLine(before.split('\n').length)
    setCursorCol(before.length - before.lastIndexOf('\n'))
  }

  const copyInviteLink = () => {
    navigator.clipboard.writeText(`bugreaper://collab/${Date.now().toString(36)}`)
  }

  const lines = code.split('\n')

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="hacker-card p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-hacker-green animate-pulse" />
            <span className="text-[9px] font-mono text-hacker-green">LIVE</span>
          </div>
          <select
            className="hacker-input text-[9px] font-mono py-0.5"
            value={language}
            onChange={e => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="typescript">TypeScript</option>
            <option value="go">Go</option>
            <option value="bash">Bash</option>
          </select>
          <span className="text-[8px] font-mono text-hacker-text-dim/50">
            Peers: {peers.filter(p => p.connected).length}
          </span>
          <span className="text-[8px] font-mono text-hacker-text-dim/50">
            Lines: {lines.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowShareModal(true)} className="hacker-btn-primary text-[9px]">
            Invite
          </button>
          <button
            onClick={() => setCode(SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)])}
            className="hacker-btn-ghost text-[9px]"
          >
            New Snippet
          </button>
        </div>
      </div>

      {/* Main editor + sidebar */}
      <div className="grid grid-cols-[1fr_220px] gap-4">
        {/* Editor */}
        <div className="hacker-card overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-hacker-surface2 border-b border-hacker-border/30">
            <span className="text-[8px] font-mono text-hacker-text-dim/50">cursor: {cursorLine}:{cursorCol}</span>
            <div className="flex gap-1 ml-auto">
              {peers.filter(p => p.id !== 'local' && p.connected).map(peer => (
                <div
                  key={peer.id}
                  className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-mono font-bold',
                    PEER_BG_COLORS[PEER_COLORS.indexOf(peer.color)],
                    peer.color
                  )}
                  title={peer.name}
                >
                  {peer.name[0].toUpperCase()}
                </div>
              ))}
            </div>
          </div>

          <div className="flex">
            {/* Line numbers */}
            <div className="text-right pr-3 pl-2 py-3 select-none bg-hacker-bg/30 border-r border-hacker-border/20 min-w-[44px]">
              {lines.map((_, i) => (
                <div key={i} className={cn(
                  'text-[10px] font-mono leading-5',
                  i + 1 === cursorLine ? 'text-hacker-green' : 'text-hacker-text-dim/30'
                )}>
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Code area with cursor overlays */}
            <div className="flex-1 relative">
              <textarea
                ref={editorRef}
                className="w-full h-[400px] bg-transparent text-[11px] font-mono text-hacker-text leading-5 p-3 resize-none focus:outline-none"
                value={code}
                onChange={e => setCode(e.target.value)}
                onKeyUp={handleCodeCursor}
                onClick={handleCodeCursor}
                spellCheck={false}
              />

              {/* Remote cursors */}
              {peers.filter(p => p.id !== 'local' && p.connected && p.cursor).map(peer => (
                <div
                  key={peer.id}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${(peer.cursor?.column || 0) * 7 + 12}px`,
                    top: `${((peer.cursor?.line || 0) - 1) * 20 + 12}px`,
                  }}
                >
                  <div className={cn(
                    'w-[2px] h-5 animate-pulse',
                    peer.color.replace('text-', 'bg-')
                  )} />
                  <div className={cn(
                    'px-1 py-0.5 rounded-t rounded-r text-[7px] font-mono font-bold whitespace-nowrap',
                    PEER_BG_COLORS[PEER_COLORS.indexOf(peer.color)],
                    peer.color
                  )}>
                    {peer.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar — Peers + Chat */}
        <div className="space-y-4">
          {/* Peer list */}
          <div className="hacker-card p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] text-hacker-text-dim">◉</span>
              <h3 className="text-[9px] font-mono text-hacker-text font-semibold">PEERS</h3>
            </div>
            <div className="space-y-1">
              {peers.map(peer => (
                <div key={peer.id} className="flex items-center gap-2 px-2 py-1 rounded bg-hacker-bg/30">
                  <div className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    peer.connected ? 'bg-hacker-green' : 'bg-hacker-text-dim'
                  )} />
                  <div className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-mono font-bold',
                    PEER_BG_COLORS[PEER_COLORS.indexOf(peer.color)],
                    peer.color
                  )}>
                    {peer.name[0].toUpperCase()}
                  </div>
                  <span className="text-[9px] font-mono text-hacker-text flex-1 truncate">{peer.name}</span>
                  {peer.id === 'local' && <span className="text-[7px] font-mono text-hacker-text-dim/40">(you)</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="hacker-card p-3 flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] text-hacker-cyan">◎</span>
              <h3 className="text-[9px] font-mono text-hacker-text font-semibold">CHAT</h3>
            </div>
            <div className="flex-1 max-h-[200px] overflow-y-auto space-y-1 mb-2">
              {messages.filter(m => m.type === 'chat' || m.type === 'peer-join').map(msg => (
                <div key={msg.id} className="px-2 py-1 rounded bg-hacker-bg/30">
                  <div className="flex items-center gap-1.5">
                    <span className={cn(
                      'text-[7px] font-mono font-bold',
                      msg.peerId === 'local' ? 'text-hacker-green' :
                      PEER_COLORS[peers.findIndex(p => p.id === msg.peerId) % PEER_COLORS.length]
                    )}>
                      {msg.peerName}
                    </span>
                    <span className="text-[6px] font-mono text-hacker-text-dim/30">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className={cn(
                    'text-[8px] font-mono mt-0.5',
                    msg.type === 'peer-join' ? 'text-hacker-text-dim/50 italic' : 'text-hacker-text-dim/70'
                  )}>
                    {msg.content}
                  </p>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="flex gap-1">
              <input
                className="hacker-input flex-1 text-[9px] font-mono py-1"
                placeholder="Type a message..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendChat()}
              />
              <button onClick={sendChat} className="hacker-btn-primary text-[9px] px-2">→</button>
            </div>
          </div>
        </div>
      </div>

      {/* Share modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-hacker-bg/80 backdrop-blur-sm">
          <div className="hacker-card p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-mono text-hacker-text font-semibold">INVITE PEERS</h3>
              <button onClick={() => setShowShareModal(false)} className="text-[9px] text-hacker-text-dim/50 hover:text-hacker-text">✕</button>
            </div>
            <div className="p-3 rounded bg-hacker-bg/50 border border-hacker-border/30 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-hacker-green animate-pulse" />
                <span className="text-[9px] font-mono text-hacker-green">Session Active</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  className="hacker-input flex-1 text-[9px] font-mono select-all"
                  value={`bugreaper://collab/${Date.now().toString(36)}`}
                  readOnly
                />
                <button onClick={copyInviteLink} className="hacker-btn-primary text-[8px]">
                  COPY
                </button>
              </div>
              <p className="text-[7px] font-mono text-hacker-text-dim/40 mt-2">
                Share this link with peers to collaborate in real-time.
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[8px] font-mono text-hacker-text-dim/50">Connected Peers</p>
              {peers.filter(p => p.connected).map(peer => (
                <div key={peer.id} className="flex items-center gap-2 px-2 py-1.5 rounded bg-hacker-bg/30">
                  <div className={cn(
                    'w-1.5 h-1.5 rounded-full bg-hacker-green'
                  )} />
                  <div className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-mono font-bold',
                    PEER_BG_COLORS[PEER_COLORS.indexOf(peer.color)]
                  )}>
                    {peer.name[0].toUpperCase()}
                  </div>
                  <span className="text-[9px] font-mono text-hacker-text">{peer.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Shared terminal */}
      <div className="hacker-card p-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] text-hacker-amber">◉</span>
          <h3 className="text-[9px] font-mono text-hacker-text font-semibold">SHARED TERMINAL</h3>
          <span className="text-[7px] font-mono text-hacker-text-dim/40 ml-auto">output log</span>
        </div>
        <div className="bg-hacker-bg rounded p-3 font-mono text-[9px] leading-relaxed max-h-[100px] overflow-y-auto">
          <p className="text-hacker-green">$ npm run scan --target=staging.example.com</p>
          <p className="text-hacker-text-dim/70">&gt; Starting reconnaissance scan...</p>
          <p className="text-hacker-text-dim/70">&gt; Found 23 subdomains</p>
          <p className="text-hacker-amber">&gt; [Ghost_00x] Running nuclei on subdomains...</p>
          <p className="text-hacker-text-dim/70">&gt; Found 3 critical vulnerabilities</p>
          <p className="text-hacker-green">$ Shared terminal active — all peers see output</p>
        </div>
      </div>
    </div>
  )
}
