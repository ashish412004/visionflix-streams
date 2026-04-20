"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface WishlistItem {
  id: number
  name: string
  price: number
  period: string
  category: string
  accessType: string
}

interface WishlistContextType {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: number) => void
  clearWishlist: () => void
  isInWishlist: (id: number) => boolean
  totalPrice: number
  itemCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("wishlist")
      if (stored) {
        const parsedItems = JSON.parse(stored)
        setItems(parsedItems)
      }
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error)
    }
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(items))
  }, [items])

  const addItem = (item: WishlistItem) => {
    setItems(prev => {
      if (prev.find(i => i.id === item.id)) return prev
      return [...prev, item]
    })
  }

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const clearWishlist = () => {
    setItems([])
  }

  const isInWishlist = (id: number) => {
    return items.some(item => item.id === id)
  }

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0)
  const itemCount = items.length

  return (
    <WishlistContext.Provider value={{
      items,
      addItem,
      removeItem,
      clearWishlist,
      isInWishlist,
      totalPrice,
      itemCount
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
