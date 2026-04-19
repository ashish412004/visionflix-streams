"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { DashboardHeader } from "./dashboard-header"
import { SeriesCarousel } from "./series-carousel"
import { SubscriptionCards } from "./subscription-cards"
import { WhatsAppButton } from "./whatsapp-button"
import { WishlistButton } from "./wishlist-button"
import { WishlistModal } from "./wishlist-modal"
import { AboutUs } from "./about-us"
import { RecentSalesToast } from "./recent-sales-toast"

interface DashboardProps {
  email: string
  onLogout: () => void
}

export function Dashboard({ email, onLogout }: DashboardProps) {
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const subscriptionRef = useRef<HTMLDivElement>(null)

  const scrollToSubscriptions = () => {
    subscriptionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2a] to-[#0a0a1a]"
    >
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[150px]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <DashboardHeader email={email} onLogout={onLogout} />
        <SeriesCarousel />
        <div ref={subscriptionRef}>
          <SubscriptionCards />
        </div>

        {/* About Us Section */}
        <AboutUs />
        
        {/* Footer */}
        <footer className="border-t border-white/5 mt-16 py-8 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-400 text-sm">
              © 2026 INITIATORS SERVICES. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Trusted by 5000+ customers worldwide
            </p>
          </div>
        </footer>
      </div>

      {/* Floating Buttons */}
      <WishlistButton onClick={() => setIsWishlistOpen(true)} />
      <WhatsAppButton />

      {/* Recent Sales Toast */}
      <RecentSalesToast />

      {/* Wishlist Modal */}
      <WishlistModal 
        isOpen={isWishlistOpen} 
        onClose={() => setIsWishlistOpen(false)}
        onScrollToShop={scrollToSubscriptions}
      />
    </motion.div>
  )
}
