"use client"

import { motion } from "framer-motion"
import { Shield } from "lucide-react"

export function GateTransition() {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Left Gate */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: "-100%" }}
        transition={{ duration: 1, delay: 0.5, ease: [0.65, 0, 0.35, 1] }}
        className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-[#0a0a1a] to-[#1a0a2a] border-r border-purple-500/30"
      >
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-purple-500/20" />
        {/* Gate Pattern */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i}
              className="absolute right-4 w-1 bg-gradient-to-b from-transparent via-purple-500 to-transparent"
              style={{ 
                top: `${i * 10}%`, 
                height: '8%',
                opacity: 0.5 + (i % 3) * 0.2
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Right Gate */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: "100%" }}
        transition={{ duration: 1, delay: 0.5, ease: [0.65, 0, 0.35, 1] }}
        className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#0a0a1a] to-[#1a0a2a] border-l border-purple-500/30"
      >
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-l from-transparent to-purple-500/20" />
        {/* Gate Pattern */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i}
              className="absolute left-4 w-1 bg-gradient-to-b from-transparent via-red-500 to-transparent"
              style={{ 
                top: `${i * 10}%`, 
                height: '8%',
                opacity: 0.5 + (i % 3) * 0.2
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Center Logo */}
      <motion.div
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.5, delay: 0 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
      >
        <div className="flex items-center gap-3 bg-gradient-to-r from-red-600/40 to-red-500/40 border border-red-500/60 rounded-full px-6 py-3 backdrop-blur-lg">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-red-400 font-bold tracking-wider text-lg">VisionFlix Streams</span>
        </div>
      </motion.div>

      {/* Light Burst Effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 0.8, 0], scale: [0.5, 2, 3] }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-to-r from-red-600 to-red-500 blur-3xl"
      />
    </div>
  )
}
