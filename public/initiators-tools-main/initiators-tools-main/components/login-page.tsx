"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Shield } from "lucide-react"
import Image from "next/image"

interface User {
  email: string
  password: string
}

interface LoginPageProps {
  onLogin: (email: string) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState("")

  // Get registered users from localStorage
  const getRegisteredUsers = () => {
    const users = localStorage.getItem("registeredUsers")
    return users ? JSON.parse(users) : []
  }

  // Save user to localStorage
  const saveUser = (email: string, password: string) => {
    const users = getRegisteredUsers()
    users.push({ email, password })
    localStorage.setItem("registeredUsers", JSON.stringify(users))
  }

  // Check if user is already registered
  const isUserRegistered = (email: string) => {
    const users = getRegisteredUsers()
    return users.some((user: User) => user.email === email)
  }

  // Handle login
  const handleLogin = () => {
    const users = getRegisteredUsers()
    const user = users.find((u: User) => u.email === email && u.password === password)
    
    if (user) {
      onLogin(email)
    } else {
      setError("Invalid email or password")
    }
  }

  // Handle registration
  const handleRegister = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (isUserRegistered(email)) {
      setError("Email already registered")
      return
    }

    saveUser(email, password)
    setError("")
    onLogin(email)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!email || !password) {
      setError("Please fill all fields")
      return
    }

    if (isRegister) {
      handleRegister()
    } else {
      handleLogin()
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Animated background gradients */}
      <div className="absolute inset-0 bg-[#0a0a1a]">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[150px]" />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Logo Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            <div className="flex items-center gap-3 bg-gradient-to-r from-red-600/30 to-red-500/30 border border-red-500/50 rounded-full px-5 py-2">
              <div className="w-8 h-8">
                <Image 
                  src="/logo.png" 
                  alt="VisionFlix Logo" 
                  width={40} 
                  height={40} 
                  className="w-full h-full rounded-full object-cover shadow-[0_0_8px_rgba(255,255,255,0.8),0_0_18px_rgba(229,9,20,0.9)]" 
                />
              </div>
              <span className="text-red-500 font-semibold tracking-wide">VISIONFLIX STREAMS</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-3xl font-bold text-center text-white mb-6 tracking-wide"
          >
            {isRegister ? "CREATE ACCOUNT" : "PLATFORM VISIONFLIX STREAMS"}
          </motion.h1>

          {/* Mode Toggle */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-white/5 border border-white/10 rounded-full p-1 flex">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false)
                  setError("")
                  setConfirmPassword("")
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  !isRegister 
                    ? "bg-gradient-to-r from-red-500 to-purple-500 text-white" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true)
                  setError("")
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isRegister 
                    ? "bg-gradient-to-r from-red-500 to-purple-500 text-white" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Register
              </button>
            </div>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg"
            >
              <p className="text-red-400 text-sm text-center">{error}</p>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-gray-300 text-sm mb-2 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-gray-300 text-sm mb-2 font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                required
              />
            </motion.div>

            {/* Confirm Password for Register */}
            {isRegister && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 }}
              >
                <label className="block text-gray-300 text-sm mb-2 font-medium">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  required
                />
              </motion.div>
            )}

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white font-bold rounded-lg shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300 uppercase tracking-wider text-sm"
            >
              {isRegister ? "Create Account" : "Explore OTTs and Softwares Services"}
            </motion.button>
          </form>


          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 pt-6 border-t border-white/10"
          >
            <p className="text-center text-gray-300 text-sm font-medium">
              Trusted by <span className="text-red-500 font-bold">5000+</span> Customers
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
