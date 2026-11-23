import { useState } from 'react'
import { motion } from 'framer-motion'

interface FormData {
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
  schedule: { time: string; event: string }[];
}

export default function CreatePage() {
  const [formData, setFormData] = useState<FormData>({
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
    schedule: [{ time: '09:00', event: '' }],
  })

  const [mainPhoto, setMainPhoto] = useState<string>('')
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([])
  const [qrCodeImage, setQrCodeImage] = useState<string>('')
  const [tempId] = useState<string>(`temp-${Date.now()}`)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ id: string; url: string } | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = async (
    file: File, 
    type: 'main' | 'gallery' | 'qr'
  ) => {
    const formDataObj = new FormData()
    formDataObj.append('image', file)

    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`/api/upload/${tempId}`, {
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
        else if (type === 'gallery') setGalleryPhotos(prev => [...prev, data.path])
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload image')
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
        schedule: formData.schedule.filter(s => s.time && s.event),
      }

      const token = localStorage.getItem('authToken')
      const response = await fetch('/api/invitation', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      
      if (data.success) {
        setResult({ id: data.id, url: data.url })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      alert('Failed to create invitation: ' + (error instanceof Error ? error.message : 'Unknown error'))
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a0a] via-[#2d1515] to-[#1a0a0a] py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-script text-4xl text-[#d4af37] mb-2">Create Your Invitation</h1>
          <p className="text-[#c9a86c]">Fill in the details to generate your wedding invitation</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Couple Details */}
          <FormSection title="💑 Couple Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Groom's Name *" 
                name="groomName" 
                value={formData.groomName}
                onChange={handleInputChange}
                required
              />
              <Input 
                label="Bride's Name *" 
                name="brideName" 
                value={formData.brideName}
                onChange={handleInputChange}
                required
              />
            </div>
          </FormSection>

          {/* Family Details */}
          <FormSection title="👨‍👩‍👧 Family Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Groom's Father Name" name="groomFatherName" value={formData.groomFatherName} onChange={handleInputChange} />
              <Input label="Groom's Mother Name" name="groomMotherName" value={formData.groomMotherName} onChange={handleInputChange} />
              <Input label="Groom's Address" name="groomAddress" value={formData.groomAddress} onChange={handleInputChange} className="md:col-span-2" />
              <Input label="Bride's Father Name" name="brideFatherName" value={formData.brideFatherName} onChange={handleInputChange} />
              <Input label="Bride's Mother Name" name="brideMotherName" value={formData.brideMotherName} onChange={handleInputChange} />
              <Input label="Bride's Address" name="brideAddress" value={formData.brideAddress} onChange={handleInputChange} className="md:col-span-2" />
            </div>
          </FormSection>

          {/* Wedding Ceremony */}
          <FormSection title="💒 Wedding Ceremony">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Wedding Date *" name="weddingDate" type="date" value={formData.weddingDate} onChange={handleInputChange} required />
              <Input label="Wedding Time *" name="weddingTime" type="time" value={formData.weddingTime} onChange={handleInputChange} required />
              <Input label="Venue Name *" name="weddingVenue" value={formData.weddingVenue} onChange={handleInputChange} required />
              <Input label="Venue Address" name="weddingVenueAddress" value={formData.weddingVenueAddress} onChange={handleInputChange} />
              <Input label="Google Maps Link" name="googleMapsLink" value={formData.googleMapsLink} onChange={handleInputChange} placeholder="https://maps.google.com/..." className="md:col-span-2" />
            </div>
          </FormSection>

          {/* Haladi Ceremony */}
          <FormSection title="🌼 Haladi Ceremony (Optional)">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Haladi Date" name="haladiDate" type="date" value={formData.haladiDate} onChange={handleInputChange} />
              <Input label="Haladi Time" name="haladiTime" type="time" value={formData.haladiTime} onChange={handleInputChange} />
              <Input label="Haladi Venue" name="haladiVenue" value={formData.haladiVenue} onChange={handleInputChange} className="md:col-span-2" />
            </div>
          </FormSection>

          {/* Reception */}
          <FormSection title="🎉 Reception (Optional)">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Reception Date" name="receptionDate" type="date" value={formData.receptionDate} onChange={handleInputChange} />
              <Input label="Reception Time" name="receptionTime" type="time" value={formData.receptionTime} onChange={handleInputChange} />
              <Input label="Reception Venue" name="receptionVenue" value={formData.receptionVenue} onChange={handleInputChange} className="md:col-span-2" />
            </div>
          </FormSection>

          {/* Main Photo */}
          <FormSection title="📸 Main Couple Photo">
            <FileUpload
              onUpload={(file) => handleFileUpload(file, 'main')}
              preview={mainPhoto}
              onRemove={() => setMainPhoto('')}
              label="Click or drag to upload main couple photo"
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

          {/* Schedule */}
          <FormSection title="📅 Wedding Day Schedule">
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
            {isSubmitting ? 'Creating...' : '✨ Generate Invitation ✨'}
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

              <div className="flex gap-4 justify-center">
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
