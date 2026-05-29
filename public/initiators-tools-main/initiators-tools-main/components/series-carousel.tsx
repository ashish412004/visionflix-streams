"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

const content = [
  {
    id: 1,
    title: "Stranger Things",
    tag: "Now Trending",
    type: "SERIES",
    image: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    color: "from-red-600/80"
  },
  {
    id: 2,
    title: "Money Heist",
    tag: "Now Trending",
    type: "SERIES",
    image: "https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
    color: "from-red-700/80"
  },
  {
    id: 3,
    title: "Joker",
    tag: "Now Trending",
    type: "MOVIE",
    image: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    color: "from-green-600/80"
  },
  {
    id: 4,
    title: "Breaking Bad",
    tag: "Now Trending",
    type: "SERIES",
    image: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    color: "from-yellow-600/80"
  },
  {
    id: 5,
    title: "The Boys",
    tag: "Now Trending",
    type: "SERIES",
    image: "https://image.tmdb.org/t/p/w500/stTEycfG9928HYGEISBFaG1ngjM.jpg",
    color: "from-blue-600/80"
  },
  {
    id: 6,
    title: "Avatar: The Way of Water",
    tag: "Now Trending",
    type: "MOVIE",
    image: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    color: "from-cyan-600/80"
  },
  {
    id: 7,
    title: "Oppenheimer",
    tag: "Now Trending",
    type: "MOVIE",
    image: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    color: "from-orange-600/80"
  },
  {
    id: 8,
    title: "Dark",
    tag: "Now Trending",
    type: "SERIES",
    image: "https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg",
    color: "from-gray-700/80"
  },
  {
    id: 9,
    title: "Inception",
    tag: "Now Trending",
    type: "MOVIE",
    image: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
    color: "from-blue-800/80"
  }
]

