import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import FloatingParticles from '../components/ui/FloatingParticles'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    const result = await signup(name, email, password)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error || 'Signup failed')
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
          <h1 className="font-script text-4xl text-[#d4af37] mb-2">Create Account</h1>
          <p className="text-[#c9a86c]">Start creating beautiful invitations</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#c9a86c] mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 bg-[#1a0a0a]/80 border border-[#d4af37]/30 rounded-lg 
                text-[#f5e6d3] placeholder-[#a08060] focus:outline-none focus:border-[#d4af37]"
              placeholder="Your name"
            />
          </div>

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

          <div>
            <label className="block text-sm text-[#c9a86c] mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#a08060]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#d4af37] hover:underline">
              Sign in
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
