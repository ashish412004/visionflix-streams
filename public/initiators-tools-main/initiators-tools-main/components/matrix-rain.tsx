"use client"

import { useEffect, useRef } from "react"

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Matrix characters
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?'
    const charArray = chars.split('')

    // Column setup
    const fontSize = 14
    const columns = canvas.width / fontSize
    const drops: number[] = []

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100 // Start above screen
    }

    // Animation
    const draw = () => {
      // Semi-transparent black for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Set font
      ctx.font = fontSize + 'px monospace'

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        // Random neon colors (purple and blue)
        const colors = [
          '#a855f7', // purple-500
          '#8b5cf6', // violet-500
          '#6366f1', // indigo-500
          '#3b82f6', // blue-500
          '#60a5fa', // blue-400
          '#c084fc', // purple-400
        ]
        const randomColor = colors[Math.floor(Math.random() * colors.length)]
        
        ctx.fillStyle = randomColor
        const text = charArray[Math.floor(Math.random() * charArray.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        // Reset drop to top randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        // Move drop down slowly
        drops[i] += 0.5
      }
    }

    // Animation loop
    const interval = setInterval(draw, 50)

    // Cleanup
    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ 
        opacity: 0.3,
        zIndex: -1,
        width: '100vw',
        height: '100vh',
        top: 0,
        left: 0
      }}
    />
  )
}
