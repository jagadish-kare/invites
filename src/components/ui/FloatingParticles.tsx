import { motion } from 'framer-motion'

interface FloatingParticlesProps {
  count?: number;
  colors?: string[];
}

export default function FloatingParticles({ 
  count = 30, 
  colors = ['#d4af37', '#f5d67a', '#f5e6d3', '#c9a86c']
}: FloatingParticlesProps) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 15,
    duration: 12 + Math.random() * 8,
    size: 4 + Math.random() * 12,
    color: colors[Math.floor(Math.random() * colors.length)],
    type: Math.random() > 0.6 ? 'sparkle' : 'circle', // Some sparkles, some circles
    rotateSpeed: 180 + Math.random() * 540,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.left}%`,
            width: particle.size,
            height: particle.size,
          }}
          initial={{ y: '100vh', opacity: 0 }}
          animate={{
            y: '-100vh',
            opacity: [0, 0.8, 0.8, 0],
            rotate: particle.rotateSpeed,
            x: [0, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 50],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {particle.type === 'sparkle' ? (
            <svg viewBox="0 0 24 24" className="w-full h-full" fill={particle.color}>
              <path d="M12,2 L14,10 L22,12 L14,14 L12,22 L10,14 L2,12 L10,10 Z" />
            </svg>
          ) : (
            <div
              className="w-full h-full rounded-full"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${particle.color}, transparent 70%)`,
                boxShadow: `0 0 ${particle.size}px ${particle.color}40`,
              }}
            />
          )}
        </motion.div>
      ))}

      {/* Additional floating hearts - sparse */}
      {Array.from({ length: 5 }, (_, i) => (
        <motion.div
          key={`heart-${i}`}
          className="absolute text-2xl"
          style={{ left: `${10 + i * 20}%` }}
          initial={{ y: '100vh', opacity: 0 }}
          animate={{
            y: '-100vh',
            opacity: [0, 0.6, 0.6, 0],
            scale: [0.5, 1, 0.5],
            rotate: [0, 20, -20, 0],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            delay: i * 3 + Math.random() * 5,
            repeat: Infinity,
          }}
        >
          💕
        </motion.div>
      ))}
    </div>
  )
}
