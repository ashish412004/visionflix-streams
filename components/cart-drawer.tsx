"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ShoppingCart, Trash2, MessageCircle, Sparkles, Minus, Plus, Crown } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { WHATSAPP_URL } from "@/config/constants"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

type DiscountType = 'none' | 'combo' | 'vip'

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalItems } = useCart()
  const [discountType, setDiscountType] = useState<DiscountType>('none')
  const [applyingCoupon, setApplyingCoupon] = useState(false)
  const [discountAmount, setDiscountAmount] = useState(0)

  const basePrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const discount = discountType !== 'none' ? discountAmount : 0
  const totalPrice = basePrice - discount

  // Check eligibility for discounts
  const comboEligible = totalItems >= 2
  const vipEligible = totalItems >= 4 && basePrice >= 1000

  // Auto-select best discount if both eligible
  useEffect(() => {
    if (vipEligible && discountType === 'none') {
      setDiscountType('vip')
      const discount = Math.round(basePrice * 0.10) // 10% discount
      setDiscountAmount(discount)
    } else if (!vipEligible && discountType === 'vip') {
      setDiscountType('none')
      setDiscountAmount(0)
    }
  }, [vipEligible, basePrice])

  // Recalculate discount when basePrice changes and discount is applied
  useEffect(() => {
    if (discountType !== 'none') {
      const newDiscount = discountType === 'vip' 
        ? Math.round(basePrice * 0.10) // 10% discount
        : Math.round(basePrice * 0.05) // 5% discount
      setDiscountAmount(newDiscount)
    }
  }, [basePrice, discountType])

  // Automatic fallback from 10% to 5% when VIP eligibility is lost but combo is still eligible
  useEffect(() => {
    if (!vipEligible && discountType === 'vip' && comboEligible) {
      setDiscountType('combo')
      const discount = Math.round(basePrice * 0.05) // 5% discount
      setDiscountAmount(discount)
    }
  }, [vipEligible, comboEligible])

  const handleApplyComboCoupon = () => {
    setApplyingCoupon(true)
    
    setTimeout(() => {
      const discount = Math.round(basePrice * 0.05) // 5% discount
      setDiscountAmount(discount)
      setDiscountType('combo')
      setApplyingCoupon(false)
    }, 1500)
  }

  const handleApplyVipCoupon = () => {
    setApplyingCoupon(true)
    
    setTimeout(() => {
      const discount = Math.round(basePrice * 0.10) // 10% discount
      setDiscountAmount(discount)
      setDiscountType('vip')
      setApplyingCoupon(false)
    }, 1500)
  }

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      // Show confirmation dialog
      if (confirm('Are you sure you want to remove this item from cart?')) {
        removeItem(id)
      }
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  // Reset coupon when eligibility is lost
  useEffect(() => {
    if (!comboEligible && !vipEligible && discountType !== 'none') {
      setDiscountType('none')
      setDiscountAmount(0)
    }
  }, [comboEligible, vipEligible])

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return

    const itemsList = items.map(item => `• ${item.quantity}x ${item.name} (${item.period}) - ₹${item.price * item.quantity}`).join('\n')
    let discountInfo = ''
    if (discountType === 'vip') {
      discountInfo = `Subtotal: ₹${basePrice}\nVIP Discount (10%): -₹${discount}\nGrand Total: ₹${totalPrice}`
    } else if (discountType === 'combo') {
      discountInfo = `Subtotal: ₹${basePrice}\nCombo Discount (5%): -₹${discount}\nGrand Total: ₹${totalPrice}`
    } else {
      discountInfo = `Subtotal: ₹${basePrice}\nGrand Total: ₹${totalPrice}`
    }
    const message = `Hi! I want to purchase the following services:\n\n${itemsList}\n\n${discountInfo}\n\nPlease share payment details.`
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`, '_blank')
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

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-black/90 backdrop-blur-xl border-l border-purple-500/30 z-50 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Your Cart</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400 hover:text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingCart className="w-16 h-16 text-gray-600 mb-4" />
                  <p className="text-gray-400 text-lg mb-6">Your cart is empty.</p>
                  <p className="text-purple-400 text-sm mb-6">Add some services!</p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-4 p-4 bg-white/5 border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition-colors"
                    >
                      <div className={`w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white font-bold text-sm">{item.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold truncate">{item.name}</h3>
                        <p className="text-gray-400 text-sm">{item.period}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/50 hover:bg-purple-500/40 hover:shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all flex items-center justify-center"
                        >
                          <Minus className="w-4 h-4 text-purple-400" />
                        </button>
                        <span className="w-8 text-center font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/50 hover:bg-purple-500/40 hover:shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4 text-purple-400" />
                        </button>
                      </div>
                      <div className="text-right min-w-[60px]">
                        <p className="text-white font-bold">₹{item.price * item.quantity}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-purple-500/20 bg-black/50">
                {/* VIP Progress Bar */}
                {basePrice < 1000 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400">Progress to VIP 10% OFF</span>
                      <span className="text-xs text-purple-400">{Math.round((basePrice / 1000) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(basePrice / 1000) * 100}%` }}
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      />
                    </div>
                  </div>
                )}

                {/* Smart Coupon Section - Two Separate Cards */}
                <div className="space-y-3 mb-4">
                  {/* Card A: Combo Offer (5% OFF) */}
                  <div 
                    className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                      !comboEligible
                        ? 'bg-gray-900/50 border-gray-700/50 opacity-50' 
                        : discountType === 'combo'
                          ? 'bg-green-900/30 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]' 
                          : 'bg-purple-900/30 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className={`w-4 h-4 ${!comboEligible ? 'text-gray-500' : discountType === 'combo' ? 'text-green-400' : 'text-purple-400'}`} />
                        <span className={`text-sm font-bold ${!comboEligible ? 'text-gray-500' : discountType === 'combo' ? 'text-green-400' : 'text-purple-400'}`}>
                          Combo Offer (5% OFF)
                        </span>
                        <span className="text-xs text-gray-400">• 2+ items</span>
                      </div>
                      {discountType === 'combo' ? (
                        <button
                          onClick={() => { setDiscountType('none'); setDiscountAmount(0); }}
                          className="p-1 hover:bg-red-500/20 rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-red-400" />
                        </button>
                      ) : (
                        <button
                          onClick={handleApplyComboCoupon}
                          disabled={!comboEligible || applyingCoupon}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                            !comboEligible || applyingCoupon
                              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                          }`}
                        >
                          {applyingCoupon ? (
                            <span className="flex items-center gap-1">
                              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Applying...
                            </span>
                          ) : (
                            'Apply'
                          )}
                        </button>
                      )}
                    </div>
                    {discountType === 'combo' && (
                      <p className="text-xs text-green-400 mt-2 font-semibold">
                        Applied! You saved ₹{discount}
                      </p>
                    )}
                    {vipEligible && discountType === 'combo' && (
                      <p className="text-xs text-yellow-400 mt-2 font-semibold flex items-center gap-1">
                        <span>⚡ A better offer is available!</span>
                        <button
                          onClick={handleApplyVipCoupon}
                          className="text-yellow-400 underline hover:text-yellow-300"
                        >
                          Switch to 10%
                        </button>
                      </p>
                    )}
                  </div>

                  {/* Card B: VIP Discount (10% OFF) */}
                  <div 
                    className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                      !vipEligible
                        ? 'bg-gray-900/50 border-gray-700/50 opacity-50' 
                        : discountType === 'vip'
                          ? 'bg-yellow-900/30 border-yellow-500/50 shadow-[0_0_20px_rgba(255,215,0,0.3)]' 
                          : 'bg-yellow-900/20 border-yellow-500/30 shadow-[0_0_20px_rgba(255,215,0,0.2)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Crown className={`w-4 h-4 ${!vipEligible ? 'text-gray-500' : discountType === 'vip' ? 'text-yellow-400' : 'text-yellow-400'}`} />
                        <span className={`text-sm font-bold ${!vipEligible ? 'text-gray-500' : 'text-yellow-400'}`}>
                          VIP Discount (10% OFF)
                        </span>
                        <span className="text-xs text-gray-400">• 4+ items & ₹1000+</span>
                      </div>
                      {discountType === 'vip' ? (
                        <button
                          onClick={() => { setDiscountType('none'); setDiscountAmount(0); }}
                          className="p-1 hover:bg-red-500/20 rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-red-400" />
                        </button>
                      ) : (
                        <button
                          onClick={handleApplyVipCoupon}
                          disabled={!vipEligible || applyingCoupon}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                            !vipEligible || applyingCoupon
                              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600'
                          }`}
                        >
                          {applyingCoupon ? (
                            <span className="flex items-center gap-1">
                              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Applying...
                            </span>
                          ) : (
                            'Apply'
                          )}
                        </button>
                      )}
                    </div>
                    {discountType === 'vip' && (
                      <p className="text-xs text-yellow-400 mt-2 font-semibold">
                        VIP SAVINGS APPLIED! You saved ₹{discount}
                      </p>
                    )}
                    {!vipEligible && (
                      <p className="text-xs text-gray-500 mt-2">
                        {totalItems < 4 ? `Add ${4 - totalItems} more items to unlock` : `Add ₹${1000 - basePrice} more to unlock`}
                      </p>
                    )}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">₹{basePrice}</span>
                  </div>
                  {discountType !== 'none' && (
                    <div className="flex items-center justify-between">
                      <span className={discountType === 'vip' ? 'text-yellow-400' : 'text-green-400'}>
                        {discountType === 'vip' ? 'VIP Discount (10%)' : 'Combo Offer (5% OFF)'}
                      </span>
                      <span className={`${discountType === 'vip' ? 'text-yellow-400' : 'text-green-400'} font-semibold`}>-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-purple-500/20">
                    <span className="text-gray-400 font-semibold">Total Amount</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-white">₹{totalPrice}</span>
                      {discountType === 'vip' && (
                        <span className="px-2 py-0.5 bg-yellow-500/20 border border-yellow-500/50 rounded text-xs text-yellow-400 font-bold">
                          VIP
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 shadow-lg"
                  style={{ boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)" }}
                >
                  <MessageCircle className="w-5 h-5" />
                  Checkout on WhatsApp
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
