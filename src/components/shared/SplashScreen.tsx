'use client'
import { useEffect, useState } from 'react'
import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SplashScreenProps {
  onComplete?: () => void
  delay?: number
}

export default function SplashScreen({ onComplete, delay = 2200 }: SplashScreenProps) {
  const [phase, setPhase] = useState<'visible' | 'fade-out' | 'done'>('visible')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('fade-out'), delay - 400)
    const t2 = setTimeout(() => {
      setPhase('done')
      onComplete?.()
    }, delay)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [delay, onComplete])

  if (phase === 'done') return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--bg-0)]',
        'transition-opacity duration-400',
        phase === 'fade-out' ? 'opacity-0' : 'opacity-100'
      )}
    >
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      {/* Glow */}
      <div className="absolute inset-0 glow-top" />

      {/* Logo mark */}
      <div className="relative flex flex-col items-center gap-6">
        <div
          className="w-16 h-16 rounded-2xl bg-folyx-600 flex items-center justify-center shadow-glow-lg"
          style={{ animation: 'float 2s ease-in-out infinite' }}
        >
          <Zap className="w-8 h-8 text-white" />
        </div>

        <div className="text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-gradient">
            Folyx
          </h1>
          <p className="text-sm text-[var(--t3)] mt-1 tracking-wide">
            Loading your portfolio…
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-40 h-0.5 bg-[var(--bg-3)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-folyx-500 to-accent rounded-full"
            style={{
              animation: `splash-progress ${delay - 300}ms ease-out forwards`,
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes splash-progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}
