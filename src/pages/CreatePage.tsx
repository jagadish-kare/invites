import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { EVENT_TYPES, EventType } from '../types/invitation'
import { THEMES } from '../templates/themes'

interface FormData {
  templateId: string;
  eventType: EventType;
  eventTitle: string;
  mainCeremonyLabel: string;
  secondaryCeremonyLabel: string;
  receptionLabel: string;
  groomName: string;
  brideName: string;
  groomFatherName: string;
  groomMotherName: string;
  brideFatherName: string;
  brideMotherName: string;
  groomAddress: string;
  brideAddress: string;
  weddingDate: string;
  weddingTime: string;
  weddingVenue: string;
  weddingVenueAddress: string;
  googleMapsLink: string;
  haladiDate: string;
  haladiTime: string;
  haladiVenue: string;
  receptionDate: string;
  receptionTime: string;
  receptionVenue: string;
  qrLabel: string;
  youtubeLink: string;
  schedule: { time: string; event: string }[];
}

const DEFAULT_LABELS: Record<EventType, { main: string; secondary: string; reception: string }> = {
  wedding: { main: 'WEDDING CEREMONY', secondary: 'HALADI CEREMONY', reception: 'RECEPTION' },
  housewarming: { main: 'GRIHA PRAVESH', secondary: 'POOJA CEREMONY', reception: 'LUNCH' },
  engagement: { main: 'ENGAGEMENT CEREMONY', secondary: 'RING CEREMONY', reception: 'DINNER' },
  birthday: { main: 'BIRTHDAY CELEBRATION', secondary: 'CAKE CUTTING', reception: 'PARTY' },
  other: { main: 'MAIN CEREMONY', secondary: 'CEREMONY', reception: 'CELEBRATION' },
}

