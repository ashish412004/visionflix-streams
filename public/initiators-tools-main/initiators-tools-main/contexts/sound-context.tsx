"use client"

import { createContext, useContext, useState, useRef, useCallback, ReactNode } from "react"
import useLocalStorage from "@/hooks/useLocalStorage"

interface SoundContextType {
  isMuted: boolean
  toggleMute: () => void
  playHoverSound: () => void
  playClickSound: () => void
}

const SoundContext = createContext<SoundContextType | undefined>(undefined)

export function SoundProvider({ children }: { children: ReactNode }) {
  // Use localStorage to persist mute state across sessions
  const [isMuted, setIsMuted] = useLocalStorage<boolean>('sound-muted', false)
  const hoverSoundRef = useRef<HTMLAudioElement | null>(null)
  const clickSoundRef = useRef<HTMLAudioElement | null>(null)
  const [soundsLoaded, setSoundsLoaded] = useState(false)

  // Load sounds on first interaction
  const loadSounds = useCallback(() => {
    if (!soundsLoaded) {
      // Create audio elements with base64 encoded sounds
      // Using Web Audio API for better control and no external files
      setSoundsLoaded(true)
    }
  }, [soundsLoaded])

  // Generate hover sound using Web Audio API
  const playHoverSound = useCallback(() => {
    if (isMuted) return
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Short tick sound
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.05)
      
      gainNode.gain.setValueAtTime(0.03, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.05)
    } catch (error) {
      console.error('Error playing hover sound:', error)
    }
  }, [isMuted])

  // Generate click sound using Web Audio API
  const playClickSound = useCallback(() => {
    if (isMuted) return
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Mechanical click sound
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.03)
      
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.03)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.03)
    } catch (error) {
      console.error('Error playing click sound:', error)
    }
  }, [isMuted])

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev)
  }, [])

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, playHoverSound, playClickSound }}>
      {children}
    </SoundContext.Provider>
  )
}

export function useSound() {
  const context = useContext(SoundContext)
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider')
  }
  return context
}
