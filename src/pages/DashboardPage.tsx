import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

interface InvitationSummary {
  id: string;
  groom_name: string;
  bride_name: string;
  wedding_date: string;
  created_at: string;
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [invitations, setInvitations] = useState<InvitationSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const token = localStorage.getItem('authToken')
        const response = await fetch('/api/user/invitations', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          setInvitations(data)
        }
      } catch (error) {
        console.error('Error fetching invitations:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchInvitations()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a0a] via-[#2d1515] to-[#1a0a0a]">
      {/* Header */}
      <header className="border-b border-[#d4af37]/20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-script text-2xl text-[#d4af37]">
            Wedding Invitation
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-[#c9a86c]">Hello, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-[#c9a86c] hover:text-[#d4af37] transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl text-[#d4af37]">My Invitations</h1>
          <Link
            to="/create"
            className="px-6 py-3 bg-gradient-to-r from-[#d4af37] via-[#f5d67a] to-[#d4af37] 
              rounded-full font-serif font-semibold text-[#1a0a0a] uppercase tracking-wider
              hover:shadow-lg hover:shadow-[#d4af37]/30 transition-all"
          >
            + Create New
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-3 border-[#d4af37]/30 border-t-[#d4af37] rounded-full animate-spin mx-auto" />
          </div>
        ) : invitations.length === 0 ? (
          <motion.div
            className="text-center py-16 bg-[#2d1515]/50 border border-[#d4af37]/20 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-6xl mb-4">💍</div>
            <h2 className="font-serif text-2xl text-[#f5e6d3] mb-2">No invitations yet</h2>
            <p className="text-[#c9a86c] mb-6">Create your first beautiful wedding invitation</p>
            <Link
              to="/create"
              className="inline-block px-8 py-3 bg-gradient-to-r from-[#d4af37] via-[#f5d67a] to-[#d4af37] 
                rounded-full font-serif font-semibold text-[#1a0a0a] uppercase tracking-wider"
            >
              Create Invitation
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invitations.map((inv, index) => (
              <motion.div
                key={inv.id}
                className="bg-[#2d1515]/80 border border-[#d4af37]/30 rounded-xl p-6 hover:border-[#d4af37]/50 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-center mb-4">
                  <h3 className="font-script text-2xl text-[#d4af37]">
                    {inv.groom_name} & {inv.bride_name}
                  </h3>
                  <p className="text-[#c9a86c] text-sm mt-1">
                    {formatDate(inv.wedding_date)}
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  <a
                    href={`/invitation/${inv.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 text-center border border-[#d4af37] text-[#d4af37] rounded-lg hover:bg-[#d4af37]/10 transition-colors text-sm"
                  >
                    View
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/invitation/${inv.id}`)
                      alert('Link copied!')
                    }}
                    className="flex-1 py-2 text-center border border-[#c9a86c] text-[#c9a86c] rounded-lg hover:bg-[#c9a86c]/10 transition-colors text-sm"
                  >
                    Copy Link
                  </button>
                </div>

                <p className="text-xs text-[#a08060] text-center mt-4">
                  Created {formatDate(inv.created_at)}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
