"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ShoppingCart, Trash2, MessageCircle, Minus, Plus, Crown, Check } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { WHATSAPP_URL } from "@/config/constants"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

type DiscountType = 'none' | 'combo' | 'vip'

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalItems, setIsCartOpen } = useCart()
  const [activeCoupon, setActiveCoupon] = useState<DiscountType>('none')

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  const discount = activeCoupon === 'combo' 
    ? Math.round(subtotal * 0.05) 
    : activeCoupon === 'vip' 
      ? Math.round(subtotal * 0.10) 
      : 0
  
  const totalPrice = subtotal - discount

  const comboEligible = totalItems >= 2
  const vipEligible = totalItems >= 4 && subtotal >= 1000

  const vipProgress = Math.min((subtotal / 1000) * 100, 100)
  const itemsProgress = Math.min((totalItems / 4) * 100, 100)
  const overallVipProgress = Math.min((vipProgress + itemsProgress) / 2, 100)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setIsCartOpen(true)
    } else {
      document.body.style.overflow = 'unset'
      setIsCartOpen(false)
    }
    return () => {
      document.body.style.overflow = 'unset'
      setIsCartOpen(false)
    }
  }, [isOpen, setIsCartOpen])

  const handleApplyCoupon = (couponType: DiscountType) => {
    if (activeCoupon === couponType) {
      setActiveCoupon('none')
    } else {
      setActiveCoupon(couponType)
    }
  }

  const handleWhatsAppCheckout = () => {
    const itemsList = items.map(item => `• ${item.quantity}x ${item.name} - ₹${item.price * item.quantity}`).join('\n')
    const discountLabel = activeCoupon === 'combo' ? 'Combo Offer' : 'VIP Discount'
    const discountText = discount > 0 ? `\nDiscount: -₹${discount} (${discountLabel})` : ''
    const message = `Hi! My Order:\n\n${itemsList}${discountText}\n\nTotal: ₹${totalPrice}`
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[999]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-full max-w-xs bg-zinc-950/95 backdrop-blur-md z-[1000] flex flex-col shadow-2xl border-l border-white/10"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0 bg-zinc-950/80 backdrop-blur-md">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShoppingCart className="text-purple-500" />
                Your Cart
                <span className="ml-2 px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs font-semibold rounded-full">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </span>
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-white hover:text-purple-400 transition-colors rounded-lg hover:bg-white/5"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
              <div className="p-4 space-y-4 pb-28">
                {items.length === 0 ? (
                  <div className="py-20 text-center">
                    <ShoppingCart className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-500">Your cart is empty</p>
                    <p className="text-gray-600 text-sm mt-2 mb-6">Add items to get started</p>
                    <button
                      onClick={onClose}
                      className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-colors"
                    >
                      Return to Shop
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
                        >
                          <div className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center shrink-0`}>
                            <span className="text-white font-bold">{item.name.charAt(0)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold truncate text-sm">{item.name}</h3>
                            <p className="text-purple-400 font-bold text-sm">₹{item.price * item.quantity}</p>
                          </div>
                          <div className="flex items-center gap-2 bg-black/40 rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-white text-sm w-6 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-zinc-600 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4 pt-4">
                      <h3 className="text-white font-semibold text-sm uppercase tracking-wider text-gray-400">
                        Available Offers
                      </h3>

                      <div
                        className={`p-4 rounded-2xl border-2 transition-all ${
                          activeCoupon === 'combo'
                            ? 'border-purple-500 bg-purple-500/20'
                            : comboEligible
                              ? 'border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20'
                              : 'border-zinc-800 bg-zinc-900/50 opacity-60'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeCoupon === 'combo' ? 'bg-purple-500' : comboEligible ? 'bg-purple-500/80' : 'bg-zinc-800'}`}>
                              <span className="text-white font-bold text-sm">5%</span>
                            </div>
                            <div>
                              <span className="text-white font-bold text-sm">Combo Offer</span>
                              <p className="text-xs text-gray-500">5% off on 2+ items</p>
                            </div>
                          </div>
                          {activeCoupon === 'combo' && (
                            <Check size={16} className="text-green-400" />
                          )}
                        </div>
                        <button
                          onClick={() => handleApplyCoupon('combo')}
                          disabled={!comboEligible}
                          className={`w-full py-2 px-4 rounded-xl font-semibold text-sm transition-all ${
                            activeCoupon === 'combo'
                              ? 'bg-green-500 text-white'
                              : comboEligible
                                ? 'bg-purple-500 hover:bg-purple-600 text-white'
                                : 'bg-zinc-800 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {activeCoupon === 'combo' ? 'Applied' : 'Apply'}
                        </button>
                      </div>

                      <div
                        className={`p-4 rounded-2xl border-2 transition-all ${
                          activeCoupon === 'vip'
                            ? 'border-yellow-500 bg-yellow-500/20'
                            : vipEligible
                              ? 'border-yellow-500/50 bg-yellow-500/10 hover:bg-yellow-500/20'
                              : 'border-zinc-800 bg-zinc-900/50 opacity-60'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeCoupon === 'vip' ? 'bg-yellow-500' : vipEligible ? 'bg-yellow-500/80' : 'bg-zinc-800'}`}>
                              <Crown size={16} className={activeCoupon === 'vip' || vipEligible ? 'text-white' : 'text-gray-500'} />
                            </div>
                            <div>
                              <span className="text-white font-bold text-sm">VIP Discount</span>
                              <p className="text-xs text-gray-500">10% off on ₹1000+ & 4+ items</p>
                            </div>
                          </div>
                          {activeCoupon === 'vip' && (
                            <Check size={16} className="text-green-400" />
                          )}
                        </div>

                        {!vipEligible && (
                          <div className="space-y-2 mb-3">
                            <div className="flex justify-between text-xs text-gray-400">
                              <span>Progress to VIP</span>
                              <span>{Math.round(overallVipProgress)}%</span>
                            </div>
                            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${overallVipProgress}%` }}
                                transition={{ duration: 0.5 }}
                                className="h-full bg-gradient-to-r from-purple-500 to-yellow-500 rounded-full"
                              />
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>₹{subtotal}/₹1000</span>
                              <span>{totalItems}/4 items</span>
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => handleApplyCoupon('vip')}
                          disabled={!vipEligible}
                          className={`w-full py-2 px-4 rounded-xl font-semibold text-sm transition-all ${
                            activeCoupon === 'vip'
                              ? 'bg-green-500 text-white'
                              : vipEligible
                                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                : 'bg-zinc-800 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {activeCoupon === 'vip' ? 'Applied' : 'Apply'}
                        </button>
                      </div>
                    </div>

                    {discount > 0 && (
                      <div className="bg-white/5 rounded-2xl p-4 space-y-3 border border-white/10">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Subtotal</span>
                          <span className="text-white">₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-purple-400">
                            {activeCoupon === 'combo' ? 'Combo Discount (5%)' : 'VIP Discount (10%)'}
                          </span>
                          <span className="text-green-400">-₹{discount}</span>
                        </div>
                        <div className="border-t border-white/10 pt-3 flex justify-between">
                          <span className="text-white font-semibold">Total</span>
                          <span className="text-white font-bold text-lg">₹{totalPrice}</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-zinc-950/95 backdrop-blur-md border-t border-white/10">
              {items.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 font-medium">Total Amount</span>
                    <div className="text-right">
                      {discount > 0 && (
                        <span className="text-gray-500 text-sm line-through mr-2">₹{subtotal}</span>
                      )}
                      <span className="text-2xl font-black text-white">₹{totalPrice}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={onClose}
                      className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <X size={20} />
                      Close
                    </button>
                    <button
                      onClick={handleWhatsAppCheckout}
                      className="flex-1 py-2.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-green-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <MessageCircle size={20} />
                      Checkout
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={onClose}
                  className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <X size={20} />
                  Close
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}