import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

interface Invitation {
  id: string;
  groom_name: string;
  bride_name: string;
  wedding_date: string;
  event_type?: string;
  event_title?: string;
  created_at: string;
}

type FilterType = 'all' | 'wedding' | 'housewarming' | 'birthday' | 'engagement' | 'other';

const EVENT_ICONS: Record<string, string> = {
  wedding: '💒',
  housewarming: '🏠',
  birthday: '🎂',
  engagement: '💍',
  other: '🎊',
}

const EVENT_LABELS: Record<string, string> = {
  wedding: 'Wedding',
  housewarming: 'House Warming',
  birthday: 'Birthday',
  engagement: 'Engagement',
  other: 'Other',
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'live' | 'expired'>('live')
  const [eventFilter, setEventFilter] = useState<FilterType>('all')

  useEffect(() => {
    fetchInvitations()
  }, [])

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
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invitation?')) return
    
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`/api/invitation/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        setInvitations(inv => inv.filter(i => i.id !== id))
      }
    } catch (error) {
      console.error('Error deleting invitation:', error)
    }
  }

  const handleDuplicate = (inv: Invitation) => {
    navigate(`/create?duplicate=${inv.id}`)
  }

  const now = new Date()
  
  // Filter by live/expired status
  const liveInvitations = invitations.filter(inv => {
    const eventDate = new Date(inv.wedding_date)
    const daysPassed = Math.floor((now.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24))
    return daysPassed <= 7
  })
  
  const expiredInvitations = invitations.filter(inv => {
    const eventDate = new Date(inv.wedding_date)
    const daysPassed = Math.floor((now.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24))
    return daysPassed > 7
  })

  // Get base list based on tab
  const baseList = activeTab === 'live' ? liveInvitations : expiredInvitations
  
  // Apply event type filter
  const displayedInvitations = eventFilter === 'all' 
    ? baseList 
    : baseList.filter(inv => (inv.event_type || 'wedding') === eventFilter)

  // Count by event type for filter badges
  const eventCounts = baseList.reduce((acc, inv) => {
    const type = inv.event_type || 'wedding'
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getDaysUntil = (dateStr: string) => {
    const eventDate = new Date(dateStr)
    const days = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (days < 0) return `${Math.abs(days)} days ago`
    if (days === 0) return 'Today!'
    if (days === 1) return 'Tomorrow!'
    return `${days} days left`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2a0a0a] via-[#1a0505] to-[#2a0a0a]">
      {/* Header */}
      <header className="border-b border-[#d4af37]/20 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link to="/" className="font-script text-2xl text-[#d4af37]">Invites</Link>
          <div className="flex items-center gap-4">
            <span className="text-[#c9a86c] text-sm hidden sm:block">Hi, {user?.name}</span>
            <button
              onClick={logout}
              className="text-[#c9a86c] text-sm hover:text-[#d4af37] transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Welcome & Create Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="font-serif text-2xl text-[#f5e6d3]">My Invitations</h1>
            <p className="text-[#a08060] text-sm mt-1">Manage and share your invitations</p>
          </div>
          <Link
            to="/create"
            className="px-6 py-2 bg-gradient-to-r from-[#d4af37] to-[#b8960c] rounded-full text-[#1a0505] font-serif text-sm"
          >
            + Create New
          </Link>
        </div>

        {/* Tabs - Live/Expired */}
        <div className="flex gap-4 mb-4 border-b border-[#d4af37]/20">
          <button
            onClick={() => setActiveTab('live')}
            className={`pb-3 px-2 font-serif text-sm transition-colors relative ${
              activeTab === 'live' ? 'text-[#d4af37]' : 'text-[#a08060]'
            }`}
          >
            Live ({liveInvitations.length})
            {activeTab === 'live' && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4af37]"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('expired')}
            className={`pb-3 px-2 font-serif text-sm transition-colors relative ${
              activeTab === 'expired' ? 'text-[#d4af37]' : 'text-[#a08060]'
            }`}
          >
            Expired ({expiredInvitations.length})
            {activeTab === 'expired' && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4af37]"
              />
            )}
          </button>
        </div>

        {/* Event Type Filter */}
        {baseList.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <FilterButton 
              active={eventFilter === 'all'} 
              onClick={() => setEventFilter('all')}
              count={baseList.length}
            >
              All
            </FilterButton>
            {Object.entries(eventCounts).map(([type, count]) => (
              <FilterButton
                key={type}
                active={eventFilter === type}
                onClick={() => setEventFilter(type as FilterType)}
                count={count}
              >
                {EVENT_ICONS[type] || '🎊'} {EVENT_LABELS[type] || type}
              </FilterButton>
            ))}
          </div>
        )}

        {/* Invitations List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <motion.div
              className="w-8 h-8 border-2 border-[#d4af37]/30 border-t-[#d4af37] rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        ) : displayedInvitations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-5xl mb-4">{activeTab === 'live' ? '📭' : '📦'}</p>
            <p className="text-[#c9a86c] mb-4">
              {eventFilter !== 'all' 
                ? `No ${EVENT_LABELS[eventFilter] || eventFilter} invitations ${activeTab === 'live' ? 'live' : 'expired'}`
                : activeTab === 'live' 
                  ? "You don't have any live invitations" 
                  : "No expired invitations"
              }
            </p>
            {activeTab === 'live' && eventFilter === 'all' && (
              <Link
                to="/create"
                className="inline-block px-6 py-2 border border-[#d4af37] rounded-full text-[#d4af37] font-serif text-sm"
              >
                Create Your First Invitation
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {displayedInvitations.map((inv, index) => (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1a0505]/50 border border-[#d4af37]/20 rounded-xl p-4 sm:p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{EVENT_ICONS[inv.event_type || 'wedding']}</span>
                      <h3 className="font-serif text-lg text-[#f5e6d3]">
                        {inv.groom_name}{inv.bride_name ? ` & ${inv.bride_name}` : ''}
                      </h3>
                    </div>
                    <p className="text-[#c9a86c] text-sm">
                      {formatDate(inv.wedding_date)}
                      <span className="mx-2">•</span>
                      <span className={activeTab === 'live' ? 'text-green-400' : 'text-[#a08060]'}>
                        {getDaysUntil(inv.wedding_date)}
                      </span>
                    </p>
                    {inv.event_type && inv.event_type !== 'wedding' && (
                      <p className="text-[#a08060] text-xs mt-1">
                        {EVENT_LABELS[inv.event_type] || inv.event_title}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {/* View */}
                    <a
                      href={`/invitation/${inv.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded text-[#d4af37] text-xs"
                    >
                      👁 View
                    </a>
                    
                    {/* Copy Link */}
                    <button
                      onClick={() => {
                        const url = `${window.location.origin}/invitation/${inv.id}`
                        navigator.clipboard.writeText(url)
                        alert('Link copied!')
                      }}
                      className="px-3 py-1.5 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded text-[#d4af37] text-xs"
                    >
                      🔗 Copy Link
                    </button>
                    
                    {/* Edit (only for live) */}
                    {activeTab === 'live' && (
                      <Link
                        to={`/create?edit=${inv.id}`}
                        className="px-3 py-1.5 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded text-[#d4af37] text-xs"
                      >
                        ✏️ Edit
                      </Link>
                    )}
                    
                    {/* Duplicate */}
                    <button
                      onClick={() => handleDuplicate(inv)}
                      className="px-3 py-1.5 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded text-[#d4af37] text-xs"
                    >
                      📋 Duplicate
                    </button>
                    
                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(inv.id)}
                      className="px-3 py-1.5 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-xs"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function FilterButton({ 
  children, 
  active, 
  onClick, 
  count 
}: { 
  children: React.ReactNode; 
  active: boolean; 
  onClick: () => void;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-serif transition-all ${
        active 
          ? 'bg-[#d4af37] text-[#1a0505]' 
          : 'bg-[#1a0505]/50 border border-[#d4af37]/30 text-[#c9a86c] hover:border-[#d4af37]/60'
      }`}
    >
      {children} ({count})
    </button>
  )
}
