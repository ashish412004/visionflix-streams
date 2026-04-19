"use client"

import { motion } from "framer-motion"
import { MessageCircle } from "lucide-react"
import { WHATSAPP_URL } from "@/config/constants"

export function WhatsAppButton() {
  const handleClick = () => {
    window.open(`${WHATSAPP_URL}?text=Hi, I want to know more about your OTT subscription services`, '_blank')
  }

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 transition-colors"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white fill-white" />
    </motion.button>
  )
}