export default function CreatePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const editId = searchParams.get('edit')
  const duplicateId = searchParams.get('duplicate')
  const isEditMode = !!editId
  const isDuplicateMode = !!duplicateId

  const [formData, setFormData] = useState<FormData>({
    templateId: 'royal-maroon',
    eventType: 'wedding',
    eventTitle: 'Wedding Invitation',
    mainCeremonyLabel: 'WEDDING CEREMONY',
    secondaryCeremonyLabel: 'HALADI CEREMONY',
    receptionLabel: 'RECEPTION',
    groomName: '',
    brideName: '',
    groomFatherName: '',
    groomMotherName: '',
    brideFatherName: '',
    brideMotherName: '',
    groomAddress: '',
    brideAddress: '',
    weddingDate: '',
    weddingTime: '',
    weddingVenue: '',
    weddingVenueAddress: '',
    googleMapsLink: '',
    haladiDate: '',
    haladiTime: '',
    haladiVenue: '',
    receptionDate: '',
    receptionTime: '',
    receptionVenue: '',
    qrLabel: 'Gift',
    youtubeLink: '',
    schedule: [{ time: '09:00', event: '' }],
  })

  const [mainPhoto, setMainPhoto] = useState<string>('')
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([])
  const [qrCodeImage, setQrCodeImage] = useState<string>('')
  const [audioUrl, setAudioUrl] = useState<string>('')
  const [tempId] = useState<string>(`temp-${Date.now()}`)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ id: string; url: string } | null>(null)

  // Load existing invitation data for edit/duplicate
  useEffect(() => {
    const loadInvitation = async (id: string) => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem('authToken')
        const response = await fetch(`/api/invitation/${id}/full`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          setFormData({
            templateId: data.template_id || 'royal-maroon',
            eventType: data.event_type || 'wedding',
            eventTitle: data.event_title || 'Wedding Invitation',
            mainCeremonyLabel: data.main_ceremony_label || 'WEDDING CEREMONY',
            secondaryCeremonyLabel: data.secondary_ceremony_label || 'HALADI CEREMONY',
            receptionLabel: data.reception_label || 'RECEPTION',
            groomName: data.groom_name || '',
            brideName: data.bride_name || '',
            groomFatherName: data.groom_father_name || '',
            groomMotherName: data.groom_mother_name || '',
            brideFatherName: data.bride_father_name || '',
            brideMotherName: data.bride_mother_name || '',
            groomAddress: data.groom_address || '',
            brideAddress: data.bride_address || '',
            weddingDate: isDuplicateMode ? '' : (data.wedding_date || ''),
            weddingTime: data.wedding_time || '',
            weddingVenue: data.wedding_venue || '',
            weddingVenueAddress: data.wedding_venue_address || '',
            googleMapsLink: data.google_maps_link || '',
            haladiDate: isDuplicateMode ? '' : (data.haladi_date || ''),
            haladiTime: data.haladi_time || '',
            haladiVenue: data.haladi_venue || '',
            receptionDate: isDuplicateMode ? '' : (data.reception_date || ''),
            receptionTime: data.reception_time || '',
            receptionVenue: data.reception_venue || '',
            qrLabel: data.qr_label || 'Gift',
            youtubeLink: data.youtube_link || '',
            schedule: data.schedule?.length ? data.schedule : [{ time: '09:00', event: '' }],
          })
          // For duplicate, don't copy photos (user needs to upload new ones)
          if (!isDuplicateMode) {
            setMainPhoto(data.main_photo || '')
            setGalleryPhotos(data.gallery_photos || [])
            setQrCodeImage(data.qr_code_image || '')
            setAudioUrl(data.audio_url || '')
          }
        }
      } catch (error) {
        console.error('Error loading invitation:', error)
        alert('Failed to load invitation data')
      } finally {
        setIsLoading(false)
      }
    }

    if (editId) loadInvitation(editId)
    else if (duplicateId) loadInvitation(duplicateId)
  }, [editId, duplicateId, isDuplicateMode])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEventTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const eventType = e.target.value as EventType
    const eventInfo = EVENT_TYPES.find(et => et.value === eventType)
    const labels = DEFAULT_LABELS[eventType]
    
    setFormData(prev => ({
      ...prev,
      eventType,
      eventTitle: eventInfo?.defaultTitle || 'You are Invited',
      mainCeremonyLabel: labels.main,
      secondaryCeremonyLabel: labels.secondary,
      receptionLabel: labels.reception,
    }))
  }

  const handleFileUpload = async (
    file: File, 
    type: 'main' | 'gallery' | 'qr' | 'audio'
  ) => {
    const formDataObj = new FormData()
    formDataObj.append('image', file)

    try {
      const token = localStorage.getItem('authToken')
      const uploadId = isEditMode ? editId : tempId
      const response = await fetch(`/api/upload/${uploadId}`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}` 
        },
        body: formDataObj,
      })
      const data = await response.json()
      
      if (data.success) {
        if (type === 'main') setMainPhoto(data.path)
        else if (type === 'qr') setQrCodeImage(data.path)
        else if (type === 'audio') setAudioUrl(data.path)
        else if (type === 'gallery') setGalleryPhotos(prev => [...prev, data.path])
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload file')
    }
  }

  const addScheduleItem = () => {
    setFormData(prev => ({
      ...prev,
      schedule: [...prev.schedule, { time: '', event: '' }],
    }))
  }

  const updateScheduleItem = (index: number, field: 'time' | 'event', value: string) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      ),
    }))
  }

  const removeScheduleItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        ...formData,
        mainPhoto,
        galleryPhotos,
        qrCodeImage,
        audioUrl,
        schedule: formData.schedule.filter(s => s.time && s.event),
      }

      const token = localStorage.getItem('authToken')
      const url = isEditMode ? `/api/invitation/${editId}` : '/api/invitation'
      const method = isEditMode ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      
      if (data.success) {
        if (isEditMode) {
          alert('Invitation updated successfully!')
          navigate('/dashboard')
        } else {
          setResult({ id: data.id, url: data.url })
        }
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      alert('Failed to save invitation: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyLink = () => {
    if (result) {
      navigator.clipboard.writeText(window.location.origin + result.url)
      alert('Link copied!')
    }
  }

  // Get dynamic labels based on event type
  const isWeddingType = formData.eventType === 'wedding'
  const hostLabel1 = isWeddingType ? "Groom's Name" : "Host Name"
  const hostLabel2 = isWeddingType ? "Bride's Name" : "Co-Host Name (Optional)"

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0a0a] via-[#2d1515] to-[#1a0a0a] flex items-center justify-center">
        <motion.div
          className="w-10 h-10 border-2 border-[#d4af37]/30 border-t-[#d4af37] rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a0a] via-[#2d1515] to-[#1a0a0a] py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-script text-4xl text-[#d4af37] mb-2">
            {isEditMode ? 'Edit Invitation' : isDuplicateMode ? 'Create from Template' : 'Create Your Invitation'}
          </h1>
          <p className="text-[#c9a86c]">
            {isEditMode ? 'Update your invitation details' : 'Fill in the details to generate your invitation'}
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Theme Selection */}
          <FormSection title="🎨 Choose Theme">
            <p className="text-[#a08060] text-sm mb-4">Select a color theme for your invitation</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, templateId: theme.id }))}
                  className={`relative p-3 rounded-lg border-2 transition-all ${
                    formData.templateId === theme.id 
                      ? 'border-[#d4af37] bg-[#d4af37]/10' 
                      : 'border-[#d4af37]/30 hover:border-[#d4af37]/50'
                  }`}
                >
                  {/* Color preview */}
                  <div className="flex gap-1 mb-2 justify-center">
                    <div 
                      className="w-6 h-6 rounded-full border border-white/20"
                      style={{ backgroundColor: theme.colors.bgGradientFrom }}
                    />
                    <div 
                      className="w-6 h-6 rounded-full border border-white/20"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div 
                      className="w-6 h-6 rounded-full border border-white/20"
                      style={{ backgroundColor: theme.colors.textPrimary }}
                    />
                  </div>
                  <p className="text-[#f5e6d3] text-sm font-medium">{theme.name}</p>
                  <p className="text-[#a08060] text-xs mt-1">{theme.description}</p>
                  {formData.templateId === theme.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-[#d4af37] rounded-full flex items-center justify-center">
                      <span className="text-[#1a0a0a] text-xs">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </FormSection>

          {/* Event Type Selection */}
          <FormSection title="🎊 Event Type">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#c9a86c] mb-2">Select Event Type *</label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleEventTypeChange}
                  className="w-full p-3 bg-[#1a0a0a]/80 border border-[#d4af37]/30 rounded-lg 
                    text-[#f5e6d3] focus:outline-none focus:border-[#d4af37] transition-colors"
                >
                  {EVENT_TYPES.map(et => (
                    <option key={et.value} value={et.value}>{et.label}</option>
                  ))}
                </select>
              </div>
              <Input 
                label="Event Title" 
                name="eventTitle" 
                value={formData.eventTitle}
                onChange={handleInputChange}
                placeholder="e.g., Wedding Invitation"
              />
            </div>
          </FormSection>

          {/* Custom Ceremony Labels */}
          <FormSection title="📝 Ceremony Labels (Customize headings)">
            <p className="text-[#a08060] text-sm mb-4">These labels will appear as section headings in your invitation</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input 
                label="Main Ceremony Label *" 
                name="mainCeremonyLabel" 
                value={formData.mainCeremonyLabel}
                onChange={handleInputChange}
                placeholder="e.g., WEDDING CEREMONY"
                required
              />
              <Input 
                label="Secondary Ceremony Label" 
                name="secondaryCeremonyLabel" 
                value={formData.secondaryCeremonyLabel}
                onChange={handleInputChange}
                placeholder="e.g., HALADI CEREMONY"
              />
              <Input 
                label="Reception/Party Label" 
                name="receptionLabel" 
                value={formData.receptionLabel}
                onChange={handleInputChange}
                placeholder="e.g., RECEPTION"
              />
            </div>
          </FormSection>

          {/* Host/Couple Details */}
          <FormSection title={isWeddingType ? "💑 Couple Details" : "👤 Host Details"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label={`${hostLabel1} *`}
                name="groomName" 
                value={formData.groomName}
                onChange={handleInputChange}
                required
              />
              <Input 
                label={hostLabel2}
                name="brideName" 
                value={formData.brideName}
                onChange={handleInputChange}
                required={isWeddingType}
              />
            </div>
          </FormSection>

          {/* Family Details */}
          <FormSection title="👨‍👩‍👧 Family Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label={isWeddingType ? "Groom's Father Name" : "Father's Name"} name="groomFatherName" value={formData.groomFatherName} onChange={handleInputChange} />
              <Input label={isWeddingType ? "Groom's Mother Name" : "Mother's Name"} name="groomMotherName" value={formData.groomMotherName} onChange={handleInputChange} />
              <Input label={isWeddingType ? "Groom's Address" : "Address"} name="groomAddress" value={formData.groomAddress} onChange={handleInputChange} className="md:col-span-2" />
              {isWeddingType && (
                <>
                  <Input label="Bride's Father Name" name="brideFatherName" value={formData.brideFatherName} onChange={handleInputChange} />
                  <Input label="Bride's Mother Name" name="brideMotherName" value={formData.brideMotherName} onChange={handleInputChange} />
                  <Input label="Bride's Address" name="brideAddress" value={formData.brideAddress} onChange={handleInputChange} className="md:col-span-2" />
                </>
              )}
            </div>
          </FormSection>

          {/* Main Ceremony */}
          <FormSection title={`💒 ${formData.mainCeremonyLabel || 'Main Ceremony'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Date *" name="weddingDate" type="date" value={formData.weddingDate} onChange={handleInputChange} required />
              <Input label="Time *" name="weddingTime" type="time" value={formData.weddingTime} onChange={handleInputChange} required />
              <Input label="Venue Name *" name="weddingVenue" value={formData.weddingVenue} onChange={handleInputChange} required />
              <Input label="Venue Address" name="weddingVenueAddress" value={formData.weddingVenueAddress} onChange={handleInputChange} />
              <Input label="Google Maps Link" name="googleMapsLink" value={formData.googleMapsLink} onChange={handleInputChange} placeholder="https://maps.google.com/..." className="md:col-span-2" />
            </div>
          </FormSection>

          {/* Secondary Ceremony */}
          <FormSection title={`🌼 ${formData.secondaryCeremonyLabel || 'Secondary Ceremony'} (Optional)`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Date" name="haladiDate" type="date" value={formData.haladiDate} onChange={handleInputChange} />
              <Input label="Time" name="haladiTime" type="time" value={formData.haladiTime} onChange={handleInputChange} />
              <Input label="Venue" name="haladiVenue" value={formData.haladiVenue} onChange={handleInputChange} className="md:col-span-2" />
            </div>
          </FormSection>

          {/* Reception */}
          <FormSection title={`🎉 ${formData.receptionLabel || 'Reception'} (Optional)`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Date" name="receptionDate" type="date" value={formData.receptionDate} onChange={handleInputChange} />
              <Input label="Time" name="receptionTime" type="time" value={formData.receptionTime} onChange={handleInputChange} />
              <Input label="Venue" name="receptionVenue" value={formData.receptionVenue} onChange={handleInputChange} className="md:col-span-2" />
            </div>
          </FormSection>

          {/* Main Photo */}
          <FormSection title="📸 Main Photo">
            <FileUpload
              onUpload={(file) => handleFileUpload(file, 'main')}
              preview={mainPhoto}
              onRemove={() => setMainPhoto('')}
              label="Click or drag to upload main photo"
            />
          </FormSection>

          {/* Photo Gallery */}
          <FormSection title="🖼️ Photo Gallery">
            <FileUpload
              onUpload={(file) => handleFileUpload(file, 'gallery')}
              multiple
              label="Click or drag to upload gallery photos (up to 20)"
            />
            {galleryPhotos.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {galleryPhotos.map((photo, index) => (
                  <div key={index} className="relative w-20 h-20">
                    <img src={photo} alt="" className="w-full h-full object-cover rounded border border-[#d4af37]/30" />
                    <button
                      type="button"
                      onClick={() => setGalleryPhotos(prev => prev.filter((_, i) => i !== index))}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 rounded-full text-white text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </FormSection>

          {/* QR Code */}
          <FormSection title="💝 Gift QR Code (PhonePe/UPI)">
            <Input label="QR Code Label" name="qrLabel" value={formData.qrLabel} onChange={handleInputChange} placeholder="e.g., Groom / Bride / Gift" />
            <FileUpload
              onUpload={(file) => handleFileUpload(file, 'qr')}
              preview={qrCodeImage}
              onRemove={() => setQrCodeImage('')}
              label="Click or drag to upload QR code image"
              className="mt-4"
            />
          </FormSection>

          {/* Background Music */}
          <FormSection title="🎵 Background Music (Optional)">
            <p className="text-[#a08060] text-sm mb-4">Add background music that plays when guests open your invitation</p>
            
            {/* Audio File Upload */}
            <div>
              <label className="block text-sm text-[#c9a86c] mb-2">Upload Audio File (MP3, up to 20MB)</label>
              <label className="block border-2 border-dashed border-[#d4af37]/40 rounded-xl p-6 text-center cursor-pointer hover:border-[#d4af37] hover:bg-[#d4af37]/5 transition-all">
                <div className="text-3xl mb-2">🎶</div>
                <p className="text-[#c9a86c] text-sm">Click to upload MP3 file</p>
                <p className="text-[#a08060] text-xs mt-1">Recommended: 30 seconds - 2 minutes of your favorite song</p>
                <input
                  type="file"
                  accept="audio/mp3,audio/mpeg,audio/wav,audio/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      if (file.size > 20 * 1024 * 1024) {
                        alert('File is too large. Maximum size is 20MB.')
                        return
                      }
                      handleFileUpload(file, 'audio')
                    }
                  }}
                  className="hidden"
                />
              </label>
              
              {audioUrl && (
                <div className="mt-4 p-4 bg-[#1a0a0a]/80 border border-[#d4af37]/30 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">🎵</span>
                    <span className="text-[#f5e6d3] text-sm flex-1 truncate">Audio uploaded successfully!</span>
                    <button
                      type="button"
                      onClick={() => setAudioUrl('')}
                      className="text-red-500 hover:text-red-400 text-lg"
                    >
                      ✕
                    </button>
                  </div>
                  {/* Audio Preview */}
                  <audio controls className="w-full h-10" style={{ filter: 'sepia(20%) saturate(70%) brightness(90%)' }}>
                    <source src={audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          </FormSection>

          {/* Schedule */}
          <FormSection title="📅 Event Day Schedule">
            {formData.schedule.map((item, index) => (
              <div key={index} className="flex gap-4 items-center mb-3">
                <input
                  type="time"
                  value={item.time}
                  onChange={(e) => updateScheduleItem(index, 'time', e.target.value)}
                  className="w-32 p-3 bg-[#1a0a0a]/80 border border-[#d4af37]/30 rounded-lg text-[#f5e6d3]"
                />
                <input
                  type="text"
                  value={item.event}
                  onChange={(e) => updateScheduleItem(index, 'event', e.target.value)}
                  placeholder="Event name"
                  className="flex-1 p-3 bg-[#1a0a0a]/80 border border-[#d4af37]/30 rounded-lg text-[#f5e6d3] placeholder-[#a08060]"
                />
                <button
                  type="button"
                  onClick={() => removeScheduleItem(index)}
                  className="p-2 bg-red-600 rounded text-white"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addScheduleItem}
              className="py-2 px-4 border border-[#d4af37] text-[#d4af37] rounded hover:bg-[#d4af37]/10 transition-colors"
            >
              + Add Event
            </button>
          </FormSection>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-[#d4af37] via-[#f5d67a] to-[#d4af37] 
              rounded-full font-serif text-lg font-semibold text-[#1a0a0a] uppercase tracking-wider
              shadow-lg hover:shadow-[#d4af37]/50 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : isEditMode ? '✨ Update Invitation ✨' : '✨ Generate Invitation ✨'}
          </button>
        </form>

        {/* Result Modal */}
        {result && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <motion.div
              className="bg-gradient-to-br from-[#2d1515] to-[#1a0a0a] border-2 border-[#d4af37] rounded-2xl p-8 max-w-md w-full text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <h2 className="font-script text-3xl text-[#d4af37] mb-4">🎊 Invitation Created!</h2>
              <p className="text-[#c9a86c] mb-4">Share this link with your guests:</p>
              
              <div className="p-4 bg-[#1a0a0a]/80 border border-[#d4af37]/30 rounded-lg text-[#d4af37] break-all mb-6">
                {window.location.origin}{result.url}
              </div>

              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={copyLink}
                  className="px-6 py-2 bg-[#d4af37] text-[#1a0a0a] rounded-full font-semibold"
                >
                  📋 Copy Link
                </button>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 border-2 border-[#d4af37] text-[#d4af37] rounded-full font-semibold"
                >
                  👁️ View
                </a>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-2 border-2 border-[#c9a86c] text-[#c9a86c] rounded-full font-semibold"
                >
                  Dashboard
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

// Reusable form components
function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      className="bg-[#2d1515]/80 border border-[#d4af37]/30 rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="font-serif text-xl text-[#d4af37] mb-6 pb-3 border-b border-[#d4af37]/30">
        {title}
      </h2>
      {children}
    </motion.div>
  )
}

function Input({ 
  label, 
  className = '', 
  ...props 
}: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label className="block text-sm text-[#c9a86c] mb-2">{label}</label>
      <input
        {...props}
        className="w-full p-3 bg-[#1a0a0a]/80 border border-[#d4af37]/30 rounded-lg 
          text-[#f5e6d3] placeholder-[#a08060] focus:outline-none focus:border-[#d4af37] transition-colors"
      />
    </div>
  )
}

function FileUpload({ 
  onUpload, 
  preview, 
  onRemove, 
  label, 
  multiple = false,
  className = '' 
}: { 
  onUpload: (file: File) => void;
  preview?: string;
  onRemove?: () => void;
  label: string;
  multiple?: boolean;
  className?: string;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach(file => onUpload(file))
    }
  }

  return (
    <div className={className}>
      <label className="block border-2 border-dashed border-[#d4af37]/40 rounded-xl p-8 text-center cursor-pointer hover:border-[#d4af37] hover:bg-[#d4af37]/5 transition-all">
        <div className="text-4xl mb-2">📷</div>
        <p className="text-[#c9a86c]">{label}</p>
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />
      </label>
      
      {preview && (
        <div className="mt-4 relative w-24 h-24">
          <img src={preview} alt="Preview" className="w-full h-full object-cover rounded border border-[#d4af37]/30" />
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  )
}
