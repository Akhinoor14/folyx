'use client'
import { useEffect, useRef } from 'react'

export default function CursorEffect() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    let mouseX = 0, mouseY = 0
    let ringX  = 0, ringY  = 0

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX; mouseY = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`
      }
    }

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px)`
      }
      requestAnimationFrame(animate)
    }

    // Grow on hoverable elements
    const onEnter = () => ringRef.current?.classList.add('cursor-grow')
    const onLeave = () => ringRef.current?.classList.remove('cursor-grow')
    const targets = document.querySelectorAll('a, button, [role="button"]')
    targets.forEach(el => { el.addEventListener('mouseenter', onEnter); el.addEventListener('mouseleave', onLeave) })

    window.addEventListener('mousemove', onMouseMove)
    const raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(raf)
      targets.forEach(el => { el.removeEventListener('mouseenter', onEnter); el.removeEventListener('mouseleave', onLeave) })
    }
  }, [])

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-folyx-400 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{ willChange: 'transform' }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-folyx-400/50 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-[width,height,opacity] duration-200"
        style={{ willChange: 'transform' }}
      />
      <style>{`
        .cursor-grow { width: 3rem !important; height: 3rem !important; border-color: rgba(93,110,245,0.8) !important; }
        @media (pointer: coarse) { }
      `}</style>
    </>
  )
}
