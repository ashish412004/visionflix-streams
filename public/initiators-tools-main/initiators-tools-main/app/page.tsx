"use client"

import { WishlistProvider } from "@/contexts/wishlist-context"
import { SoundProvider } from "@/contexts/sound-context"
import { CartProvider } from "@/contexts/cart-context"
import { Dashboard } from "@/components/dashboard"

export default function Home() {
  return (
    <SoundProvider>
      <CartProvider>
        <WishlistProvider>
          <main className="min-h-screen">
            <Dashboard email="" onLogout={() => {}} />
          </main>
        </WishlistProvider>
      </CartProvider>
    </SoundProvider>
  )
}
