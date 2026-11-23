import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { TemplateProps } from '../../types/invitation'
import frameImage from '../../assets/frame-reference.png'

export default function RoyalMaroonTemplate({ 
  data, 
  onGuestbookSubmit, 
  guestbookEntries 
}: TemplateProps) {
  const [isOpened, setIsOpened] = useState(false)
  const [currentPhoto, setCurrentPhoto] = useState(0)
  const [giftOpen, setGiftOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Get custom labels with fallbacks
  const mainCeremonyLabel = data.mainCeremonyLabel || 'WEDDING CEREMONY'
  const secondaryCeremonyLabel = data.secondaryCeremonyLabel || 'HALADI CEREMONY'
  const receptionLabel = data.receptionLabel || 'RECEPTION'
  const isWeddingType = data.eventType === 'wedding' || !data.eventType

  // Auto-scroll after opening
  useEffect(() => {
    if (!isOpened || !contentRef.current) return
    let interval: NodeJS.Timeout
    let paused = false

    const startScroll = () => {
      interval = setInterval(() => {
        if (!paused && contentRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = contentRef.current
          if (scrollTop + clientHeight >= scrollHeight - 10) {
            contentRef.current.scrollTo({ top: 0, behavior: 'smooth' })
          } else {
            contentRef.current.scrollBy({ top: 1 })
          }
        }
      }, 50)
    }

    const pause = () => { paused = true; setTimeout(() => paused = false, 5000) }
    const el = contentRef.current
    el.addEventListener('wheel', pause)
    el.addEventListener('touchstart', pause)
    setTimeout(startScroll, 2000)

    return () => { clearInterval(interval); el?.removeEventListener('wheel', pause); el?.removeEventListener('touchstart', pause) }
  }, [isOpened])

  // Photo gallery auto-advance
  useEffect(() => {
    if (data.galleryPhotos.length <= 1) return
    const timer = setInterval(() => {
      setCurrentPhoto(p => (p + 1) % data.galleryPhotos.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [data.galleryPhotos.length])

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const formatTime = (t: string) => {
    if (!t) return ''
    const [h, m] = t.split(':')
    const hr = parseInt(h)
    return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`
  }
  const getDay = (d: string) => new Date(d).getDate()
  const getMonth = (d: string) => new Date(d).toLocaleString('en', { month: 'long' }).toUpperCase()
  const getYear = (d: string) => new Date(d).getFullYear()
  const getWeekday = (d: string) => new Date(d).toLocaleString('en', { weekday: 'long' })

  const handleOpen = () => {
    console.log('Opening invitation...')
    setIsOpened(true)
  }

  return (
    <div className="min-h-screen bg-[#4a0d0d] overflow-hidden">
      {/* Opening Screen */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Background with radial gradient */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at center, #6b1a1a 0%, #4a0d0d 40%, #2d0808 100%)'
              }}
            />

            {/* Golden particles */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-[#d4af37] rounded-full pointer-events-none"
                style={{ 
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                animate={{ 
                  opacity: [0.2, 1, 0.2],
                  scale: [1, 1.5, 1]
                }}
                transition={{ 
                  duration: 2 + Math.random() * 2, 
                  repeat: Infinity, 
                  delay: Math.random() * 2 
                }}
              />
            ))}

            {/* Main Card */}
            <motion.div
              className="relative w-[92%] max-w-[380px] mx-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Ornate Frame */}
              <OrnateFrame>
                <div className="text-center py-8 px-4">
                  {/* Om Symbol */}
                  <motion.div 
                    className="text-[#d4af37] text-3xl mb-2"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ॐ
                  </motion.div>

                  {/* Shubh Vivah */}
                  <p className="text-[#d4af37] text-xs tracking-[0.3em] mb-4">
                    {isWeddingType ? 'SHUBH VIVAH' : 'CORDIALLY INVITES YOU'}
                  </p>

                  {/* Main Photo */}
                  {data.mainPhoto && (
                    <div className="relative mx-auto w-32 h-32 mb-4">
                      <div className="absolute inset-0 rounded-full border-2 border-[#d4af37] p-1">
                        <img 
                          src={data.mainPhoto} 
                          alt="Couple" 
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      {/* Decorative corners */}
                      <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-[#d4af37]" />
                      <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-[#d4af37]" />
                      <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-[#d4af37]" />
                      <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-[#d4af37]" />
                    </div>
                  )}

                  {/* Names */}
                  <h1 className="font-script text-4xl text-[#d4af37] leading-tight">{data.groomName}</h1>
                  {data.brideName && (
                    <>
                      <p className="text-[#d4af37] text-xl my-1">&</p>
                      <h1 className="font-script text-4xl text-[#d4af37] leading-tight">{data.brideName}</h1>
                    </>
                  )}

                  {/* Decorative Line */}
                  <GoldenDivider />

                  {/* Date */}
                  <p className="text-[#f5e6d3] text-sm tracking-wider mt-4">{formatDate(data.weddingDate)}</p>

                  {/* Open Button */}
                  <motion.button
                    className="mt-6 px-8 py-3 bg-gradient-to-r from-[#d4af37] via-[#f5d67a] to-[#d4af37] 
                      rounded-full text-[#4a0d0d] font-semibold tracking-wider text-sm
                      shadow-lg shadow-[#d4af37]/30 relative z-20"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleOpen}
                    type="button"
                  >
                    Open Invitation
                  </motion.button>
                </div>
              </OrnateFrame>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Invitation Content */}
      {isOpened && (
        <div 
          ref={contentRef} 
          className="h-screen overflow-y-auto scroll-smooth"
          style={{
            background: 'radial-gradient(ellipse at center, #6b1a1a 0%, #4a0d0d 40%, #2d0808 100%)'
          }}
        >
          {/* Save The Date Section */}
          <Section>
            <OrnateFrame>
              <div className="text-center py-6 px-4">
                <p className="text-[#d4af37] text-xs tracking-[0.3em] mb-4">SAVE THE DATE</p>
                
                {data.mainPhoto && (
                  <div className="relative mx-auto w-40 h-52 mb-4">
                    <div className="absolute inset-0 border-2 border-[#d4af37] rounded-lg overflow-hidden">
                      <img src={data.mainPhoto} alt="Couple" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}

                <h2 className="font-script text-4xl text-[#d4af37]">{data.groomName}</h2>
                {data.brideName && (
                  <>
                    <p className="text-[#d4af37] text-xl my-1">&</p>
                    <h2 className="font-script text-4xl text-[#d4af37]">{data.brideName}</h2>
                  </>
                )}

                <GoldenDivider />
                
                <p className="text-[#f5e6d3] text-sm mt-4">{formatDate(data.weddingDate)}</p>
              </div>
            </OrnateFrame>
          </Section>

          {/* Main Ceremony Section */}
          <Section>
            <OrnateFrame>
              <div className="text-center py-6 px-4">
                <LanternIcon />
                <p className="text-[#d4af37] text-xs tracking-[0.2em] mt-2 mb-4">{mainCeremonyLabel}</p>
                
                <DateBox 
                  day={getDay(data.weddingDate)} 
                  month={getMonth(data.weddingDate)} 
                  year={getYear(data.weddingDate)} 
                  weekday={getWeekday(data.weddingDate)}
                />

                <p className="text-[#f5e6d3] text-lg mt-4">{data.weddingVenue}</p>
                {data.weddingVenueAddress && (
                  <p className="text-[#c9a86c] text-sm mt-1">{data.weddingVenueAddress}</p>
                )}
                <p className="text-[#d4af37] text-sm mt-2">{formatTime(data.weddingTime)}</p>
              </div>
            </OrnateFrame>
          </Section>

          {/* Secondary Ceremony (Haladi) */}
          {data.haladiDate && (
            <Section>
              <OrnateFrame>
                <div className="text-center py-6 px-4">
                  <LotusIcon />
                  <p className="text-[#d4af37] text-xs tracking-[0.2em] mt-2 mb-4">{secondaryCeremonyLabel}</p>
                  
                  <DateBox 
                    day={getDay(data.haladiDate)} 
                    month={getMonth(data.haladiDate)} 
                    year={getYear(data.haladiDate)} 
                    weekday={getWeekday(data.haladiDate)}
                  />

                  <p className="text-[#f5e6d3] text-lg mt-4">{data.haladiVenue}</p>
                  <p className="text-[#d4af37] text-sm mt-2">{formatTime(data.haladiTime || '')}</p>
                </div>
              </OrnateFrame>
            </Section>
          )}

          {/* Reception */}
          {data.receptionDate && (
            <Section>
              <OrnateFrame>
                <div className="text-center py-6 px-4">
                  <p className="text-2xl mb-2">🎉</p>
                  <p className="text-[#d4af37] text-xs tracking-[0.2em] mb-4">{receptionLabel}</p>
                  
                  <DateBox 
                    day={getDay(data.receptionDate)} 
                    month={getMonth(data.receptionDate)} 
                    year={getYear(data.receptionDate)} 
                    weekday={getWeekday(data.receptionDate)}
                  />

                  <p className="text-[#f5e6d3] text-lg mt-4">{data.receptionVenue}</p>
                  <p className="text-[#d4af37] text-sm mt-2">{formatTime(data.receptionTime || '')}</p>
                </div>
              </OrnateFrame>
            </Section>
          )}

          {/* Photo Gallery */}
          {data.galleryPhotos.length > 0 && (
            <Section>
              <OrnateFrame>
                <div className="text-center py-6 px-4">
                  <p className="text-[#d4af37] text-xs tracking-[0.2em] mb-4">OUR MOMENTS</p>
                  
                  <div className="relative w-56 h-56 mx-auto">
                    <div className="absolute inset-0 border border-[#d4af37]/50 rounded-lg overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={currentPhoto}
                          src={data.galleryPhotos[currentPhoto]}
                          alt="Gallery"
                          className="w-full h-full object-cover"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                        />
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Dots */}
                  <div className="flex justify-center gap-2 mt-4">
                    {data.galleryPhotos.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPhoto(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === currentPhoto ? 'bg-[#d4af37] scale-125' : 'bg-[#d4af37]/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </OrnateFrame>
            </Section>
          )}

          {/* Countdown */}
          <Section>
            <OrnateFrame>
              <div className="text-center py-6 px-4">
                <p className="text-[#d4af37] text-xs tracking-[0.2em] mb-6">COUNTING DOWN</p>
                <Countdown targetDate={data.weddingDate} targetTime={data.weddingTime} />
              </div>
            </OrnateFrame>
          </Section>

          {/* Location */}
          {data.googleMapsLink && (
            <Section>
              <OrnateFrame>
                <div className="text-center py-6 px-4">
                  <p className="text-2xl mb-2">📍</p>
                  <p className="text-[#d4af37] text-xs tracking-[0.2em] mb-4">VENUE LOCATION</p>
                  
                  <p className="text-[#f5e6d3] text-sm mb-4">
                    {data.weddingVenueAddress || data.weddingVenue}
                  </p>

                  <a
                    href={data.googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-2 border border-[#d4af37] rounded-full text-[#d4af37] text-sm hover:bg-[#d4af37]/10 transition-colors"
                  >
                    Get Directions
                  </a>
                </div>
              </OrnateFrame>
            </Section>
          )}

          {/* Guestbook */}
          <Section>
            <OrnateFrame>
              <div className="text-center py-6 px-4">
                <p className="text-2xl mb-2">💌</p>
                <p className="text-[#d4af37] text-xs tracking-[0.2em] mb-4">WISHES & BLESSINGS</p>
                <GuestbookForm entries={guestbookEntries} onSubmit={onGuestbookSubmit} />
              </div>
            </OrnateFrame>
          </Section>

          {/* Gift Box */}
          {data.qrCodeImage && (
            <Section>
              <OrnateFrame>
                <div className="text-center py-6 px-4">
                  <p className="text-[#d4af37] text-xs tracking-[0.2em] mb-4">BLESS THE COUPLE</p>
                  
                  <motion.div
                    className="w-24 h-28 mx-auto cursor-pointer relative"
                    onClick={() => setGiftOpen(true)}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Gift Box SVG */}
                    <svg viewBox="0 0 100 120" className="w-full h-full">
                      {/* Box body */}
                      <rect x="10" y="40" width="80" height="70" fill="#8B0000" stroke="#d4af37" strokeWidth="2" rx="4"/>
                      {/* Ribbon vertical */}
                      <rect x="45" y="40" width="10" height="70" fill="#d4af37"/>
                      {/* Ribbon horizontal */}
                      <rect x="10" y="70" width="80" height="10" fill="#d4af37"/>
                      {/* Lid */}
                      <rect x="5" y="30" width="90" height="15" fill="#6a0000" stroke="#d4af37" strokeWidth="2" rx="2"/>
                      {/* Ribbon on lid */}
                      <rect x="45" y="30" width="10" height="15" fill="#d4af37"/>
                      {/* Bow */}
                      <ellipse cx="50" cy="25" rx="15" ry="8" fill="#d4af37"/>
                      <ellipse cx="35" cy="22" rx="10" ry="6" fill="#d4af37"/>
                      <ellipse cx="65" cy="22" rx="10" ry="6" fill="#d4af37"/>
                      <circle cx="50" cy="25" r="5" fill="#8B0000"/>
                    </svg>
                  </motion.div>
                  <p className="text-[#c9a86c] text-xs mt-2">Tap to open</p>
                </div>
              </OrnateFrame>

              {/* QR Modal */}
              <AnimatePresence>
                {giftOpen && (
                  <motion.div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setGiftOpen(false)}
                  >
                    <motion.div
                      className="bg-gradient-to-b from-[#f5e6d3] to-[#e8d5c4] rounded-2xl p-6 max-w-xs w-full text-center relative"
                      initial={{ scale: 0.8, y: 50 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.8, y: 50 }}
                      onClick={e => e.stopPropagation()}
                    >
                      <button 
                        onClick={() => setGiftOpen(false)} 
                        className="absolute top-3 right-3 text-[#8B0000] text-xl w-8 h-8"
                      >
                        ✕
                      </button>
                      <p className="text-3xl mb-2">🎁</p>
                      <p className="font-serif text-xl text-[#8B0000] mb-1">Gift Box</p>
                      <p className="text-[#5a0000] text-sm mb-4">{data.qrLabel || 'Scan to send gift'}</p>
                      <div className="bg-white p-4 rounded-xl inline-block shadow-lg">
                        <img src={data.qrCodeImage} alt="QR Code" className="w-44 h-44" />
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Section>
          )}

          {/* Footer */}
          <footer className="py-10 text-center">
            <GoldenDivider />
            <p className="font-script text-2xl text-[#d4af37] mt-4">
              {data.groomName}{data.brideName ? ` & ${data.brideName}` : ''}
            </p>
            <p className="text-[#c9a86c] text-sm mt-2">{formatDate(data.weddingDate)}</p>
            <p className="text-[#6b4423] text-xs mt-6">Made with ❤️</p>
          </footer>
        </div>
      )}
    </div>
  )
}

// ============ COMPONENTS ============

function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="py-6 px-4">
      {children}
    </section>
  )
}

function OrnateFrame({ children }: { children: React.ReactNode }) {
  return (
    <div 
      className="relative mx-auto max-w-[380px]"
      style={{
        backgroundImage: `url(${frameImage})`,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '50px 25px 40px 25px',
        minHeight: '320px',
      }}
    >
      {/* Content inside the frame */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

function GoldenDivider() {
  return (
    <div className="flex items-center justify-center gap-2 my-4">
      <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#d4af37]" />
      <svg viewBox="0 0 20 20" className="w-4 h-4">
        <circle cx="10" cy="10" r="4" fill="none" stroke="#d4af37" strokeWidth="1"/>
        <circle cx="10" cy="10" r="2" fill="#d4af37"/>
      </svg>
      <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#d4af37]" />
    </div>
  )
}

function LanternIcon() {
  return (
    <svg viewBox="0 0 40 60" className="w-8 h-12 mx-auto">
      <line x1="20" y1="0" x2="20" y2="10" stroke="#d4af37" strokeWidth="1"/>
      <rect x="8" y="10" width="24" height="8" fill="#d4af37" rx="2"/>
      <rect x="10" y="18" width="20" height="30" fill="none" stroke="#d4af37" strokeWidth="2" rx="3"/>
      <ellipse cx="20" cy="33" rx="6" ry="8" fill="#d4af37" opacity="0.3"/>
      <rect x="8" y="48" width="24" height="6" fill="#d4af37" rx="2"/>
    </svg>
  )
}

function LotusIcon() {
  return (
    <svg viewBox="0 0 60 40" className="w-12 h-8 mx-auto">
      <ellipse cx="30" cy="30" rx="8" ry="12" fill="#d4af37" opacity="0.8"/>
      <ellipse cx="20" cy="28" rx="6" ry="10" fill="#d4af37" opacity="0.6" transform="rotate(-20 20 28)"/>
      <ellipse cx="40" cy="28" rx="6" ry="10" fill="#d4af37" opacity="0.6" transform="rotate(20 40 28)"/>
      <ellipse cx="12" cy="25" rx="5" ry="8" fill="#d4af37" opacity="0.4" transform="rotate(-40 12 25)"/>
      <ellipse cx="48" cy="25" rx="5" ry="8" fill="#d4af37" opacity="0.4" transform="rotate(40 48 25)"/>
      <circle cx="30" cy="32" r="3" fill="#8B0000"/>
    </svg>
  )
}

function DateBox({ day, month, year, weekday }: { day: number; month: string; year: number; weekday: string }) {
  return (
    <div className="inline-block border border-[#d4af37] rounded-lg px-6 py-4 bg-[#2d0808]/50">
      <p className="text-[#d4af37] text-xs tracking-wider">{weekday}</p>
      <p className="font-serif text-5xl text-[#d4af37] font-bold my-1">{day}</p>
      <p className="text-[#f5e6d3] text-sm">{month} {year}</p>
    </div>
  )
}

function Countdown({ targetDate, targetTime }: { targetDate: string; targetTime: string }) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 })

  useEffect(() => {
    const target = new Date(`${targetDate}T${targetTime || '12:00'}`)
    const calc = () => {
      const diff = Math.max(0, target.getTime() - Date.now())
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const i = setInterval(calc, 1000)
    return () => clearInterval(i)
  }, [targetDate, targetTime])

  return (
    <div className="flex justify-center gap-3">
      {[
        { value: time.d, label: 'Days' },
        { value: time.h, label: 'Hours' },
        { value: time.m, label: 'Mins' },
        { value: time.s, label: 'Secs' },
      ].map((item, i) => (
        <div key={i} className="text-center">
          <div className="w-14 h-16 bg-[#2d0808] border border-[#d4af37]/50 rounded-lg flex items-center justify-center">
            <span className="font-serif text-2xl text-[#d4af37]">
              {String(item.value).padStart(2, '0')}
            </span>
          </div>
          <p className="text-[#c9a86c] text-[10px] mt-1">{item.label}</p>
        </div>
      ))}
    </div>
  )
}

function GuestbookForm({ entries, onSubmit }: { entries: any[]; onSubmit: (n: string, w: string) => Promise<void> }) {
  const [name, setName] = useState('')
  const [wishes, setWishes] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !wishes.trim()) return
    setLoading(true)
    try {
      await onSubmit(name, wishes)
      setName('')
      setWishes('')
    } catch (err) {
      console.error('Failed to submit:', err)
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <form onSubmit={submit} className="space-y-3">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your Name"
          className="w-full p-3 bg-[#2d0808]/80 border border-[#d4af37]/30 rounded-lg text-[#f5e6d3] placeholder-[#8b7355] text-sm focus:outline-none focus:border-[#d4af37]"
        />
        <textarea
          value={wishes}
          onChange={e => setWishes(e.target.value)}
          placeholder="Your Wishes & Blessings..."
          rows={3}
          className="w-full p-3 bg-[#2d0808]/80 border border-[#d4af37]/30 rounded-lg text-[#f5e6d3] placeholder-[#8b7355] text-sm resize-none focus:outline-none focus:border-[#d4af37]"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-gradient-to-r from-[#d4af37] to-[#b8960c] rounded-lg text-[#2d0808] font-semibold text-sm disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Wishes'}
        </button>
      </form>

      {entries.length > 0 && (
        <div className="mt-6 space-y-3 max-h-48 overflow-y-auto">
          {entries.map((e, i) => (
            <div key={i} className="bg-[#2d0808]/50 border border-[#d4af37]/20 rounded-lg p-3 text-left">
              <p className="text-[#f5e6d3] text-sm italic">"{e.wishes}"</p>
              <p className="text-[#d4af37] text-xs mt-2">— {e.guest_name || e.guestName}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
