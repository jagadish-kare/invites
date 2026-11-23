import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import FloatingParticles from '../components/ui/FloatingParticles'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error || 'Login failed')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a0a] via-[#2d1515] to-[#1a0a0a] flex items-center justify-center p-4">
      <FloatingParticles count={20} />
      
      <motion.div
        className="w-full max-w-md bg-[#2d1515]/80 border border-[#d4af37]/30 rounded-2xl p-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <h1 className="font-script text-4xl text-[#d4af37] mb-2">Welcome Back</h1>
          <p className="text-[#c9a86c]">Sign in to manage your invitations</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-[#c9a86c] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 bg-[#1a0a0a]/80 border border-[#d4af37]/30 rounded-lg 
                text-[#f5e6d3] placeholder-[#a08060] focus:outline-none focus:border-[#d4af37]"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm text-[#c9a86c] mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 bg-[#1a0a0a]/80 border border-[#d4af37]/30 rounded-lg 
                text-[#f5e6d3] placeholder-[#a08060] focus:outline-none focus:border-[#d4af37]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-[#d4af37] via-[#f5d67a] to-[#d4af37] 
              rounded-full font-serif font-semibold text-[#1a0a0a] uppercase tracking-wider
              hover:shadow-lg hover:shadow-[#d4af37]/30 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#a08060]">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#d4af37] hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-[#c9a86c] hover:text-[#d4af37] text-sm">
            ← Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
