"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

export function FlashSaleBanner() {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 10 })
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds
        
        if (totalSeconds <= 0) {
          clearInterval(timer)
          return { hours: 0, minutes: 0, seconds: 0 }
        }

        const newTotalSeconds = totalSeconds - 1
        const hours = Math.floor(newTotalSeconds / 3600)
        const minutes = Math.floor((newTotalSeconds % 3600) / 60)
        const seconds = newTotalSeconds % 60

        return { hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (time: { hours: number, minutes: number, seconds: number }) => {
    const h = time.hours.toString().padStart(2, '0')
    const m = time.minutes.toString().padStart(2, '0')
    const s = time.seconds.toString().padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  if (!isVisible || (timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0)) {
    return null
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 shadow-lg"
        >
          <div className="relative">
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-4 w-6 h-6 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/30 transition-colors duration-200"
            >
              <X className="w-3 h-3 text-black" />
            </button>
            
            <div className="px-6 py-3 text-center">
              <div className="flex items-center justify-center gap-3">
                <span className="text-black font-bold text-sm">🔥 FLASH SALE:</span>
                <span className="text-black font-bold">YouTube Premium @ ₹799/yr</span>
                <span className="text-black font-semibold">for next</span>
                <span className="bg-black/20 px-2 py-1 rounded font-mono font-bold text-black">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-black font-semibold">! Buy Now</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