export function SeriesCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [hasDragged, setHasDragged] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const velocityRef = useRef(0)
  const lastXRef = useRef(0)
  const lastTimeRef = useRef(0)
  const momentumRef = useRef<number | null>(null)

  // Auto-scroll effect
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId: number
    const scrollSpeed = window.innerWidth < 768 ? 1.5 : 0.5

    const autoScroll = () => {
      if (!isPaused && !isDragging && scrollContainer) {
        scrollContainer.scrollLeft += scrollSpeed

        // Reset scroll position for infinite effect
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0
        }
      }
      animationId = requestAnimationFrame(autoScroll)
    }

    animationId = requestAnimationFrame(autoScroll)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [isPaused, isDragging])

  // Momentum scrolling function
  const applyMomentum = useCallback(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    const friction = 0.95
    const minVelocity = 0.5

    const animate = () => {
      if (Math.abs(velocityRef.current) < minVelocity) {
        velocityRef.current = 0
        momentumRef.current = null
        return
      }

      scrollContainer.scrollLeft -= velocityRef.current
      velocityRef.current *= friction

      // Handle infinite scroll during momentum
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0
      } else if (scrollContainer.scrollLeft <= 0) {
        scrollContainer.scrollLeft = scrollContainer.scrollWidth / 2
      }

      momentumRef.current = requestAnimationFrame(animate)
    }

    momentumRef.current = requestAnimationFrame(animate)
  }, [])

  // Cleanup momentum on unmount
  useEffect(() => {
    return () => {
      if (momentumRef.current) {
        cancelAnimationFrame(momentumRef.current)
      }
    }
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      })
    }
  }

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    
    // Stop any ongoing momentum
    if (momentumRef.current) {
      cancelAnimationFrame(momentumRef.current)
      momentumRef.current = null
    }
    
    setIsDragging(true)
    setHasDragged(false)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
    lastXRef.current = e.pageX
    lastTimeRef.current = Date.now()
    velocityRef.current = 0
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    
    // Track if user has actually dragged (moved more than 5px)
    if (Math.abs(walk) > 5) {
      setHasDragged(true)
    }
    
    scrollRef.current.scrollLeft = scrollLeft - walk

    // Calculate velocity for momentum
    const now = Date.now()
    const dt = now - lastTimeRef.current
    if (dt > 0) {
      velocityRef.current = (e.pageX - lastXRef.current) / dt * 15
    }
    lastXRef.current = e.pageX
    lastTimeRef.current = now
  }

  const handleMouseUp = () => {
    if (isDragging && Math.abs(velocityRef.current) > 0.5) {
      applyMomentum()
    }
    setIsDragging(false)
    
    // Reset hasDragged after a short delay to allow click prevention
    setTimeout(() => setHasDragged(false), 100)
  }

  const handleContainerMouseLeave = () => {
    setIsPaused(false)
  }

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return
    
    // Stop any ongoing momentum
    if (momentumRef.current) {
      cancelAnimationFrame(momentumRef.current)
      momentumRef.current = null
    }
    
    setIsDragging(true)
    setHasDragged(false)
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
    lastXRef.current = e.touches[0].pageX
    lastTimeRef.current = Date.now()
    velocityRef.current = 0
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return
    
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    
    if (Math.abs(walk) > 5) {
      setHasDragged(true)
    }
    
    scrollRef.current.scrollLeft = scrollLeft - walk

    // Calculate velocity for momentum
    const now = Date.now()
    const dt = now - lastTimeRef.current
    if (dt > 0) {
      velocityRef.current = (e.touches[0].pageX - lastXRef.current) / dt * 15
    }
    lastXRef.current = e.touches[0].pageX
    lastTimeRef.current = now
  }

  const handleTouchEnd = () => {
    if (isDragging && Math.abs(velocityRef.current) > 0.5) {
      applyMomentum()
    }
    setIsDragging(false)
    setTimeout(() => setHasDragged(false), 100)
  }

  // Prevent click when dragged
  const handleCardClick = (e: React.MouseEvent) => {
    if (hasDragged) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  // Double the content for infinite scroll illusion
  const doubledContent = [...content, ...content]

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative px-4 md:px-6 py-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
          Trending Movies & Series
        </h2>

        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={handleContainerMouseLeave}
        >
          {/* Navigation Buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/60 hover:bg-red-600/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/30"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/60 hover:bg-red-600/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/30"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

          {/* Carousel */}
          <div 
            ref={scrollRef}
            className={`flex gap-4 px-14 py-4 overflow-x-scroll select-none touch-pan-x hide-scrollbar ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {doubledContent.map((item, index) => (
              <motion.div
                key={`${item.id}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                onClick={handleCardClick}
                className="relative flex-shrink-0 w-36 sm:w-44 md:w-48 aspect-[2/3] rounded-xl overflow-visible group transition-all duration-300 hover:z-10 hover:shadow-[0_0_15px_3px_rgba(220,38,38,0.4)] hover:shadow-red-500/20"
                whileHover={{ scale: 1.08, zIndex: 10 }}
                style={{ transformOrigin: 'center center', transform: 'translateZ(0)' }}
              >
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover pointer-events-none"
                  draggable={false}
                />
                
                {/* Dark Gradient Overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 pointer-events-none" />
                
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-red-600/30 via-transparent to-transparent pointer-events-none" />
                
                {/* Type Tag */}
                <div className="absolute top-3 left-3 pointer-events-none">
                  <span className={`px-2.5 py-1 text-white text-xs font-bold rounded-md shadow-lg ${
                    item.type === "SERIES" 
                      ? "bg-gradient-to-r from-red-700 to-red-900" 
                      : "bg-gradient-to-r from-red-600 to-red-800"
                  }`}>
                    {item.type}
                  </span>
                </div>
                
                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
                  <h3 className="text-white font-bold text-sm md:text-base drop-shadow-lg">{item.title}</h3>
                  <p className="text-gray-300 text-xs mt-1">{item.tag}</p>
                </div>

                {/* Border Glow on Hover */}
                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-red-500/70 group-hover:shadow-[0_0_10px_rgba(220,38,38,0.6)] transition-all duration-300 pointer-events-none" />
              </motion.div>
            ))}
          </div>

          {/* Gradient Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0a0a1a] to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0a0a1a] to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </motion.section>
  )
}
