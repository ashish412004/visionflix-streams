"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Trash2, ShoppingBag, ShoppingCart, ArrowRight } from "lucide-react"
import { useWishlist } from "@/contexts/wishlist-context"
import { useCart } from "@/contexts/cart-context"

interface WishlistModalProps {
  isOpen: boolean
  onClose: () => void
  onScrollToShop: () => void
  onOpenCart: () => void
}

export function WishlistModal({ isOpen, onClose, onScrollToShop, onOpenCart }: WishlistModalProps) {
  const { items, removeItem, clearWishlist, totalPrice } = useWishlist()
  const { addItem: addToCart } = useCart()

  // Poore wishlist ko cart mein move karne ka logic
  const handleMoveAllToCart = () => {
    if (items.length === 0) return

    items.forEach(item => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        period: item.period,
        bgColor: 'bg-gradient-to-r from-red-600 to-red-500'
      })
    })

    clearWishlist()
    onClose()
    
    // Thoda delay taaki modal smooth close ho aur cart open ho jaye
    setTimeout(() => {
      onOpenCart()
    }, 300)
  }

  // Single item ko move karne ka logic
  const handleMoveToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      period: item.period,
      bgColor: 'bg-gradient-to-r from-red-600 to-red-500'
    })
    removeItem(item.id)
  }

  const handleReturnToShop = () => {
    onClose()
    setTimeout(() => {
      onScrollToShop()
    }, 300)
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-[10%] md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-50"
          >
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-500 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Your Wishlist</h2>
                    <p className="text-gray-400 text-sm">{items.length} items saved</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 max-h-[50vh] overflow-y-auto custom-scrollbar">
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-10"
                  >
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="w-10 h-10 text-gray-500" />
                    </div>
                    <p className="text-gray-400 text-lg mb-6">Your Wishlist is Empty</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleReturnToShop}
                      className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-xl shadow-lg shadow-red-500/20"
                    >
                      Return to Shop
                    </motion.button>
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 group hover:border-red-500/30 transition-all"
                      >
                        <div className="flex-1">
                          <h3 className="text-white font-medium">{item.name}</h3>
                          <p className="text-gray-400 text-sm">{item.period}</p>
                          <p className="text-red-500 font-bold mt-1">₹{item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Move Single Item to Cart */}
                          <button
                            onClick={() => handleMoveToCart(item)}
                            className="p-2.5 text-green-400 hover:text-white hover:bg-green-500 rounded-lg transition-all border border-green-500/20"
                            title="Move to Cart"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                          {/* Remove from Wishlist */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-5 border-t border-white/10 space-y-4 bg-white/5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-gray-400">Total Value</span>
                    <span className="text-2xl font-bold text-white">₹{totalPrice}</span>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={clearWishlist}
                      className="flex-1 py-3 border border-white/10 text-gray-400 font-medium rounded-xl hover:bg-white/5 transition-colors"
                    >
                      Clear
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleMoveAllToCart}
                      className="flex-[2] py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
                    >
                      Move All to Cart
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}