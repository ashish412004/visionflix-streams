"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, CheckCircle, Clock, Package } from "lucide-react"

export function WarrantyCheck() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [result, setResult] = useState<{
    status: 'Active' | 'Not Found' | 'Checking...' | null
    daysRemaining?: number
    originalPlan?: string
  }>({ status: null })

  const handleCheck = () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      setResult({ status: 'Not Found' })
      return
    }

    setResult({ status: 'Checking...' })
    
    // Simulate API call
    setTimeout(() => {
      setResult({
        status: 'Active',
        daysRemaining: 280,
        originalPlan: 'OTT Personal'
      })
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2a] to-[#0a0a1a] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Warranty Status
            </h1>
            <p className="text-gray-300 text-sm">
              Check your subscription warranty status
            </p>
          </div>

          {/* Input Section */}
          <div className="mb-8">
            <label className="block text-white font-medium mb-3">
              Enter Your Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter 10-digit phone number"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition-all duration-300"
                maxLength={10}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Package className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Check Button */}
          <div className="text-center mb-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheck}
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-xl shadow-lg hover:from-red-700 hover:to-red-600 transition-all duration-300"
            >
              Check Status
            </motion.button>
          </div>

          {/* Result Display */}
          <AnimatePresence>
            {result.status && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`p-6 rounded-xl border ${
                  result.status === 'Active' 
                    ? 'bg-green-500/20 border-green-500/50' 
                    : result.status === 'Not Found'
                    ? 'bg-red-500/20 border-red-500/50'
                    : 'bg-blue-500/20 border-blue-500/50'
                }`}
              >
                <div className="flex items-center justify-center mb-4">
                  {result.status === 'Active' && (
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  )}
                  {result.status === 'Not Found' && (
                    <Shield className="w-8 h-8 text-red-400" />
                  )}
                  {result.status === 'Checking...' && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Clock className="w-8 h-8 text-blue-400" />
                    </motion.div>
                  )}
                </div>

                <div className="text-center">
                  <h3 className={`text-lg font-bold mb-2 ${
                    result.status === 'Active' ? 'text-green-400' : 
                    result.status === 'Not Found' ? 'text-red-400' : 
                    'text-blue-400'
                  }`}>
                    Status: {result.status}
                  </h3>
                  
                  {result.status === 'Active' && result.daysRemaining && (
                    <div className="space-y-2">
                      <p className="text-white">
                        <span className="text-gray-400">Days Remaining:</span>
                        <span className="text-green-400 font-bold text-xl ml-2">{result.daysRemaining}</span>
                      </p>
                      <p className="text-white">
                        <span className="text-gray-400">Original Plan:</span>
                        <span className="text-red-500 font-semibold ml-2">{result.originalPlan}</span>
                      </p>
                    </div>
                  )}

                  {result.status === 'Not Found' && (
                    <p className="text-red-400">
                      No warranty found for this phone number. Please contact support.
                    </p>
                  )}

                  {result.status === 'Checking...' && (
                    <p className="text-blue-400">
                      Checking warranty status...
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back Button */}
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-gray-300 hover:text-white transition-all duration-300"
            >
              Back to Dashboard
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
