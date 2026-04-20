"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"

export function WishlistButton() {
  const { isCartOpen } = useCart()
  const { itemCount, setIsWishlistOpen } = useWishlist()
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)
    setIsWishlistOpen(true)
  }

  return (
    <div className={`fixed bottom-6 left-6 pointer-events-auto z-20 ${isCartOpen ? 'hidden' : 'block'}`}>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
        className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-pink-500 text-white rounded-full shadow-lg hover:bg-pink-600 transition-colors"
      >
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-pink-400 rounded-full"
            />
          )}
        </AnimatePresence>
        <Heart className={`w-5 h-5 md:w-6 md:h-6 ${isAnimating ? 'fill-white' : ''}`} />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full bg-white text-[9px] md:text-[10px] font-bold text-pink-600 shadow-md">
            {itemCount}
          </span>
        )}
      </motion.button>
    </div>
  )
}