"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { DashboardHeader } from "./dashboard-header"
import { SeriesCarousel } from "./series-carousel"
import { SubscriptionCards } from "./subscription-cards"
import { FloatingActions } from "./floating-actions"
import { MatrixRain } from "./matrix-rain"
import { WishlistModal } from "./wishlist-modal"
import { AboutUs } from "./about-us"
import { RecentSalesToast } from "./recent-sales-toast"
import { FAQ } from "./faq"

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
    <>
      {/* <LoadingScreen onComplete={() => setIsLoading(false)} /> */}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen relative overflow-hidden"
      >
      {/* Neo-Matrix Code Rain Background */}
      <MatrixRain />

      {/* Dark Overlay for Text Visibility */}
      <div className="fixed inset-0 -z-10 bg-black/60" />

      {/* Content - pt-16 for fixed header */}
      <div className="relative z-10 pt-16 md:pt-20">
        <DashboardHeader email={email} onLogout={onLogout} />
        <SeriesCarousel />
        <div ref={subscriptionRef}>
          <SubscriptionCards />
        </div>

        {/* About Us Section */}
        <AboutUs />

        {/* FAQ Section */}
        <FAQ />

        {/* Footer */}
        <footer className="border-t border-white/5 mt-16 py-8 px-4 bg-transparent">
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

      {/* Floating Buttons - Unified vertical stack */}
      <FloatingActions onWishlistClick={() => setIsWishlistOpen(true)} />

      {/* Recent Sales Toast */}
      <RecentSalesToast />

      {/* Wishlist Modal */}
      <WishlistModal 
        isOpen={isWishlistOpen} 
        onClose={() => setIsWishlistOpen(false)}
        onScrollToShop={scrollToSubscriptions}
      />
    </motion.div>
    </>
  )
}
