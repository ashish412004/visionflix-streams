"use client"

import { useState } from "react"
import { Shield, LogOut, X, MessageCircle, Zap, ShieldCheck, Headphones, DollarSign, Sun, Moon, Instagram } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { FlashSaleBanner } from "./flash-sale-banner"
import { WHATSAPP_URL } from "@/config/constants"

interface DashboardHeaderProps {
  email: string
  onLogout: () => void
}

export function DashboardHeader({ email, onLogout }: DashboardHeaderProps) {
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  return (
    <>
      <FlashSaleBanner />
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-40 backdrop-blur-xl bg-[#0a0a1a]/80 border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-400/50 bg-white">
                <img src="/logo.svg" alt="Logo" className="w-full h-full object-contain p-1" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-pink-400 font-bold tracking-wide text-lg">INITIATORS TOOL AND SERVICES</span>
              </div>
            </div>
          
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-4">
              <motion.a
                href="https://www.instagram.com/initiators_tools_and_services?igsh=c2w2eGc5OXJrd2o4"
                target="_blank"
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => {}}
                className="relative group"
              >
                <motion.div
                  animate={{ 
                    rotate: isDarkMode ? 360 : 0,
                    scale: [1, 1.1]
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Instagram 
                    className={`w-5 h-5 transition-all duration-300 ${
                      isDarkMode ? "text-gray-400 opacity-80" : "text-white opacity-80"
                    }`}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 0, y: -5 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap pointer-events-none"
                >
                  Follow us on Instagram
                </motion.div>
              </motion.a>
              <a 
                href="#about-us"
                onClick={(e) => {
                  e.preventDefault()
                  setShowAboutModal(true)
                }}
                className="text-gray-400 hover:text-pink-400 text-sm font-medium transition-colors duration-200"
              >
                About Us
              </a>
            </nav>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
            <span className="text-gray-400 text-sm">Welcome,</span>
            <span className="text-white font-medium text-sm">{email}</span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-gray-300 hover:text-white"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </motion.header>

      {/* About Us Modal */}
      <AnimatePresence>
        {showAboutModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="relative w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowAboutModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>

              {/* Content */}
              <div className="p-6 md:p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    About Initiators Tools & Services
                  </h2>
                  <p className="text-gray-300 text-sm md:text-base">
                    Your One-Stop Shop for Premium Digital Subscriptions
                  </p>
                </div>

                {/* Key Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-pink-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Instant Activation</h3>
                      <p className="text-gray-400 text-sm">Get your login details within minutes.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Full Warranty</h3>
                      <p className="text-gray-400 text-sm">100% replacement guarantee for entire duration.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Best Prices</h3>
                      <p className="text-gray-400 text-sm">Unbeatable rates for OTT, AI, and Softwares.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center">
                      <Headphones className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">24/7 Support</h3>
                      <p className="text-gray-400 text-sm">Dedicated WhatsApp support for all customers.</p>
                    </div>
                  </div>
                </div>

                {/* Mission Statement */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
                  <h3 className="text-white font-semibold mb-4 text-center">Our Mission</h3>
                  <p className="text-gray-300 text-center leading-relaxed">
                    Providing affordable access to premium tools for students, creators, and professionals. 
                    We believe everyone deserves access to the best digital services without breaking the bank.
                  </p>
                </div>

                {/* Contact Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300">
                    Join our Telegram
                  </button>
                  <button 
                    onClick={() => window.open(`${WHATSAPP_URL}?text=Hi, I want to know more about your services`, '_blank')}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
                  >
                    Contact on WhatsApp
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
