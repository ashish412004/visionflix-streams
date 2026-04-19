"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Trash2, ShoppingBag, MessageCircle } from "lucide-react"
import { useWishlist } from "@/contexts/wishlist-context"
import { WHATSAPP_URL } from "@/config/constants"

interface WishlistModalProps {
  isOpen: boolean
  onClose: () => void
  onScrollToShop: () => void
}

export function WishlistModal({ isOpen, onClose, onScrollToShop }: WishlistModalProps) {
  const { items, removeItem, clearWishlist, totalPrice } = useWishlist()

  const handlePlaceOrder = () => {
    if (items.length === 0) return
    
    const itemsList = items.map(item => `${item.name} (₹${item.price})`).join(", ")
    const message = `Hi, I want to order: ${itemsList}. Total: ₹${totalPrice}.`
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`, '_blank')
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
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Your Wishlist</h2>
                    <p className="text-gray-400 text-sm">{items.length} items</p>
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
              <div className="p-5 max-h-[50vh] overflow-y-auto">
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
                      className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-xl"
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
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 group hover:border-purple-500/30 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="text-white font-medium">{item.name}</h3>
                          <p className="text-gray-400 text-sm">{item.period}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-white font-bold">₹{item.price}</span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
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
                <div className="p-5 border-t border-white/10 space-y-4">
                  {/* Total */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Total Amount</span>
                    <span className="text-2xl font-bold text-white">₹{totalPrice}</span>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={clearWishlist}
                      className="flex-1 py-3 border border-white/20 text-gray-300 font-medium rounded-xl hover:bg-white/5 transition-colors"
                    >
                      Clear Wishlist
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePlaceOrder}
                      className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Place Order (WhatsApp)
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
