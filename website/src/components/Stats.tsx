import { useEffect, useRef, useState } from 'react'

const stats = [
  { value: 275, label: 'Weapons Armed', suffix: '+', prefix: '' },
  { value: 15, label: 'Weapon Categories', suffix: '', prefix: '' },
  { value: 12, label: 'Platform Integrations', suffix: '+', prefix: '' },
  { value: 99, label: 'Uptime Reliability', suffix: '%', prefix: '' },
]

function CountUp({ end, suffix, prefix, duration = 2000, label }: { end: number; suffix: string; prefix: string; duration?: number; label?: string }) {
  const [count, setCount] = useState(0)
  const [hasCounted, setHasCounted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasCounted) {
          setHasCounted(true)
          const startTime = Date.now()
          const tick = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * end))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, duration, hasCounted])

  return (
    <div ref={ref} className="text-center group">
      <div className="relative">
        <span className="text-3xl md:text-5xl font-black font-mono text-gradient group-hover:scale-110 inline-block transition-transform duration-300">
          {prefix}{count}{suffix}
        </span>
        {label && (
          <div className="absolute -top-1 -right-4 w-2 h-2">
            <span className="absolute inset-0 rounded-full bg-hacker-green animate-ping opacity-25" />
            <span className="absolute inset-0 rounded-full bg-hacker-green" />
          </div>
        )}
      </div>
      <p className="text-xs md:text-sm text-hacker-text-dim mt-2 font-mono">{label || ''}</p>
    </div>
  )
}

export function Stats() {
  return (
    <section className="py-16 border-y border-hacker-border/30 relative">
      {/* Scan beam effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-px bg-gradient-to-r from-transparent via-hacker-green/20 to-transparent animate-scan-beam" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat) => (
            <CountUp
              key={stat.label}
              end={stat.value}
              suffix={stat.suffix}
              prefix={stat.prefix}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
