import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface GiftBoxProps {
  qrCodeImage: string;
  qrLabel?: string;
  className?: string;
}

// Floating particle component for gift box
function GiftParticle({ delay, left }: { delay: number; left: number }) {
  const particles = ['✨', '💝', '🎀', '💫', '⭐', '🌟', '💕']
  const particle = particles[Math.floor(Math.random() * particles.length)]
  
  return (
    <motion.div
      className="absolute text-xl pointer-events-none"
      style={{ left: `${left}%` }}
      initial={{ y: 0, opacity: 0, scale: 0 }}
      animate={{ 
        y: [-20, -80, -140],
        opacity: [0, 1, 0],
        scale: [0, 1.2, 0.5],
        x: [0, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 100],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 2,
      }}
    >
      {particle}
    </motion.div>
  )
}

export default function GiftBox({ 
  qrCodeImage, 
  qrLabel = 'Gift',
  className = '' 
}: GiftBoxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [particles, setParticles] = useState<{ id: number; delay: number; left: number }[]>([])

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      delay: Math.random() * 3,
      left: 10 + Math.random() * 80,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className={`relative ${className}`}>
      {/* Gift Box Container */}
      <div 
        className="relative w-48 h-56 mx-auto cursor-pointer group"
        onClick={() => setIsOpen(true)}
      >
        {/* Floating particles above the box */}
        <div className="absolute -top-10 left-0 right-0 h-40">
          {particles.map((p) => (
            <GiftParticle key={p.id} delay={p.delay} left={p.left} />
          ))}
        </div>

        {/* Glow effect behind box */}
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-[#d4af37]/30 via-transparent to-transparent rounded-full blur-2xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Box Body */}
        <motion.div 
          className="absolute bottom-0 w-full h-36 bg-gradient-to-b from-[#8B0000] via-[#6a0000] to-[#4a0000] rounded-lg shadow-2xl overflow-hidden"
          style={{ 
            boxShadow: '0 10px 40px rgba(139, 0, 0, 0.5), inset 0 2px 10px rgba(255,255,255,0.1)' 
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {/* Vertical ribbon */}
          <div className="absolute left-1/2 -translate-x-1/2 w-10 h-full bg-gradient-to-b from-[#f5d67a] via-[#d4af37] to-[#b8960c]">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
          {/* Horizontal ribbon */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full h-10 bg-gradient-to-r from-[#b8960c] via-[#d4af37] to-[#b8960c]">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          </div>
          
          {/* Gold border */}
          <div className="absolute inset-0 border-4 border-[#d4af37] rounded-lg pointer-events-none" />
          
          {/* Decorative corner flowers */}
          <svg className="absolute top-1 left-1 w-8 h-8" viewBox="0 0 30 30">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <ellipse key={i} cx="15" cy="6" rx="4" ry="6" fill="#f5e6d3" transform={`rotate(${angle} 15 15)`} />
            ))}
            <circle cx="15" cy="15" r="4" fill="#d4af37" />
          </svg>
          <svg className="absolute top-1 right-1 w-8 h-8" viewBox="0 0 30 30">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <ellipse key={i} cx="15" cy="6" rx="4" ry="6" fill="#f5e6d3" transform={`rotate(${angle} 15 15)`} />
            ))}
            <circle cx="15" cy="15" r="4" fill="#d4af37" />
          </svg>
          <svg className="absolute bottom-1 left-1 w-8 h-8" viewBox="0 0 30 30">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <ellipse key={i} cx="15" cy="6" rx="4" ry="6" fill="#f5e6d3" transform={`rotate(${angle} 15 15)`} />
            ))}
            <circle cx="15" cy="15" r="4" fill="#d4af37" />
          </svg>
          <svg className="absolute bottom-1 right-1 w-8 h-8" viewBox="0 0 30 30">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <ellipse key={i} cx="15" cy="6" rx="4" ry="6" fill="#f5e6d3" transform={`rotate(${angle} 15 15)`} />
            ))}
            <circle cx="15" cy="15" r="4" fill="#d4af37" />
          </svg>
        </motion.div>

        {/* Box Lid */}
        <motion.div 
          className="absolute top-12 left-1/2 -translate-x-1/2 w-[115%] h-12 origin-bottom perspective-1000"
          whileHover={{ rotateX: -40, y: -20 }}
          transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
        >
          <div 
            className="w-full h-full bg-gradient-to-b from-[#9a1515] via-[#8B0000] to-[#6a0000] rounded-t-lg"
            style={{ 
              boxShadow: '0 -5px 20px rgba(139, 0, 0, 0.5), inset 0 2px 10px rgba(255,255,255,0.1)' 
            }}
          >
            {/* Lid ribbon */}
            <div className="absolute left-1/2 -translate-x-1/2 w-10 h-full bg-gradient-to-b from-[#f5d67a] via-[#d4af37] to-[#b8960c]">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
            {/* Gold border */}
            <div className="absolute inset-0 border-4 border-[#d4af37] rounded-t-lg pointer-events-none" />
          </div>
          
          {/* Elaborate Bow */}
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-24 h-20">
            <svg viewBox="0 0 100 80" className="w-full h-full">
              <defs>
                <linearGradient id="bowGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f5d67a" />
                  <stop offset="50%" stopColor="#d4af37" />
                  <stop offset="100%" stopColor="#b8960c" />
                </linearGradient>
              </defs>
              {/* Left loop */}
              <ellipse cx="25" cy="40" rx="22" ry="30" fill="url(#bowGold)" />
              <ellipse cx="25" cy="40" rx="12" ry="20" fill="#8B0000" opacity="0.3" />
              {/* Right loop */}
              <ellipse cx="75" cy="40" rx="22" ry="30" fill="url(#bowGold)" />
              <ellipse cx="75" cy="40" rx="12" ry="20" fill="#8B0000" opacity="0.3" />
              {/* Center knot */}
              <ellipse cx="50" cy="50" rx="12" ry="15" fill="url(#bowGold)" />
              <ellipse cx="50" cy="50" rx="6" ry="8" fill="#b8960c" />
              {/* Ribbon tails */}
              <path d="M42,65 Q35,75 30,80 L38,80 Q43,75 45,70 Z" fill="url(#bowGold)" />
              <path d="M58,65 Q65,75 70,80 L62,80 Q57,75 55,70 Z" fill="url(#bowGold)" />
            </svg>
          </div>
        </motion.div>

        {/* Sparkle effects */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#f5d67a] rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + (i % 2) * 20}%`,
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.3,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          />
        ))}
      </div>

      <motion.p 
        className="text-center text-[#c9a86c] font-serif mt-6 text-lg"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ✨ Tap to open ✨
      </motion.p>

      {/* QR Code Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            {/* Confetti effect */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10%',
                  background: ['#d4af37', '#f5d67a', '#8B0000', '#f5e6d3', '#ff69b4'][i % 5],
                }}
                initial={{ y: 0, rotate: 0, opacity: 1 }}
                animate={{
                  y: '120vh',
                  rotate: 720,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                }}
              />
            ))}

            <motion.div
              className="bg-gradient-to-b from-[#f5e6d3] to-[#e8d5b5] rounded-2xl p-8 max-w-sm w-full relative overflow-hidden"
              initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotateY: 180 }}
              transition={{ type: 'spring', duration: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative border */}
              <div className="absolute inset-2 border-2 border-[#d4af37] rounded-xl pointer-events-none" />
              
              {/* Close button */}
              <motion.button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-[#8B0000] to-[#5a0000] rounded-full text-white flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>

              {/* Gift icon */}
              <motion.div
                className="text-5xl text-center mb-4"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎁
              </motion.div>

              <h3 className="font-serif text-3xl text-[#8B0000] text-center mb-2">
                GIFT BOX
              </h3>
              <p className="font-serif text-lg text-[#5a0000] text-center mb-6">
                {qrLabel}
              </p>

              {/* QR Code */}
              <motion.div 
                className="bg-white rounded-xl p-5 max-w-[220px] mx-auto shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <img 
                  src={qrCodeImage} 
                  alt="QR Code" 
                  className="w-full h-auto"
                />
              </motion.div>

              {/* Save button */}
              <motion.a
                href={qrCodeImage}
                download="qr-code.png"
                className="block mt-6 py-3 px-8 bg-gradient-to-r from-[#8B0000] via-[#a52a2a] to-[#8B0000] text-white text-center rounded-full font-serif mx-auto w-fit shadow-lg"
                whileHover={{ scale: 1.05, boxShadow: '0 5px 20px rgba(139,0,0,0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                ⬇ Save QR Code
              </motion.a>

              <p className="text-center text-[#8B0000]/60 font-serif mt-4 text-sm">
                Your blessings are our greatest treasure
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
