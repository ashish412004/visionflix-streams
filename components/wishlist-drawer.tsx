"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Heart, Trash2, ShoppingCart, ShoppingBag } from "lucide-react"
import { useWishlist } from "@/contexts/wishlist-context"
import { useCart } from "@/contexts/cart-context"

interface WishlistDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
  const { items, removeItem, clearWishlist, setIsWishlistOpen } = useWishlist()
  const { addItem, setIsCartOpen } = useCart()

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setIsWishlistOpen(true)
    } else {
      document.body.style.overflow = 'unset'
      setIsWishlistOpen(false)
    }
    return () => {
      document.body.style.overflow = 'unset'
      setIsWishlistOpen(false)
    }
  }, [isOpen, setIsWishlistOpen])

  const handleMoveToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      period: item.period,
      bgColor: 'bg-purple-500'
    })
    removeItem(item.id)
  }

  const handleClearAll = () => {
    clearWishlist()
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
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[998]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-zinc-950/95 backdrop-blur-md z-[999] flex flex-col shadow-2xl border-l border-white/10"
          >
            {/* Fixed Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0 bg-zinc-950/80 backdrop-blur-md">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Heart className="text-pink-500" />
                Your Wishlist
                <span className="ml-2 px-2 py-0.5 bg-pink-500/20 text-pink-400 text-xs font-semibold rounded-full">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-white hover:text-purple-400 transition-colors rounded-lg hover:bg-white/5"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Middle Section */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
              <div className="p-6 space-y-6 pb-40">
                {items.length === 0 ? (
                  <div className="py-20 text-center">
                    <Heart className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-500 text-lg font-semibold">Your Wishlist is Empty</p>
                    <p className="text-gray-600 text-sm mt-2 mb-6">Save items you love to view later</p>
                    <button
                      onClick={onClose}
                      className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl transition-colors"
                    >
                      Return to Shop
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Wishlist Items */}
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
                        >
                          <div className={`w-12 h-12 ${item.bgColor || 'bg-pink-500'} rounded-xl flex flex-col items-center justify-center shrink-0`}>
                            <span className="text-white font-bold text-sm">{item.logo || '♥'}</span>
                            {item.logoSubtext && <span className="text-white text-[8px]">{item.logoSubtext}</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold truncate text-sm">{item.name}</h3>
                            <p className="text-pink-400 font-bold text-sm">₹{item.price}</p>
                            <p className="text-gray-500 text-xs">{item.period}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleMoveToCart(item)}
                              className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 rounded-lg transition-colors"
                              title="Move to Cart"
                            >
                              <ShoppingCart size={18} />
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Remove"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Clear All Button */}
                    {items.length > 0 && (
                      <button
                        onClick={handleClearAll}
                        className="w-full py-3 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-xl font-semibold transition-colors"
                      >
                        Clear All Items
                      </button>
                    )}

                    {/* Order Summary */}
                    <div className="bg-white/5 rounded-2xl p-4 space-y-3 border border-white/10">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Value</span>
                        <span className="text-white">₹{totalPrice}</span>
                      </div>
                      <div className="border-t border-white/10 pt-3 flex justify-between">
                        <span className="text-white font-semibold">Items</span>
                        <span className="text-white font-bold text-lg">{items.length}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Fixed Footer */}
            {items.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-zinc-950/95 backdrop-blur-md border-t border-white/10">
                <div className="flex gap-2">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-pink-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm"
                  >
                    <ShoppingBag size={16} />
                    CONTINUE SHOPPING
                  </button>
                  <button
                    onClick={() => {
                      items.forEach(item => handleMoveToCart(item))
                      onClose()
                      setIsCartOpen(true)
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm"
                  >
                    <ShoppingCart size={16} />
                    MOVE TO CART
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
