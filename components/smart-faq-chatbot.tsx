"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Bot } from "lucide-react"

interface Message {
  text: string
  isUser: boolean
  timestamp: Date
}

export function SmartFAQChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi! Welcome to Initiators Services. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState("")

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

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    setMessages(prev => [
      ...prev,
      { text: inputValue, isUser: true, timestamp: new Date() }
    ])
    setInputValue("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 left-6 z-50 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30 transition-colors"
        aria-label="Open FAQ Chatbot"
      >
        {isOpen ? <X className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 left-6 z-50 w-[350px] max-w-[calc(100vw-3rem)]"
          >
            <div className="backdrop-blur-xl bg-black/80 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 relative">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">Smart FAQ Assistant</h3>
                    <p className="text-white/80 text-xs">Always here to help</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="h-[300px] overflow-y-auto p-4 space-y-3">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 ${
                        message.isUser
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-white/10 text-white border border-white/20'
                      }`}
                    >
                      <p className="text-xs leading-relaxed">{message.text}</p>
                      <p className="text-[10px] opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="p-3 border-t border-white/10">
                <p className="text-gray-400 text-xs mb-2">Quick Actions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleQuickAction(action)}
                      className="flex items-center gap-2 p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                    >
                      <span className="text-sm">{action.icon}</span>
                      <span className="text-xs text-gray-300 text-left">{action.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
