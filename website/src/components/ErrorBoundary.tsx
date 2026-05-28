import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[BRX] Error boundary caught:', error.message)
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center p-8">
          <div className="max-w-md w-full text-center">
            {/* Icon */}
            <div className="text-6xl mb-6 font-mono text-[#ff3333] animate-pulse">!</div>

            {/* Error Code */}
            <div className="font-mono text-[#ff3333] text-xs mb-4 tracking-widest">
              BRX_CRASH_{String(this.state.error?.message.length || 0).padStart(3, '0')}
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-[#e0e0e0] mb-3 font-mono">
              SYSTEM CRASH
            </h1>

            {/* Description */}
            <p className="text-sm text-[#999] font-mono mb-6 leading-relaxed">
              An unexpected error occurred. The application has been halted to
              prevent data corruption.
            </p>

            {/* Error detail */}
            <div className="bg-[#111] border border-[#222] rounded-lg p-4 mb-6 text-left">
              <div className="text-[10px] text-[#666] font-mono mb-2">
                crash_report.dump
              </div>
              <code className="text-xs text-[#ff6666] font-mono break-all">
                {this.state.error?.message || 'Unknown error'}
              </code>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null })
                  window.location.reload()
                }}
                className="px-6 py-3 bg-[#00ff41] text-[#0a0a0a] font-bold rounded-lg text-sm font-mono hover:bg-[#00cc34] transition-colors"
              >
                Restart System →
              </button>
              <a
                href="https://github.com/vanthryx00/bugreaperx/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-transparent border border-[#333] text-[#ccc] rounded-lg text-sm font-mono hover:border-[#00ff41]/50 hover:text-[#00ff41] transition-colors"
              >
                Report Issue
              </a>
            </div>

            {/* Footer */}
            <div className="mt-8 text-[10px] text-[#444] font-mono">
              BugReaper X v4.0.0 · Sovereign Infrastructure
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
