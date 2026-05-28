import { useEffect, useRef, useState } from 'react'

const stats = [
  { value: 275, label: 'Weapons Armed', suffix: '+', prefix: '' },
  { value: 15, label: 'Weapon Categories', suffix: '', prefix: '' },
  { value: 12, label: 'Platform Integrations', suffix: '+', prefix: '' },
  { value: 99, label: 'Uptime Reliability', suffix: '%', prefix: '' },
]

function CountUp({ end, suffix, prefix, duration = 2000 }: { end: number; suffix: string; prefix: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const counted = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true
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
  }, [end, duration])

  return (
    <div ref={ref} className="text-center">
      <span className="text-3xl md:text-4xl font-black font-mono text-gradient">
        {prefix}{count}{suffix}
      </span>
    </div>
  )
}

export function Stats() {
  return (
    <section className="py-16 border-y border-hacker-border/30 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <CountUp end={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              <p className="text-sm text-hacker-text-dim mt-2 font-mono">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
