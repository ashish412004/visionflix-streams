"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check } from "lucide-react"

interface SaleNotification {
  id: number
  customer: string
  city: string
  product: string
}

const fakeSales: SaleNotification[] = [
  { id: 1, customer: "Ankit", city: "Mumbai", product: "Netflix Shared" },
  { id: 2, customer: "Priya", city: "Delhi", product: "ChatGPT Plus" },
  { id: 3, customer: "Rahul", city: "Bangalore", product: "YouTube Premium" },
  { id: 4, customer: "Sneha", city: "Pune", product: "Adobe CC" },
  { id: 5, customer: "Amit", city: "Kolkata", product: "OTT Bonanza" },
  { id: 6, customer: "Kavita", city: "Chennai", product: "AI Pro Pack" },
  { id: 7, customer: "Rohit", city: "Hyderabad", product: "Student Pack" },
  { id: 8, customer: "Neha", city: "Jaipur", product: "Prime Video" },
  { id: 9, customer: "Vikram", city: "Ahmedabad", product: "Canva Pro" },
  { id: 10, customer: "Divya", city: "Lucknow", product: "Gemini AI" }
]

export function RecentSalesToast() {
  const [currentSale, setCurrentSale] = useState<SaleNotification | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const showRandomSale = () => {
      const randomSale = fakeSales[Math.floor(Math.random() * fakeSales.length)]
      setCurrentSale(randomSale)
      setIsVisible(true)
      
      setTimeout(() => {
        setIsVisible(false)
      }, 5000)
    }

    // Show first sale immediately
    const timer = setTimeout(showRandomSale, 2000)
    
    // Then show sales every 30 seconds
    const interval = setInterval(showRandomSale, 30000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  return (
    <AnimatePresence>
      {isVisible && currentSale && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 50 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100, y: 50 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed bottom-4 left-4 z-50 pointer-events-none"
        >
          <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl p-4 pointer-events-auto">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">
                  <span className="font-semibold">{currentSale.customer}</span> from <span className="font-semibold">{currentSale.city}</span> just bought <span className="font-semibold text-green-400">{currentSale.product}</span>! ✅
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
