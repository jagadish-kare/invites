import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { InvitationData, GuestbookEntry } from '../types/invitation'

// Import templates
import RoyalMaroonTemplate from '../templates/RoyalMaroon'

interface ExpiredData {
  groom_name?: string;
  bride_name?: string;
  event_type?: string;
  event_title?: string;
  message?: string;
}

export default function InvitationPage() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<InvitationData | null>(null)
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expired, setExpired] = useState<ExpiredData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invResponse = await fetch(`/api/invitation/${id}`)
        const invData = await invResponse.json()
        
        // Handle expired/completed event
        if (invResponse.status === 410 || invData.expired) {
          setExpired({
            groom_name: invData.groom_name,
            bride_name: invData.bride_name,
            event_type: invData.event_type,
            event_title: invData.event_title,
            message: invData.message || 'The celebration has concluded.'
          })
          setLoading(false)
          return
        }
        
        if (!invResponse.ok) {
          throw new Error(invData.message || 'Invitation not found')
        }
        
        setData({
          id: invData.id,
          templateId: invData.template_id || 'royal-maroon',
          
          // Event type and custom labels
          eventType: invData.event_type || 'wedding',
          eventTitle: invData.event_title || 'Wedding Invitation',
          mainCeremonyLabel: invData.main_ceremony_label || 'WEDDING CEREMONY',
          secondaryCeremonyLabel: invData.secondary_ceremony_label || 'HALADI CEREMONY',
          receptionLabel: invData.reception_label || 'RECEPTION',
          
          // Names
          groomName: invData.groom_name,
          brideName: invData.bride_name,
          
          // Family
          groomFatherName: invData.groom_father_name || '',
          groomMotherName: invData.groom_mother_name || '',
          brideFatherName: invData.bride_father_name || '',
          brideMotherName: invData.bride_mother_name || '',
          groomAddress: invData.groom_address || '',
          brideAddress: invData.bride_address || '',
          
          // Main ceremony
          weddingDate: invData.wedding_date,
          weddingTime: invData.wedding_time || '12:00',
          weddingVenue: invData.wedding_venue || '',
          weddingVenueAddress: invData.wedding_venue_address || '',
          googleMapsLink: invData.google_maps_link || '',
          
          // Secondary ceremony
          haladiDate: invData.haladi_date,
          haladiTime: invData.haladi_time,
          haladiVenue: invData.haladi_venue,
          
          // Reception
          receptionDate: invData.reception_date,
          receptionTime: invData.reception_time,
          receptionVenue: invData.reception_venue,
          
          // Media
          mainPhoto: invData.main_photo || '',
          galleryPhotos: invData.gallery_photos || [],
          qrCodeImage: invData.qr_code_image || '',
          qrLabel: invData.qr_label || 'Gift',
          
          // Schedule
          schedule: invData.schedule || [],
          
          // Meta
          createdAt: invData.created_at,
        })

        // Fetch guestbook entries
        const gbResponse = await fetch(`/api/guestbook/${id}`)
        if (gbResponse.ok) {
          const entries = await gbResponse.json()
          setGuestbookEntries(entries.map((e: any) => ({
            id: e.id,
            invitationId: e.invitation_id,
            guestName: e.guest_name,
            wishes: e.wishes,
            createdAt: e.created_at,
          })))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load invitation')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchData()
  }, [id])

  const handleGuestbookSubmit = async (name: string, wishes: string) => {
    const response = await fetch(`/api/guestbook/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestName: name, wishes }),
    })

    if (!response.ok) throw new Error('Failed to submit')

    const result = await response.json()
    
    setGuestbookEntries(prev => [{
      id: result.id,
      invitationId: id!,
      guestName: name,
      wishes,
      createdAt: result.createdAt,
    }, ...prev])
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#2a0a0a] to-[#1a0505] flex items-center justify-center">
        <motion.div
          className="w-12 h-12 border-2 border-[#d4af37]/30 border-t-[#d4af37] rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    )
  }

  // Show beautiful "Event Completed" page
  if (expired) {
    const isWedding = expired.event_type === 'wedding' || !expired.event_type
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#2a0a0a] via-[#1a0505] to-[#2a0a0a] flex items-center justify-center p-6">
        <motion.div 
          className="text-center max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Decorative icon based on event type */}
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-6xl mb-6"
          >
            {isWedding ? '💐' : expired.event_type === 'birthday' ? '🎂' : expired.event_type === 'housewarming' ? '🏠' : '🎊'}
          </motion.div>

          {expired.groom_name && (
            <h1 className="font-script text-4xl text-[#d4af37] mb-4">
              {expired.groom_name}{expired.bride_name ? ` & ${expired.bride_name}` : ''}
            </h1>
          )}

          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mb-6" />

          <h2 className="font-serif text-xl text-[#f5e6d3] mb-4">
            {isWedding ? 'Celebration Completed' : 'Event Completed'}
          </h2>

          <p className="text-[#c9a86c] mb-8 leading-relaxed">
            {expired.message}
          </p>

          <p className="text-[#a08060] text-sm mb-8">
            Thank you for being part of our special {isWedding ? 'journey' : 'celebration'}. 
            Your blessings will always remain in our hearts. 🙏
          </p>

          <Link
            to="/"
            className="inline-block px-8 py-3 border border-[#d4af37] rounded-full text-[#d4af37] font-serif hover:bg-[#d4af37]/10 transition-colors"
          >
            Create Your Invitation
          </Link>
        </motion.div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#2a0a0a] to-[#1a0505] flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-6xl mb-4">💔</p>
          <p className="text-[#d4af37] text-xl font-serif mb-4">
            {error || 'Invitation not found'}
          </p>
          <Link 
            to="/" 
            className="text-[#c9a86c] hover:text-[#d4af37] transition-colors"
          >
            ← Go back home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <RoyalMaroonTemplate
      data={data}
      onGuestbookSubmit={handleGuestbookSubmit}
      guestbookEntries={guestbookEntries}
    />
  )
}
