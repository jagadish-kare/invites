import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import FloatingParticles from '../components/ui/FloatingParticles'
import { useAuth } from '../context/AuthContext'

export default function HomePage() {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a0a] via-[#2d1515] to-[#1a0a0a] flex items-center justify-center p-4">
      <FloatingParticles count={30} />
      
      <motion.div 
        className="text-center relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="text-5xl mb-6"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          💕
        </motion.div>
        
        <h1 className="font-script text-5xl md:text-6xl text-[#d4af37] mb-4">
          Wedding Invitation
        </h1>
        
        <p className="font-serif text-xl text-[#f5e6d3] tracking-widest mb-10">
          Create Beautiful Digital Invitations
        </p>
        
        {isAuthenticated ? (
          <div className="space-y-4">
            <p className="text-[#c9a86c] mb-4">Welcome back, {user?.name}!</p>
            <Link
              to="/dashboard"
              className="inline-block px-12 py-4 bg-gradient-to-r from-[#d4af37] via-[#f5d67a] to-[#d4af37] 
                rounded-full font-serif text-lg font-semibold text-[#1a0a0a] uppercase tracking-wider
                shadow-lg hover:shadow-[#d4af37]/50 hover:-translate-y-1 transition-all"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <Link
              to="/signup"
              className="inline-block px-12 py-4 bg-gradient-to-r from-[#d4af37] via-[#f5d67a] to-[#d4af37] 
                rounded-full font-serif text-lg font-semibold text-[#1a0a0a] uppercase tracking-wider
                shadow-lg hover:shadow-[#d4af37]/50 hover:-translate-y-1 transition-all"
            >
              Get Started
            </Link>
            <div>
              <Link
                to="/login"
                className="text-[#c9a86c] hover:text-[#d4af37] transition-colors"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
