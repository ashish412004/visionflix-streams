"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, X, ArrowRight } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

interface MiniCartConfirmationProps {
  isOpen: boolean
  onClose: () => void
  product: {
    id: number
    name: string
    price: number
    period: string
    bgColor: string
  }
}

export function MiniCartConfirmation({ isOpen, onClose, product }: MiniCartConfirmationProps) {
  const { setIsCartOpen } = useCart()

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  const handleViewCart = () => {
    onClose()
    setIsCartOpen(true)
  }

  const handleContinueShopping = () => {
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[60] md:hidden"
          >
            <div className="bg-black/90 backdrop-blur-xl border-t border-white/10 rounded-t-[24px] p-4 shadow-2xl max-h-[45vh] overflow-y-auto">
              {/* Handle bar */}
              <div className="flex justify-center mb-3">
                <div className="w-10 h-1 bg-white/20 rounded-full" />
              </div>

              {/* Success Message */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">Added to Cart! ✅</h3>
                  <p className="text-gray-400 text-xs">Item successfully added</p>
                </div>
              </div>

              {/* Product Info */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-4 flex items-center gap-3">
                <div className={`w-12 h-12 ${product.bgColor} rounded-lg flex items-center justify-center font-bold text-white text-lg`}>
                  {product.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-sm">{product.name}</h4>
                  <p className="text-gray-400 text-xs">{product.period}</p>
                  <p className="text-green-400 font-bold text-base mt-0.5">₹{product.price}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleViewCart}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-red-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:from-purple-600 hover:to-red-700 transition-all text-sm"
                >
                  View Cart & Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleContinueShopping}
                  className="w-full py-3 bg-transparent border-2 border-white/20 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white/5 transition-all text-sm"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Auto-close indicator */}
              <div className="mt-3 flex justify-center">
                <p className="text-gray-500 text-[10px]">Closing in 5 seconds...</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
