import { useState, useCallback } from 'react'
import { cn } from '../lib/utils'

declare const window: Window & {
  electronAPI?: {
    makeHttpRequest: (options: { method: string; url: string; headers: string; body: string }) => Promise<{
      status: number
      statusText: string
      headers: string
      body: string
    }>
  }
}

const methodOptions = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD']

const defaultRequest = [
  'GET / HTTP/1.1',
  'Host: example.com',
  'User-Agent: BugReaperX/4.0',
  'Accept: */*',
  '',
].join('\n')

interface RequestHistory {
  id: number
  method: string
  url: string
  status: number
  timestamp: string
}

export function RepeaterPage() {
  const [method, setMethod] = useState('GET')
  const [url, setUrl] = useState('https://example.com')
  const [headers, setHeaders] = useState('Host: example.com\nUser-Agent: BugReaperX/4.0\nAccept: */*')
  const [body, setBody] = useState('')
  const [response, setResponse] = useState<{ status: number; statusText: string; headers: string; body: string } | null>(null)
  const [sending, setSending] = useState(false)
  const [history, setHistory] = useState<RequestHistory[]>([])
  const [error, setError] = useState<string | null>(null)
  const [rawMode, setRawMode] = useState(false)

  const parseRawRequest = useCallback((raw: string) => {
    const lines = raw.split('\n')
    const firstLine = lines[0].split(' ')
    const parsedMethod = firstLine[0] || 'GET'
    const parsedPath = firstLine[1] || '/'
    const headerEnd = lines.findIndex(l => l.trim() === '')
    const headerLines = lines.slice(1, headerEnd > 0 ? headerEnd : lines.length)
    const bodyLines = headerEnd > 0 ? lines.slice(headerEnd + 1).filter(l => l.trim()) : []

    // Extract host to construct URL
    const hostLine = headerLines.find(l => l.toLowerCase().startsWith('host:'))
    const host = hostLine?.split(':').slice(1).join(':').trim() || 'example.com'
    const scheme = url.startsWith('https') ? 'https' : 'http'

    setMethod(parsedMethod)
    setUrl(`${scheme}://${host}${parsedPath}`)
    setHeaders(headerLines.join('\n'))
    setBody(bodyLines.join('\n'))
  }, [url])

  const handleFire = async () => {
    setSending(true)
    setError(null)
    setResponse(null)

    if (!url.trim()) {
      setError('URL is required')
      setSending(false)
      return
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('URL must start with http:// or https://')
      setSending(false)
      return
    }

    try {
      const result = await window.electronAPI?.makeHttpRequest({
        method,
        url,
        headers,
        body,
      })

      if (result) {
        setResponse(result)
        setHistory(prev => [{
          id: Date.now(),
          method,
          url,
          status: result.status,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        }, ...prev].slice(0, 25))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-hacker-text-bright font-mono tracking-wide">▸ REPEATER</h1>
        <p className="text-sm text-hacker-text-dim mt-1 font-mono">HTTP request crafting · Live response viewer</p>
      </div>

      {/* Request Controls */}
      <div className="flex items-center gap-2">
        <select
          className="hacker-input w-24 text-xs"
          value={method}
          onChange={e => setMethod(e.target.value)}
        >
          {methodOptions.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <input
          className="hacker-input flex-1 text-xs font-mono"
          placeholder="https://target.com/path"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleFire()}
        />
        <button
          onClick={handleFire}
          disabled={sending}
          className={cn(
            'px-5 py-1.5 rounded text-xs font-bold font-mono uppercase tracking-wider transition-all duration-200 flex-shrink-0',
            sending
              ? 'bg-hacker-amber/20 text-hacker-amber cursor-wait animate-pulse'
              : 'bg-hacker-red/20 text-hacker-red hover:bg-hacker-red/30 hover:shadow-[0_0_15px_rgba(255,51,51,0.2)]'
          )}
        >
          {sending ? '▸ SENDING...' : '▸ FIRE'}
        </button>
        <button
          onClick={() => setRawMode(!rawMode)}
          className={cn(
            'px-2.5 py-1.5 rounded text-[10px] font-mono transition-colors',
            rawMode ? 'text-hacker-cyan bg-hacker-cyan/10' : 'text-hacker-text-dim hover:text-hacker-text'
          )}
        >
          RAW
        </button>
      </div>

      {error && (
        <div className="hacker-card p-3 border-hacker-red/30 bg-hacker-red/5">
          <p className="text-xs font-mono text-hacker-red">{error}</p>
        </div>
      )}

      {/* Editor + Response */}
      <div className="grid grid-cols-2 gap-4">
        {/* Request Editor */}
        <div className="hacker-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold text-hacker-cyan font-mono">REQUEST</h3>
              {!rawMode && <span className="text-[10px] font-mono text-hacker-text-dim">structured</span>}
            </div>
            {rawMode && (
              <div className="text-[10px] font-mono text-hacker-text-dim/50">
                Raw HTTP · First line is parsed
              </div>
            )}
          </div>
          {rawMode ? (
            <textarea
              className="hacker-input w-full h-80 resize-none font-mono text-xs leading-relaxed"
              value={`${method} / HTTP/1.1\n${headers}${body ? `\n\n${body}` : ''}`}
              onChange={e => parseRawRequest(e.target.value)}
              spellCheck={false}
            />
          ) : (
            <div className="space-y-2">
              <div>
                <label className="text-[10px] font-mono text-hacker-text-dim block mb-1">Headers</label>
                <textarea
                  className="hacker-input w-full h-40 resize-none font-mono text-xs leading-relaxed"
                  value={headers}
                  onChange={e => setHeaders(e.target.value)}
                  spellCheck={false}
                  placeholder="Host: example.com\nUser-Agent: BugReaperX/4.0\nContent-Type: application/json"
                />
              </div>
              {(method === 'POST' || method === 'PUT' || method === 'PATCH') && (
                <div>
                  <label className="text-[10px] font-mono text-hacker-text-dim block mb-1">Body</label>
                  <textarea
                    className="hacker-input w-full h-32 resize-none font-mono text-xs leading-relaxed"
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    spellCheck={false}
                    placeholder='{"key": "value"}'
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Response Viewer */}
        <div className="hacker-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold text-hacker-green font-mono">RESPONSE</h3>
              {response && (
                <span className={cn(
                  'text-[10px] font-mono px-1.5 py-0.5 rounded',
                  response.status >= 200 && response.status < 300 ? 'bg-hacker-green/10 text-hacker-green' :
                  response.status >= 300 && response.status < 400 ? 'bg-hacker-cyan/10 text-hacker-cyan' :
                  response.status >= 400 && response.status < 500 ? 'bg-hacker-amber/10 text-hacker-amber' :
                  response.status >= 500 ? 'bg-hacker-red/10 text-hacker-red' :
                  'bg-hacker-text-dim/10 text-hacker-text-dim'
                )}>
                  {response.status} {response.statusText}
                </span>
              )}
            </div>
            {response && (
              <button
                onClick={() => setResponse(null)}
                className="hacker-btn-ghost text-[10px]"
              >
                clear
              </button>
            )}
          </div>
          <div className={cn(
            'h-80 bg-hacker-bg rounded p-3 font-mono text-xs overflow-y-auto transition-all duration-300',
            sending ? 'opacity-50' : 'opacity-100'
          )}>
            {sending ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-hacker-amber animate-pulse text-sm mb-2">◉</p>
                  <p className="text-[10px] font-mono text-hacker-text-dim">Sending request...</p>
                  <p className="text-[8px] font-mono text-hacker-text-dim/50 mt-1">{method} {url}</p>
                </div>
              </div>
            ) : response ? (
              <div className="space-y-3">
                <div>
                  <p className="text-[9px] text-hacker-text-dim font-mono mb-1 uppercase tracking-wider">Headers</p>
                  <pre className="text-hacker-text-dim/70 whitespace-pre-wrap break-all">{response.headers}</pre>
                </div>
                <div>
                  <p className="text-[9px] text-hacker-text-dim font-mono mb-1 uppercase tracking-wider">Body</p>
                  <pre className="text-hacker-text-dim whitespace-pre-wrap break-all">{response.body}</pre>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-hacker-text-dim/40">
                <p className="text-center">
                  <span className="block text-2xl mb-2">◉</span>
                  <span className="text-xs">Hit FIRE to send request</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="hacker-card p-3">
          <h3 className="text-[10px] font-semibold text-hacker-text-dim font-mono mb-2 uppercase tracking-wider">Request History</h3>
          <div className="space-y-1">
            {history.map(h => (
              <div key={h.id} className="flex items-center gap-3 text-[10px] font-mono px-2 py-1 rounded hover:bg-hacker-surface2">
                <span className="text-hacker-text-dim/50 w-16">{h.timestamp}</span>
                <span className={cn(
                  'px-1 py-0.5 rounded text-[9px] font-bold',
                  h.method === 'GET' ? 'text-hacker-green' :
                  h.method === 'POST' ? 'text-hacker-amber' :
                  h.method === 'DELETE' ? 'text-hacker-red' : 'text-hacker-cyan'
                )}>{h.method}</span>
                <span className="text-hacker-text-dim flex-1 truncate">{h.url}</span>
                <span className={cn(
                  h.status >= 200 && h.status < 300 ? 'text-hacker-green' :
                  h.status >= 400 ? 'text-hacker-red' : 'text-hacker-cyan'
                )}>{h.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
