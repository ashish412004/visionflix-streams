"use client"

import { useState, useEffect } from "react"
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
  const [isShrunk, setIsShrunk] = useState(false)
  const { isMuted, toggleMute } = useSound()

  useEffect(() => {
    const handleScroll = () => {
      setIsShrunk(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const { itemCount, isCartOpen, setIsCartOpen } = useCart()
  const { isWishlistOpen, setIsWishlistOpen } = useWishlist()

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl bg-black/30 border-b border-white/10 transition-all duration-300 ease ${isShrunk ? 'py-2' : 'py-3 md:py-4'}`}
      >
        <div className="max-w-7xl mx-auto px-3 md:px-4 flex items-center justify-between">
          {/* Logo Section - Clickable to scroll to top */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 md:gap-3 cursor-pointer select-none"
          >
            <div className={`transition-all duration-300 ${isShrunk ? 'w-8 h-8 md:w-10 md:h-10' : 'w-9 h-9 md:w-12 md:h-12'}`}>
              <Image 
                src="/logo.png" 
                alt="VisionFlix Logo" 
                width={40} 
                height={40} 
                className="w-full h-full rounded-full object-cover shadow-[0_0_8px_rgba(255,255,255,0.8),0_0_18px_rgba(229,9,20,0.9)]" 
                priority 
              />
            </div>
            <div className="px-1 md:px-2">
              <div className={`flex items-baseline gap-0.5 transition-all duration-300 ${isShrunk ? 'text-[10px] md:text-xs lg:text-sm' : 'text-[11px] md:text-sm lg:text-lg'}`} style={{ fontFamily: "'Inter', 'Poppins', 'Montserrat', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif" }}>
                <span className="font-extrabold tracking-[0.15em] text-white uppercase">
                  VISION
                </span>
                <span className="font-extrabold tracking-[0.15em] text-red-600 uppercase">
                  FLIX
                </span>
                <span className="font-extrabold tracking-[0.15em] text-gray-400 uppercase">
                  STREAMS
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 text-xs text-gray-400">
            <motion.button onClick={toggleMute} whileHover={{ scale: 1.1 }} className="hover:text-red-500">
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </motion.button>
            
            <button onClick={() => setShowAboutModal(true)} className="hover:text-red-500 transition-colors">
              About Us
            </button>

            <button onClick={() => setIsCartOpen(true)} className="relative hover:text-red-500 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Right Icons */}
          <div className="flex md:hidden items-center gap-3">
            <button onClick={() => setIsCartOpen(true)} className="relative hover:text-red-500 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="hover:text-red-500 transition-colors">
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
              <a href="https://www.instagram.com/visionflixstreams" target="_blank" className="flex items-center gap-3 text-gray-400 hover:text-white w-full">
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
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-2xl p-4 md:p-8"
            >
              <button onClick={() => setShowAboutModal(false)} className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-400 hover:text-white">
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 text-center">About VisionFlix Streams</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="flex items-center gap-2 md:gap-3 text-sm md:text-base"><Zap className="text-red-500 w-4 h-4 md:w-5 md:h-5"/> <span>Instant Activation</span></div>
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