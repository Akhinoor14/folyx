'use client'
import { Suspense, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, Center, Html } from '@react-three/drei'
import { Loader2, RotateCcw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 text-[var(--t3)]">
        <Loader2 className="w-6 h-6 animate-spin text-folyx-400" />
        <p className="text-xs">Loading 3D model…</p>
      </div>
    </Html>
  )
}

interface ModelViewerProps {
  glbUrl: string
  title?: string
  height?: string
}

export default function ModelViewer({ glbUrl, title, height = '400px' }: ModelViewerProps) {
  const controlsRef = useRef<any>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div ref={containerRef}
      className="relative rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg-1)]"
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      {/* Label */}
      {title && (
        <div className="absolute top-3 left-3 z-10 badge badge-primary text-xs">{title}</div>
      )}

      {/* Controls */}
      <div className="absolute top-3 right-3 z-10 flex gap-1.5">
        <button onClick={resetCamera}
          className="w-8 h-8 rounded-lg bg-[var(--bg-2)]/80 backdrop-blur-sm border border-[var(--border)] flex items-center justify-center text-[var(--t2)] hover:text-white transition-colors"
          title="Reset view">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button onClick={toggleFullscreen}
          className="w-8 h-8 rounded-lg bg-[var(--bg-2)]/80 backdrop-blur-sm border border-[var(--border)] flex items-center justify-center text-[var(--t2)] hover:text-white transition-colors"
          title="Fullscreen">
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hint */}
      <p className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 text-xs text-[var(--t3)] bg-[var(--bg-2)]/60 backdrop-blur-sm px-3 py-1 rounded-full border border-[var(--border)]">
        Drag to rotate · Scroll to zoom
      </p>

      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ antialias: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Environment preset="city" />
        <Suspense fallback={<LoadingFallback />}>
          <Center>
            <Model url={glbUrl} />
          </Center>
        </Suspense>
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}
