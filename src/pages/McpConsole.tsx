import { useState, useRef, useEffect } from 'react'
import { cn } from '../lib/utils'

interface Message {
  id: number
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

const mcpTools = [
  { name: 'subfinder', description: 'Subdomain discovery', category: 'recon' },
  { name: 'httpx', description: 'HTTP probing', category: 'recon' },
  { name: 'nuclei', description: 'Vulnerability scanning', category: 'vuln' },
  { name: 'ffuf', description: 'Directory fuzzing', category: 'vuln' },
  { name: 'gau', description: 'Get all URLs', category: 'recon' },
  { name: 'waybackurls', description: 'Wayback URLs', category: 'recon' },
  { name: 'trufflehog', description: 'Git secrets', category: 'secrets' },
  { name: 'gitleaks', description: 'Secret scanning', category: 'secrets' },
  { name: 'dalfox', description: 'XSS scanning', category: 'vuln' },
  { name: 'sqlmap', description: 'SQL injection', category: 'vuln' },
  { name: 'naabu', description: 'Port scanning', category: 'recon' },
  { name: 'katana', description: 'Web crawling', category: 'recon' },
  { name: 'dnsx', description: 'DNS enumeration', category: 'recon' },
  { name: 'gospider', description: 'Spidering', category: 'recon' },
  { name: 'subzy', description: 'Takeover check', category: 'takeover' },
  { name: 'hacksonthefly', description: 'MCP tool execution', category: 'mcp' },
]

const initialMessages: Message[] = [
  {
    id: 0,
    role: 'system',
    content: 'BugReaper X AI Console initialized. Connect to Ollama (http://localhost:11434) in Settings to enable local LLM execution. 16 MCP tools available for AI-powered automation.',
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
  },
]

const suggestionPrompts = [
  'Scan example.com with full recon chain',
  'Find secrets in public GitHub repo',
  'Generate a bug bounty report for SQLi',
  'Analyze scope file for potential bypasses',
]

export function McpConsolePage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [processing, setProcessing] = useState(false)
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [toolArgs, setToolArgs] = useState('')
  const [ollamaConnected, setOllamaConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || processing) return

    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setProcessing(true)

