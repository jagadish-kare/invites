import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PhotoGalleryProps {
  photos: string[];
  autoPlayInterval?: number; // in milliseconds
  className?: string;
}

export default function PhotoGallery({ 
  photos, 
  autoPlayInterval = 3000,
  className = '' 
}: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1) // 1 for next, -1 for prev

  const nextSlide = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % photos.length)
  }, [photos.length])

  const prevSlide = useCallback(() => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }, [photos.length])

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  // Auto-play functionality - cycles through all photos and loops
  useEffect(() => {
    if (photos.length <= 1) return
    
    const timer = setInterval(nextSlide, autoPlayInterval)
    return () => clearInterval(timer)
  }, [nextSlide, autoPlayInterval, photos.length])

  if (photos.length === 0) return null

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      zIndex: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 45 : -45,
      zIndex: 0,
    }),
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main carousel container */}
      <div className="relative h-[400px] md:h-[500px] perspective-1000 overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          <AnimatePresence mode="popLayout" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 },
                rotateY: { duration: 0.3 },
              }}
              className="absolute w-64 h-80 md:w-80 md:h-[400px]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Golden frame */}
              <div 
                className="w-full h-full p-3 md:p-4 bg-gradient-to-br from-[#d4af37] via-[#f5d67a] to-[#d4af37] rounded-xl"
                style={{
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 10px 30px rgba(212,175,55,0.3)'
                }}
              >
                <div className="absolute inset-2 border-2 border-[#b8960c]/50 rounded-lg pointer-events-none" />
                <img
                  src={photos[currentIndex]}
                  alt={`Gallery photo ${currentIndex + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Side preview cards (decorative) */}
          {photos.length > 1 && (
            <>
              <motion.div
                className="absolute w-48 h-64 md:w-56 md:h-72 left-4 md:left-12"
                style={{
                  transform: 'translateX(-40%) scale(0.75) rotateY(25deg)',
                  opacity: 0.4,
                  zIndex: 0,
                }}
              >
                <div className="w-full h-full p-2 bg-gradient-to-br from-[#d4af37] via-[#f5d67a] to-[#d4af37] rounded-lg">
                  <img
                    src={photos[(currentIndex - 1 + photos.length) % photos.length]}
                    alt="Previous"
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              </motion.div>
              <motion.div
                className="absolute w-48 h-64 md:w-56 md:h-72 right-4 md:right-12"
                style={{
                  transform: 'translateX(40%) scale(0.75) rotateY(-25deg)',
                  opacity: 0.4,
                  zIndex: 0,
                }}
              >
                <div className="w-full h-full p-2 bg-gradient-to-br from-[#d4af37] via-[#f5d67a] to-[#d4af37] rounded-lg">
                  <img
                    src={photos[(currentIndex + 1) % photos.length]}
                    alt="Next"
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      <motion.button
        onClick={prevSlide}
        className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 
          bg-gradient-to-br from-[#2d1515] to-[#1a0a0a] hover:from-[#3d2525] hover:to-[#2a1a1a]
          border-2 border-[#d4af37] rounded-full 
          flex items-center justify-center text-[#d4af37] text-2xl transition-all z-20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        ❮
      </motion.button>
      <motion.button
        onClick={nextSlide}
        className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 
          bg-gradient-to-br from-[#2d1515] to-[#1a0a0a] hover:from-[#3d2525] hover:to-[#2a1a1a]
          border-2 border-[#d4af37] rounded-full 
          flex items-center justify-center text-[#d4af37] text-2xl transition-all z-20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        ❯
      </motion.button>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {photos.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full transition-all ${
              index === currentIndex 
                ? 'w-8 h-3 bg-gradient-to-r from-[#d4af37] to-[#f5d67a]' 
                : 'w-3 h-3 bg-[#d4af37]/30 hover:bg-[#d4af37]/50'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Photo counter */}
      <p className="text-center text-[#c9a86c] mt-4 font-serif">
        {currentIndex + 1} / {photos.length}
      </p>
    </div>
  )
}
