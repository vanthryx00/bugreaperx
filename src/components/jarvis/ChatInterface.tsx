import { useState, useRef, useEffect } from 'react'
import { cn } from '../../lib/utils'
import type { ChatMessage, SafetyRule } from '../../types'

const guardrails: SafetyRule[] = [
  { id: 'gr1', name: 'No Exploit Generation', description: 'Blocks requests to generate exploit code, malware, or attack vectors', category: 'criminal', severity: 'critical', active: true, blockedCount: 142 },
  { id: 'gr2', name: 'No Phishing/Social Eng', description: 'Blocks social engineering tools, phishing campaigns, and manipulation scripts', category: 'criminal', severity: 'critical', active: true, blockedCount: 89 },
  { id: 'gr3', name: 'No Unauthorized Access', description: 'Blocks instructions for accessing systems without permission', category: 'criminal', severity: 'critical', active: true, blockedCount: 56 },
  { id: 'gr4', name: 'No Data Exfiltration', description: 'Blocks data theft, exfiltration techniques, and privacy violations', category: 'malicious', severity: 'critical', active: true, blockedCount: 34 },
  { id: 'gr5', name: 'PII Protection', description: 'Prevents generation or exposure of personally identifiable information', category: 'privacy', severity: 'high', active: true, blockedCount: 78 },
  { id: 'gr6', name: 'Ethical Use Only', description: 'Ensures all generated content is for authorized security testing only', category: 'ethics', severity: 'high', active: true, blockedCount: 23 },
]

const initialMessages: ChatMessage[] = [
  {
    id: 'sys-1',
    role: 'system',
    content: 'JARVIS Security AI initialized. All responses are bound by 6 active safety railguards. Criminal activity requests are blocked and logged. Operating within ethical boundaries for authorized security research.',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'sys-2',
    role: 'assistant',
    content: 'Good day, operator. I am JARVIS — your security intelligence assistant. I can help with authorized bug bounty hunting, vulnerability research, security tool configuration, and report generation.\n\n⚠️ **Safety Notice**: I am programmed with ethical railguards. Requests for unauthorized access, exploit generation, or any criminal activity will be immediately blocked and logged.\n\nHow can I assist your security research today?',
    timestamp: new Date(Date.now() - 1000).toISOString(),
  },
]

const suggestionPrompts = [
  'Help me configure a Nuclei scan for SQLi',
  'Generate a professional bug bounty report template',
  'Explain XXE detection techniques',
  'Analyze this scope for potential attack surface',
]

