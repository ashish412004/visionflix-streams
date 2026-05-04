"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Bot, Heart } from "lucide-react"
import { WHATSAPP_URL } from "@/config/constants"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"

interface FloatingActionsProps {
  onWishlistClick: () => void
}

interface Message {
  text: string
  isUser: boolean
  timestamp: Date
}

export function FloatingActions({ onWishlistClick }: FloatingActionsProps) {
  const { isCartOpen } = useCart()
  const { itemCount } = useWishlist()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi! Welcome to Initiators Services. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  const quickActions = [
    {
      icon: "🚀",
      label: "How it works?",
      answer: "It is very simple! You contact us via WhatsApp. Once your payment is confirmed, we will provide your Premium ID and Password directly on WhatsApp. The entire process takes only 5-10 minutes!"
    },
    {
      icon: "🛒",
      label: "How can I buy?",
      answer: "To purchase, click on 'Buy Now' or tap the WhatsApp button. We will send you a Payment Link or QR Scanner. Your service will start immediately after the payment is verified."
    },
    {
      icon: "🛡️",
      label: "Is it safe & trusted?",
      answer: "Yes, it is 100% safe and genuine! We provide official premium accounts with a clean track record. We have served hundreds of happy customers and prioritize your privacy and security."
    },
    {
      icon: "🔄",
      label: "Replacement Warranty",
      answer: "We provide a replacement warranty for the entire duration of your subscription. To claim it, ensure you follow our T&Cs: You must have the original payment screenshot, chat history, and the login details provided. If any issue arises, we will provide a new ID/Pass promptly on WhatsApp."
    }
  ]

  const handleQuickAction = (action: typeof quickActions[0]) => {
    setMessages(prev => [
      ...prev,
      { text: action.label, isUser: true, timestamp: new Date() },
      { text: action.answer, isUser: false, timestamp: new Date() }
    ])
  }

  if (isCartOpen) return null

  return (
    <>
      {/* Floating Buttons Container - Vertical Stack on Left */}
      <div className="fixed bottom-5 left-5 z-[10000] flex flex-col gap-4">
        {/* WhatsApp Button */}
        <motion.a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#128C7E] transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </motion.a>

        {/* Chatbot Button */}
        <div className="relative">
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full shadow-lg shadow-purple-500/30 transition-colors relative z-10"
            aria-label="Open FAQ Chatbot"
          >
            {isChatOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
          </motion.button>

          {/* Chat Window - Opens above the button */}
          <AnimatePresence>
            {isChatOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-[80px] left-0 w-[320px] h-[450px] sm:w-[90vw] sm:max-w-[320px] max-h-[calc(100vh-180px)]"
              >
                <div className="backdrop-blur-xl bg-black/80 border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col w-full h-full">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 md:p-4 relative flex-shrink-0">
                    <button
                      onClick={() => setIsChatOpen(false)}
                      className="absolute top-3 right-3 md:top-4 md:right-4 w-7 h-7 md:w-8 md:h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                    >
                      <X className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                    </button>
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-xs md:text-sm">Smart FAQ Assistant</h3>
                        <p className="text-white/80 text-[10px] md:text-xs">Always here to help</p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div 
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3"
                  >
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl p-2 md:p-3 ${
                            message.isUser
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : 'bg-white/10 text-white border border-white/20'
                          }`}
                        >
                          <p className="text-[10px] md:text-xs leading-relaxed">{message.text}</p>
                          <p className="text-[9px] md:text-[10px] opacity-70 mt-0.5 md:mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Actions */}
                  <div className="p-2 md:p-3 border-t border-white/10 flex-shrink-0">
                    <p className="text-gray-400 text-[10px] md:text-xs mb-1.5 md:mb-2">Quick Actions:</p>
                    <div className="grid grid-cols-2 gap-1.5 md:gap-2">
                      {quickActions.map((action, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleQuickAction(action)}
                          className="flex items-center gap-1.5 md:gap-2 p-1.5 md:p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                        >
                          <span className="text-xs md:text-sm">{action.icon}</span>
                          <span className="text-[10px] md:text-xs text-gray-300 text-left">{action.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Wishlist Button */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onWishlistClick}
          className="relative flex items-center justify-center w-14 h-14 bg-pink-500 text-white rounded-full shadow-lg hover:bg-pink-600 transition-colors"
        >
          <Heart className="w-6 h-6" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-pink-600 shadow-md">
              {itemCount}
            </span>
          )}
        </motion.button>
      </div>
    </>
  )
}
