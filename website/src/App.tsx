import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Features } from './components/Features'
import { ArsenalShowcase } from './components/ArsenalShowcase'
import { Stats } from './components/Stats'
import { Download } from './components/Download'
import { Testimonials } from './components/Testimonials'
import { Footer } from './components/Footer'
import { ParticleBackground } from './components/ParticleBackground'

export default function App() {
  return (
    <div className="relative min-h-screen bg-hacker-bg text-hacker-text overflow-hidden">
      <ParticleBackground />
      <div className="scanline" />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Stats />
        <Features />
        <ArsenalShowcase />
        <Testimonials />
        <Download />
        <Footer />
      </div>
    </div>
  )
}