const blockResponses: Record<string, string> = {
  'exploit': '⛔ **Blocked**: This request violates Safety Rule #1 (No Exploit Generation). JARVIS cannot generate exploit code, malware, or attack tools. This attempt has been logged.',
  'hack': '⛔ **Blocked**: Unauthorized access requests are prohibited by Safety Rule #3. JARVIS assists only with authorized security testing on systems you own or have explicit permission to test.',
  'phish': '⛔ **Blocked**: Social engineering tool generation violates Safety Rule #2. This attempt has been logged to the Godseye threat monitor.',
  'malware': '⛔ **Blocked**: Malware generation is strictly prohibited by Safety Rule #1. This incident has been reported to the security oversight system.',
  'steal': '⛔ **Blocked**: Data exfiltration techniques are blocked by Safety Rule #4. Privacy protection is enforced at all layers.',
  'default': '⛔ **Blocked**: This request violates active safety railguards. JARVIS operates within ethical boundaries for authorized security research only. Your action has been logged.',
}

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const [processing, setProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const checkGuardrails = (text: string): { blocked: boolean; reason: string } => {
    const lower = text.toLowerCase()
    if (lower.includes('exploit') && (lower.includes('generate') || lower.includes('write') || lower.includes('create'))) {
      return { blocked: true, reason: blockResponses['exploit'] }
    }
    if ((lower.includes('hack') || lower.includes('crack') || lower.includes('breach')) && !lower.includes('authorized')) {
      return { blocked: true, reason: blockResponses['hack'] }
    }
    if (lower.includes('phish') || lower.includes('social eng')) {
      return { blocked: true, reason: blockResponses['phish'] }
    }
    if (lower.includes('malware') || lower.includes('ransomware') || lower.includes('trojan') || lower.includes('keylogger')) {
      return { blocked: true, reason: blockResponses['malware'] }
    }
    if (lower.includes('steal') || lower.includes('exfiltrat') || lower.includes('theft')) {
      return { blocked: true, reason: blockResponses['steal'] }
    }
    return { blocked: false, reason: '' }
  }

  const getAIResponse = async (text: string): Promise<string> => {
    // Simulate AI response with security context
    await new Promise(r => setTimeout(r, 500 + Math.random() * 1000))

    const lower = text.toLowerCase()
    if (lower.includes('nuclei') || lower.includes('scan')) {
      return `**Nuclei Scan Configuration**\n\n\`\`\`bash\nnuclei -l targets.txt -t ~/nuclei-templates/ -severity critical,high -o findings.txt\n\`\`\`\n\n**Explanation**: This will run all critical and high severity Nuclei templates against your target list. Make sure you have authorization to test these targets.\n\n**Note**: Always verify scope before running automated scanners. Use \`httpx -l targets.txt -silent\` first to confirm live hosts.`
    }
    if (lower.includes('report') || lower.includes('template')) {
      return `**Bug Bounty Report Template**\n\n\`\`\`markdown\n# Vulnerability: [Title]\n\n**Severity**: Critical / High / Medium / Low\n**Program**: [Program Name]\n**Target**: https://target.com/endpoint\n\n## Summary\n[Brief description of the vulnerability]\n\n## Steps to Reproduce\n1. [Step 1]\n2. [Step 2]\n3. [Step 3]\n\n## Impact\n[What an attacker could achieve]\n\n## Remediation\n[How to fix]\n\n## Supporting Evidence\n[Screenshots, request/response, etc.]\n\`\`\`\n\nWould you like me to help fill in the details for a specific finding?`
    }
    if (lower.includes('xxe') || lower.includes('xml')) {
      return `**XXE Detection Techniques**\n\nXXE (XML External Entity) injection occurs when XML input is parsed without disabling external entities.\n\n**Test Payload**:\n\`\`\`xml\n<?xml version="1.0"?>\n<!DOCTYPE test [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>\n<root>&xxe;</root>\n\`\`\`\n\n**Detection Steps**:\n1. Find endpoints accepting XML (Content-Type: application/xml)\n2. Test with file read payloads\n3. Test blind XXE via OOB (Out-of-Band) channels\n4. Check for XXE in DOCX/XLSX uploads\n\n**Remediation**: Disable external entity processing in your XML parser.`
    }
    if (lower.includes('scope') || lower.includes('attack surface')) {
      return `**Attack Surface Analysis**\n\nTo analyze scope effectively:\n\n1. **Recon Phase**:\n   - Run \`subfinder -d target.com -all\` for subdomain discovery\n   - Use \`httpx -l subdomains.txt -status-code -tech-detect\` for live host probing\n\n2. **Endpoint Discovery**:\n   - \`gau target.com\` for historical URLs\n   - \`katana -u https://target.com -d 2\` for crawling\n\n3. **Technology Stack**:\n   - Check WAF presence: \`wafw00f https://target.com\`\n   - Look for specific versions with known CVEs\n\n4. **Common Weak Points**:\n   - Login/authentication endpoints\n   - File upload functionality\n   - API endpoints (especially GraphQL)\n   - Parameterized GET/POST requests\n\nAlways verify scope boundaries and stay within authorized targets.`
    }
    return `I've analyzed your request. Here's what I can help with:\n\n**Security Context**: For authorized bug bounty hunting and security research, I can assist with:\n- Tool configuration and command generation\n- Vulnerability analysis and detection techniques\n- Report generation and documentation\n- Security best practices and remediation advice\n\n⚠️ Remember: All JARVIS actions are monitored by the Godseye security oversight system. Stay within authorized scope.`
  }

  const handleSend = async () => {
    if (!input.trim() || processing) return

    const userText = input.trim()
    setInput('')
    setProcessing(true)

    // Check guardrails first
    const guardrailCheck = checkGuardrails(userText)

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])

    if (guardrailCheck.blocked) {
      const guardrailMsg: ChatMessage = {
        id: `block-${Date.now()}`,
        role: 'guardrail',
        content: guardrailCheck.reason,
        timestamp: new Date().toISOString(),
        blocked: true,
        blockReason: 'Violates active safety railguard',
      }
      setMessages(prev => [...prev, guardrailMsg])
      setProcessing(false)
      return
    }

    // Get AI response
    const response = await getAIResponse(userText)
    const aiMsg: ChatMessage = {
      id: `resp-${Date.now()}`,
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, aiMsg])
    setProcessing(false)
  }

  return (
    <div className="hacker-card p-4 col-span-2 flex flex-col h-[560px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-hacker-cyan text-lg">●</span>
          <h3 className="text-xs font-semibold text-hacker-text font-mono">JARVIS AI</h3>
          <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-hacker-green/10 text-hacker-green">6 ACTIVE GUARDRAILS</span>
        </div>
        <span className="text-[8px] font-mono text-hacker-text-dim/50">v1.0 · Ethical AI</span>
      </div>

      {/* Messages */}
      <div className="flex-1 bg-hacker-bg rounded p-3 font-mono text-xs space-y-2 overflow-y-auto">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={cn(
              'flex gap-2 p-2 rounded',
              msg.role === 'user' ? 'bg-hacker-surface2/50' : '',
              msg.role === 'system' ? 'bg-hacker-cyan/5 border border-hacker-cyan/10' : '',
              msg.role === 'guardrail' ? 'bg-hacker-red/5 border border-hacker-red/20' : '',
              msg.role === 'assistant' ? 'bg-hacker-surface2/30' : ''
            )}
          >
            <span className={cn(
              'font-bold flex-shrink-0 text-[10px] w-10',
              msg.role === 'user' ? 'text-hacker-green' :
              msg.role === 'assistant' ? 'text-hacker-cyan' :
              msg.role === 'guardrail' ? 'text-hacker-red' :
              'text-hacker-purple'
            )}>
              {msg.role === 'user' ? 'You' :
               msg.role === 'assistant' ? 'JARVIS' :
               msg.role === 'guardrail' ? '⛔ GUARD' :
               'SYSTEM'}
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-hacker-text-dim whitespace-pre-wrap text-[10px] leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
                {msg.content.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < msg.content.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </span>
              <p className="text-[7px] text-hacker-text-dim/20 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour12: false })}
              </p>
            </div>
          </div>
        ))}
        {processing && (
          <div className="flex gap-2 p-2">
            <span className="text-hacker-cyan font-bold text-[10px]">JARVIS</span>
            <span className="text-hacker-text-dim animate-pulse text-[10px]">processing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Guardrail indicator */}
      <div className="flex items-center gap-1.5 mt-2 px-2 py-1 rounded bg-hacker-green/5 border border-hacker-green/10">
        <span className="w-1 h-1 rounded-full bg-hacker-green animate-pulse" />
        <span className="text-[8px] font-mono text-hacker-green/70">Safety Railguards Active — All requests monitored by Godseye</span>
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-2">
        <input
          className="hacker-input flex-1 text-xs"
          placeholder="Ask JARVIS for security guidance, tool configs, or analysis..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
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

      {/* Suggestions */}
      <div className="flex gap-1.5 mt-2 overflow-x-auto">
        {suggestionPrompts.map(p => (
          <button
            key={p}
            onClick={() => setInput(p)}
            className="text-[8px] font-mono px-2 py-1 rounded bg-hacker-surface2 text-hacker-text-dim hover:text-hacker-green hover:bg-hacker-surface2/80 transition-colors whitespace-nowrap flex-shrink-0"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  )
}
