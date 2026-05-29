"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Check, ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useSound } from "@/contexts/sound-context"
import { useState } from "react"

interface ProductDetailModalProps {
  isOpen: boolean
  onClose: () => void
  product: {
    id: number
    name: string
    price: number
    period: string
    description: string
    features: string[]
    bgColor: string
    borderColor?: string
    isOffer?: boolean
  } | null
}

export function ProductDetailModal({ isOpen, onClose, product }: ProductDetailModalProps) {
  const { addItem, isInCart } = useCart()
  const { playClickSound, playHoverSound } = useSound()
  const [addedAnimation, setAddedAnimation] = useState(false)

  if (!product) return null

  const handleAddToCart = () => {
    playClickSound()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      period: product.period,
      bgColor: product.bgColor
    })
    setAddedAnimation(true)
    setTimeout(() => setAddedAnimation(false), 1000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            style={{
              boxShadow: "0 0 40px rgba(220, 38, 38, 0.3), 0 0 80px rgba(220, 38, 38, 0.1)"
            }}
          >
            {/* Header */}
            <div className="relative p-6 border-b border-white/10">
              <button
                onClick={onClose}
                onMouseEnter={playHoverSound}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
              
              <h2 className="text-2xl font-bold text-white mb-2">{product.name}</h2>
              <div className="flex items-baseline gap-2">
                {product.isOffer ? (
                  <span className="text-3xl font-bold text-red-400">{product.period}</span>
                ) : (
                  <>
                    <span className="text-3xl font-bold text-white">₹{product.price}</span>
                    <span className="text-gray-400">{product.period}</span>
                  </>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Description</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{product.description}</p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-300 text-sm">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-red-500" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-black/20">
              <button
                onClick={handleAddToCart}
                onMouseEnter={playHoverSound}
                disabled={isInCart(product.id)}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  addedAnimation
                    ? 'bg-green-600 text-white'
                    : isInCart(product.id)
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 shadow-lg shadow-red-500/30'
                }`}
              >
                {addedAnimation ? (
                  'Added to Cart!'
                ) : isInCart(product.id) ? (
                  'Already in Cart'
                ) : (
                  'Add to Cart'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
