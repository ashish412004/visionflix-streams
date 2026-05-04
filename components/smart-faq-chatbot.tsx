"use client"

import { useState, useRef, useEffect } from "react"
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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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
      {/* Parent Container - Fixed position for both button and window */}
      <div className="fixed bottom-[100px] right-5 z-[10000]">
        {/* Chat Button - Same size as WhatsApp button */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30 transition-colors relative z-10"
          aria-label="Open FAQ Chatbot"
        >
          {isOpen ? <X className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-white" />}
        </motion.button>

        {/* Chat Window - Absolute position relative to parent */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-[70px] right-0 w-[320px] h-[450px] sm:w-[90vw] sm:max-w-[320px] max-h-[calc(100vh-180px)]"
            >
            <div className="backdrop-blur-xl bg-black/80 border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col w-full h-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 md:p-4 relative">
                <button
                  onClick={() => setIsOpen(false)}
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
              <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3 flex flex-col">
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
                {/* Auto-scroll anchor */}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div className="p-2 md:p-3 border-t border-white/10">
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
    </>
  )
}
