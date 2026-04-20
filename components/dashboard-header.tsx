"use client"

import { useState } from "react"
import { Shield, LogOut, X, MessageCircle, Zap, ShieldCheck, Headphones, DollarSign, Sun, Moon, Instagram, Volume2, VolumeX, ShoppingCart, ShoppingBag } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { FlashSaleBanner } from "./flash-sale-banner"
import { CartDrawer } from "./cart-drawer"
import { WHATSAPP_URL } from "@/config/constants"
import { useSound } from "@/contexts/sound-context"
import { useCart } from "@/contexts/cart-context"

interface DashboardHeaderProps {
  email: string
  onLogout: () => void
}

export function DashboardHeader({ email, onLogout }: DashboardHeaderProps) {
  const [showAboutModal, setShowAboutModal] = useState(false)
  const { isMuted, toggleMute } = useSound()
  const { itemCount } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <>
      <FlashSaleBanner />
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-9999 backdrop-blur-xl bg-black/30 border-b border-white/10 mb-4"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 overflow-hidden border border-white/20 bg-white/5 backdrop-blur-sm rounded-lg">
              <img src="/logo.svg" alt="Logo" className="w-full h-full object-contain p-1" />
            </div>
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px rgba(99, 102, 241, 0.3)",
                  "0 0 30px rgba(168, 85, 247, 0.4)",
                  "0 0 20px rgba(99, 102, 241, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="px-2"
            >
              <span className="font-bold tracking-wide text-sm md:text-lg bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                INITIATORS TOOLS AND SERVICES
              </span>
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 text-xs text-gray-400">
            <motion.button onClick={toggleMute} whileHover={{ scale: 1.1 }} className="hover:text-purple-400">
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </motion.button>
            
            <button onClick={() => setShowAboutModal(true)} className="hover:text-purple-400 transition-colors">
              About Us
            </button>

            <button onClick={() => setIsCartOpen(true)} className="relative hover:text-purple-400 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Right Icons */}
          <div className="flex md:hidden items-center gap-4">
             <a href="https://www.instagram.com/initiators_tools_and_services" target="_blank">
                <Instagram className="w-5 h-5 text-gray-400" />
             </a>
          </div>
        </div>
      </motion.header>

      {/* About Us Modal */}
      <AnimatePresence>
        {showAboutModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-2xl p-8"
            >
              <button onClick={() => setShowAboutModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-white mb-4 text-center">About Initiators Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3"><Zap className="text-pink-400"/> <span>Instant Activation</span></div>
                <div className="flex items-center gap-3"><ShieldCheck className="text-green-400"/> <span>Full Warranty</span></div>
                <div className="flex items-center gap-3"><DollarSign className="text-yellow-400"/> <span>Best Prices</span></div>
                <div className="flex items-center gap-3"><Headphones className="text-blue-400"/> <span>24/7 Support</span></div>
              </div>
              <div className="mt-8 flex gap-4">
                <button className="flex-1 py-3 bg-blue-600 rounded-xl font-bold">Join Telegram</button>
                <button onClick={() => window.open(WHATSAPP_URL)} className="flex-1 py-3 bg-green-600 rounded-xl font-bold">WhatsApp</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* 🚀 FIXED FLOATING CART BUTTON - AUTO HIDE & Z-INDEX FIX */}
      <div className={`fixed inset-0 pointer-events-none flex items-end justify-end md:hidden ${isCartOpen ? 'hidden' : 'z-10'} transition-all duration-300`}>
        <button 
          onClick={() => setIsCartOpen(true)}
          className="pointer-events-auto absolute bottom-44 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-pink-600 text-white shadow-[0_15px_30px_-5px_rgba(236,72,153,0.6)] border-2 border-white/20 transition-all hover:scale-110 active:scale-95"
        >
          <ShoppingBag className="h-7 w-7" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[12px] font-bold text-pink-600 shadow-md">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </>
  )
}