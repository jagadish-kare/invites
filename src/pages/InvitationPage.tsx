import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { InvitationData, GuestbookEntry } from '../types/invitation'

// Import templates
import RoyalMaroonTemplate from '../templates/RoyalMaroon'

export default function InvitationPage() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<InvitationData | null>(null)
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch invitation data
        const invResponse = await fetch(`/api/invitation/${id}`)
        if (!invResponse.ok) throw new Error('Invitation not found')
        const invData = await invResponse.json()
        
        // Transform API response to match our type
        setData({
          id: invData.id,
          templateId: invData.template_id || 'royal-maroon',
          groomName: invData.groom_name,
          brideName: invData.bride_name,
          groomFatherName: invData.groom_father_name || '',
          groomMotherName: invData.groom_mother_name || '',
          brideFatherName: invData.bride_father_name || '',
          brideMotherName: invData.bride_mother_name || '',
          groomAddress: invData.groom_address || '',
          brideAddress: invData.bride_address || '',
          weddingDate: invData.wedding_date,
          weddingTime: invData.wedding_time || '12:00',
          weddingVenue: invData.wedding_venue || '',
          weddingVenueAddress: invData.wedding_venue_address || '',
          googleMapsLink: invData.google_maps_link || '',
          haladiDate: invData.haladi_date,
          haladiTime: invData.haladi_time,
          haladiVenue: invData.haladi_venue,
          receptionDate: invData.reception_date,
          receptionTime: invData.reception_time,
          receptionVenue: invData.reception_venue,
          mainPhoto: invData.main_photo || '',
          galleryPhotos: invData.gallery_photos || [],
          qrCodeImage: invData.qr_code_image || '',
          qrLabel: invData.qr_label || 'Gift',
          schedule: invData.schedule || [],
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
    
    // Add new entry to state
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
      <div className="min-h-screen bg-[#1a0a0a] flex items-center justify-center">
        <div className="w-12 h-12 border-3 border-[#d4af37]/30 border-t-[#d4af37] rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#1a0a0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#d4af37] text-2xl font-serif mb-4">
            {error || 'Invitation not found'}
          </p>
          <a href="/" className="text-[#c9a86c] hover:text-[#d4af37] transition-colors">
            ← Go back home
          </a>
        </div>
      </div>
    )
  }

  // Render template based on templateId
  // For now, we only have RoyalMaroon, but this is extensible
  return (
    <RoyalMaroonTemplate
      data={data}
      onGuestbookSubmit={handleGuestbookSubmit}
      guestbookEntries={guestbookEntries}
    />
  )
}
