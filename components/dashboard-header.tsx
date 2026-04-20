"use client"

import { useState } from "react"
import { Shield, LogOut, X, MessageCircle, Zap, ShieldCheck, Headphones, DollarSign, Sun, Moon, Instagram, Volume2, VolumeX, ShoppingCart, ShoppingBag, Menu } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { CartDrawer } from "./cart-drawer"
import { WishlistDrawer } from "./wishlist-drawer"
import { WHATSAPP_URL } from "@/config/constants"
import { useSound } from "@/contexts/sound-context"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import Image from "next/image"

interface DashboardHeaderProps {
  email: string
  onLogout: () => void
}

export function DashboardHeader({ email, onLogout }: DashboardHeaderProps) {
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const { isMuted, toggleMute } = useSound()
  const { itemCount, isCartOpen, setIsCartOpen } = useCart()
  const { isWishlistOpen, setIsWishlistOpen } = useWishlist()

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-9999 backdrop-blur-xl bg-black/30 border-b border-white/10 mb-4"
      >
        <div className="max-w-7xl mx-auto px-3 py-3 md:px-4 md:py-4 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-9 h-9 md:w-12 md:h-12 overflow-hidden border border-white/20 bg-white/5 backdrop-blur-sm rounded-lg">
              <Image src="/logo.svg" alt="Initiators Tools and Services Logo - Premium Digital Subscriptions" width={48} height={48} className="w-full h-full object-contain p-1" priority />
            </div>
            <div className="px-1 md:px-2">
              <span className="font-extrabold tracking-wide text-[11px] md:text-sm lg:text-lg bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                INITIATORS TOOLS AND SERVICES
              </span>
            </div>
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
          <div className="flex md:hidden items-center gap-3">
            <button onClick={() => setIsCartOpen(true)} className="relative hover:text-purple-400 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="hover:text-purple-400 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-3">
              <button onClick={() => { toggleMute(); setShowMobileMenu(false); }} className="flex items-center gap-3 text-gray-400 hover:text-white w-full">
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="text-sm">{isMuted ? 'Unmute' : 'Mute'}</span>
              </button>
              <button onClick={() => { setShowAboutModal(true); setShowMobileMenu(false); }} className="flex items-center gap-3 text-gray-400 hover:text-white w-full">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">About Us</span>
              </button>
              <a href="https://www.instagram.com/initiators_tools_and_services" target="_blank" className="flex items-center gap-3 text-gray-400 hover:text-white w-full">
                <Instagram className="w-4 h-4" />
                <span className="text-sm">Instagram</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* About Us Modal */}
      <AnimatePresence>
        {showAboutModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-2xl p-4 md:p-8"
            >
              <button onClick={() => setShowAboutModal(false)} className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-400 hover:text-white">
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 text-center">About Initiators Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="flex items-center gap-2 md:gap-3 text-sm md:text-base"><Zap className="text-pink-400 w-4 h-4 md:w-5 md:h-5"/> <span>Instant Activation</span></div>
                <div className="flex items-center gap-2 md:gap-3 text-sm md:text-base"><ShieldCheck className="text-green-400 w-4 h-4 md:w-5 md:h-5"/> <span>Full Warranty</span></div>
                <div className="flex items-center gap-2 md:gap-3 text-sm md:text-base"><DollarSign className="text-yellow-400 w-4 h-4 md:w-5 md:h-5"/> <span>Best Prices</span></div>
                <div className="flex items-center gap-2 md:gap-3 text-sm md:text-base"><Headphones className="text-blue-400 w-4 h-4 md:w-5 md:h-5"/> <span>24/7 Support</span></div>
              </div>
              <div className="mt-6 md:mt-8 flex gap-2 md:gap-4">
                <button onClick={() => window.open(WHATSAPP_URL)} className="flex-1 py-2.5 md:py-3 bg-green-600 rounded-xl font-bold text-xs md:text-sm">WhatsApp</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </>
  )
}