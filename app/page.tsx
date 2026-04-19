"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { LoginPage } from "@/components/login-page"
import { GateTransition } from "@/components/gate-transition"
import { Dashboard } from "@/components/dashboard"
import { WishlistProvider } from "@/contexts/wishlist-context"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showTransition, setShowTransition] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  const handleLogin = (email: string) => {
    setUserEmail(email)
    setShowTransition(true)
    
    // After gate animation completes, show dashboard
    setTimeout(() => {
      setIsLoggedIn(true)
    }, 1500)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setShowTransition(false)
    setUserEmail("")
  }

  return (
    <WishlistProvider>
      <main className="min-h-screen">
        <AnimatePresence mode="wait">
          {!isLoggedIn && !showTransition && (
            <LoginPage key="login" onLogin={handleLogin} />
          )}
        </AnimatePresence>

        {/* Gate Transition Animation */}
        <AnimatePresence>
          {showTransition && !isLoggedIn && (
            <GateTransition key="gate" />
          )}
        </AnimatePresence>

        {/* Dashboard */}
        <AnimatePresence>
          {isLoggedIn && (
            <Dashboard key="dashboard" email={userEmail} onLogout={handleLogout} />
          )}
        </AnimatePresence>
      </main>
    </WishlistProvider>
  )
}