    // Simulate AI processing (in production this would call Ollama)
    setTimeout(() => {
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: ollamaConnected
          ? `Processing "${userMsg.content}" via ${selectedTool || 'auto'}...\n\n> Analysis queued. Connect to Ollama for real AI-powered execution.\n> 16 MCP tools available. Configure API keys in Settings.`
          : `> Request received: "${userMsg.content}"\n\n> ⚠ Ollama not connected. Install Ollama (https://ollama.ai) and start the service.\n\n> Recommended model: codestral or deepseek-coder for code generation.\n\n> Available actions:\n  - Generate report templates\n  - Analyze scope descriptions\n  - Create PoC scripts\n  - Parse tool output\n\n> Connect via Settings → AI Integration → Ollama Endpoint`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      }
      setMessages(prev => [...prev, aiMsg])
      setProcessing(false)
    }, 600)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const executeMcpTool = () => {
    if (!selectedTool) return
    const msg = `Execute MCP tool: ${selectedTool}${toolArgs ? ` with args: ${toolArgs}` : ''}`
    setInput(msg)
    setSelectedTool(null)
    setToolArgs('')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-hacker-text-bright font-mono tracking-wide">▸ MCP CONSOLE</h1>
        <p className="text-sm text-hacker-text-dim mt-1 font-mono">Model Context Protocol · AI agent · Tool execution</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Main chat area */}
        <div className="hacker-card p-4 col-span-2 flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-hacker-purple font-mono">CONVERSATION</h3>
            <div className="flex items-center gap-2">
              <span className={cn(
                'w-1.5 h-1.5 rounded-full',
                ollamaConnected ? 'bg-hacker-green' : 'bg-hacker-amber'
              )} />
              <span className="text-[10px] font-mono text-hacker-text-dim">
                {ollamaConnected ? 'Ollama Online' : 'Ollama Offline'}
              </span>
              <button
                onClick={() => setMessages(initialMessages)}
                className="hacker-btn-ghost text-[10px] px-2 py-0.5"
              >
                clear
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 bg-hacker-bg rounded p-3 font-mono text-xs space-y-2 overflow-y-auto">
            {messages.map(msg => (
              <div key={msg.id} className={cn(
                'flex gap-2 p-2 rounded',
                msg.role === 'user' ? 'bg-hacker-surface2/50' : '',
                msg.role === 'system' ? 'bg-hacker-cyan/5 border border-hacker-cyan/10' : ''
              )}>
                <span className={cn(
                  'font-bold flex-shrink-0 w-8',
                  msg.role === 'user' ? 'text-hacker-green' :
                  msg.role === 'assistant' ? 'text-hacker-purple' :
                  'text-hacker-cyan'
                )}>
                  {msg.role === 'user' ? 'You' : msg.role === 'assistant' ? 'AI' : 'Sys'}
                </span>
                <div>
                  <span className="text-hacker-text-dim whitespace-pre-wrap">{msg.content}</span>
                  <p className="text-[8px] text-hacker-text-dim/30 mt-1">{msg.timestamp}</p>
                </div>
              </div>
            ))}
            {processing && (
              <div className="flex gap-2 p-2">
                <span className="text-hacker-purple font-bold">AI</span>
                <span className="text-hacker-text-dim animate-pulse">processing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2 mt-3">
            <input
              className="hacker-input flex-1 text-xs"
              placeholder="Ask the AI to run a tool, analyze results, or generate a report..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={processing}
            />
            <button
              onClick={handleSend}
              disabled={processing || !input.trim()}
              className="hacker-btn-primary text-xs disabled:opacity-30"
            >
              Send
            </button>
          </div>

          {/* Quick suggestions */}
          <div className="flex gap-1.5 mt-2">
            {suggestionPrompts.map(p => (
              <button
                key={p}
                onClick={() => setInput(p)}
                className="text-[9px] font-mono px-2 py-1 rounded bg-hacker-surface2 text-hacker-text-dim hover:text-hacker-green hover:bg-hacker-surface2/80 transition-colors truncate"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Tools panel */}
        <div className="hacker-card p-4 flex flex-col h-[500px]">
          <h3 className="text-xs font-semibold text-hacker-amber font-mono mb-3">AVAILABLE TOOLS</h3>

          {/* MCP Tool Executor */}
          <div className="mb-4 p-2 rounded bg-hacker-surface2/50 border border-hacker-border">
            <p className="text-[10px] font-mono text-hacker-text-dim mb-2">Execute MCP Tool</p>
            <select
              className="hacker-input w-full text-[10px] mb-2"
              value={selectedTool || ''}
              onChange={e => setSelectedTool(e.target.value || null)}
            >
              <option value="">-- select tool --</option>
              {mcpTools.map(t => (
                <option key={t.name} value={t.name}>{t.name}</option>
              ))}
            </select>
            <textarea
              className="hacker-input w-full h-16 resize-none text-[10px] font-mono mb-2"
              placeholder='JSON args: {"url":"https://target.com"}'
              value={toolArgs}
              onChange={e => setToolArgs(e.target.value)}
            />
            <div className="flex gap-1">
              <button
                onClick={executeMcpTool}
                disabled={!selectedTool}
                className="hacker-btn-primary text-[10px] flex-1 disabled:opacity-30"
              >
                Execute
              </button>
              {selectedTool && (
                <button
                  onClick={() => { setSelectedTool(null); setToolArgs('') }}
                  className="hacker-btn-ghost text-[10px]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Tool List */}
          <div className="flex-1 space-y-1 overflow-y-auto">
            {mcpTools.map(tool => (
              <button
                key={tool.name}
                onClick={() => setSelectedTool(tool.name)}
                className={cn(
                  'w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors',
                  selectedTool === tool.name ? 'bg-hacker-amber/10 text-hacker-amber' : 'hover:bg-hacker-surface2'
                )}
              >
                <span className={cn(
                  'w-1.5 h-1.5 rounded-full flex-shrink-0',
                  tool.category === 'recon' ? 'bg-hacker-green' :
                  tool.category === 'vuln' ? 'bg-hacker-red' :
                  tool.category === 'secrets' ? 'bg-hacker-cyan' :
                  tool.category === 'mcp' ? 'bg-hacker-purple' :
                  'bg-hacker-text-dim'
                )} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-mono text-hacker-text truncate">{tool.name}</p>
                  <p className="text-[8px] font-mono text-hacker-text-dim truncate">{tool.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
