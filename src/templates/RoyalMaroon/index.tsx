import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { TemplateProps } from '../../types/invitation'

export default function RoyalMaroonTemplate({ 
  data, 
  onGuestbookSubmit, 
  guestbookEntries 
}: TemplateProps) {
  const [isOpened, setIsOpened] = useState(false)
  const [currentPhoto, setCurrentPhoto] = useState(0)
  const [giftOpen, setGiftOpen] = useState(false)
  const [slideDirection, setSlideDirection] = useState(1) // 1 = right, -1 = left
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

  // Photo gallery auto-advance with slide effect
  useEffect(() => {
    if (data.galleryPhotos.length <= 1) return
    const timer = setInterval(() => {
      setSlideDirection(1)
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
    setIsOpened(true)
  }

  const nextPhoto = () => {
    setSlideDirection(1)
    setCurrentPhoto(p => (p + 1) % data.galleryPhotos.length)
  }

  const prevPhoto = () => {
    setSlideDirection(-1)
    setCurrentPhoto(p => (p - 1 + data.galleryPhotos.length) % data.galleryPhotos.length)
  }

  // Slide animation variants - simple and reliable
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      position: 'absolute' as const
    }),
    center: {
      x: 0,
      opacity: 1,
      position: 'relative' as const
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      position: 'absolute' as const
    })
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
                    <div className="relative mx-auto w-32 h-40 mb-4">
                      <div className="absolute inset-0 border-2 border-[#d4af37] bg-[#2d0808]">
                        <img 
                          src={data.mainPhoto} 
                          alt="Couple" 
                          className="w-full h-full object-contain"
                        />
                      </div>
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

                  <GoldenDivider />

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
                  <div className="relative mx-auto w-44 h-56 mb-4 border-2 border-[#d4af37] bg-[#2d0808]">
                    <img 
                      src={data.mainPhoto} 
                      alt="Couple" 
                      className="w-full h-full object-contain"
                    />
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

          {/* Photo Gallery - Slide Left/Right Effect */}
          {data.galleryPhotos.length > 0 && (
            <Section>
              <OrnateFrame>
                <div className="text-center py-6 px-4">
                  <p className="text-[#d4af37] text-xs tracking-[0.2em] mb-4">PHOTO GALLERY</p>
                  
                  {/* Gallery with slide animation */}
                  <div className="relative w-72 h-96 mx-auto">
                    {/* Navigation arrows */}
                    <button 
                      onClick={prevPhoto}
                      className="absolute -left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-[#d4af37]/30 rounded-full flex items-center justify-center text-[#d4af37] text-2xl hover:bg-[#d4af37]/50 active:scale-95"
                    >
                      ‹
                    </button>
                    <button 
                      onClick={nextPhoto}
                      className="absolute -right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-[#d4af37]/30 rounded-full flex items-center justify-center text-[#d4af37] text-2xl hover:bg-[#d4af37]/50 active:scale-95"
                    >
                      ›
                    </button>

                    {/* Photo container with slide effect */}
                    <div className="relative w-full h-full border-2 border-[#d4af37] bg-[#1a0505] rounded overflow-hidden">
                      <AnimatePresence initial={false} custom={slideDirection}>
                        <motion.div
                          key={currentPhoto}
                          className="absolute inset-0 flex items-center justify-center"
                          custom={slideDirection}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{
                            x: { type: "tween", duration: 0.4, ease: "easeInOut" },
                            opacity: { duration: 0.3 }
                          }}
                        >
                          <img
                            src={data.galleryPhotos[currentPhoto]}
                            alt={`Gallery ${currentPhoto + 1}`}
                            className="max-w-full max-h-full object-contain"
                          />
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Dots indicator */}
                  <div className="flex justify-center gap-2 mt-4">
                    {data.galleryPhotos.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSlideDirection(i > currentPhoto ? 1 : -1)
                          setCurrentPhoto(i)
                        }}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          i === currentPhoto ? 'bg-[#d4af37] scale-125' : 'bg-[#d4af37]/30'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[#c9a86c] text-xs mt-2">{currentPhoto + 1} / {data.galleryPhotos.length}</p>
                </div>
              </OrnateFrame>
            </Section>
          )}

          {/* Countdown */}
          <Section>
            <OrnateFrame>
              <div className="text-center py-6 px-4">
                <p className="text-[#d4af37] text-xs tracking-[0.2em] mb-6">COUNTDOWN</p>
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
                    <svg viewBox="0 0 100 120" className="w-full h-full">
                      <rect x="10" y="40" width="80" height="70" fill="#8B0000" stroke="#d4af37" strokeWidth="2" rx="4"/>
                      <rect x="45" y="40" width="10" height="70" fill="#d4af37"/>
                      <rect x="10" y="70" width="80" height="10" fill="#d4af37"/>
                      <rect x="5" y="30" width="90" height="15" fill="#6a0000" stroke="#d4af37" strokeWidth="2" rx="2"/>
                      <rect x="45" y="30" width="10" height="15" fill="#d4af37"/>
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
                        <img src={data.qrCodeImage} alt="QR Code" className="w-44 h-44 object-contain" />
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
    <section className="py-4 px-3">
      {children}
    </section>
  )
}

// SVG-based ornate frame (no image dependency)
function OrnateFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto max-w-[380px]">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#3d0c0c] via-[#2d0808] to-[#3d0c0c] rounded-sm" />
      
      {/* Top ornate arch */}
      <div className="absolute -top-2 left-0 right-0 h-16 overflow-visible">
        <svg viewBox="0 0 400 70" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="goldGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B6914" />
              <stop offset="30%" stopColor="#d4af37" />
              <stop offset="50%" stopColor="#f5d67a" />
              <stop offset="70%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#8B6914" />
            </linearGradient>
          </defs>
          {/* Main arch */}
          <path d="M0,70 L0,50 Q0,20 50,15 L150,10 Q200,5 250,10 L350,15 Q400,20 400,50 L400,70" 
            fill="none" stroke="url(#goldGrad1)" strokeWidth="2"/>
          {/* Inner arch */}
          <path d="M20,70 L20,52 Q20,30 60,25 L160,18 Q200,14 240,18 L340,25 Q380,30 380,52 L380,70" 
            fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.5"/>
          {/* Center ornament */}
          <circle cx="200" cy="12" r="8" fill="#d4af37"/>
          <circle cx="200" cy="12" r="4" fill="#8B0000"/>
          {/* Side ornaments */}
          <circle cx="100" cy="20" r="4" fill="#d4af37" opacity="0.7"/>
          <circle cx="300" cy="20" r="4" fill="#d4af37" opacity="0.7"/>
          {/* Decorative swirls */}
          <path d="M60,40 Q80,30 100,35 Q120,40 100,50" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.6"/>
          <path d="M340,40 Q320,30 300,35 Q280,40 300,50" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.6"/>
        </svg>
      </div>

      {/* Left border with floral pattern */}
      <div className="absolute left-0 top-12 bottom-12 w-4">
        <svg viewBox="0 0 20 200" className="w-full h-full" preserveAspectRatio="none">
          <line x1="10" y1="0" x2="10" y2="200" stroke="#d4af37" strokeWidth="1.5"/>
          <circle cx="10" cy="30" r="4" fill="#d4af37" opacity="0.6"/>
          <circle cx="10" cy="100" r="4" fill="#d4af37" opacity="0.6"/>
          <circle cx="10" cy="170" r="4" fill="#d4af37" opacity="0.6"/>
        </svg>
      </div>

      {/* Right border with floral pattern */}
      <div className="absolute right-0 top-12 bottom-12 w-4">
        <svg viewBox="0 0 20 200" className="w-full h-full" preserveAspectRatio="none">
          <line x1="10" y1="0" x2="10" y2="200" stroke="#d4af37" strokeWidth="1.5"/>
          <circle cx="10" cy="30" r="4" fill="#d4af37" opacity="0.6"/>
          <circle cx="10" cy="100" r="4" fill="#d4af37" opacity="0.6"/>
          <circle cx="10" cy="170" r="4" fill="#d4af37" opacity="0.6"/>
        </svg>
      </div>

      {/* Bottom ornate border */}
      <div className="absolute -bottom-2 left-0 right-0 h-12 overflow-visible">
        <svg viewBox="0 0 400 50" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <path d="M0,0 L0,20 Q0,45 50,48 L150,50 Q200,52 250,50 L350,48 Q400,45 400,20 L400,0" 
            fill="none" stroke="url(#goldGrad1)" strokeWidth="2"/>
          <circle cx="200" cy="45" r="6" fill="#d4af37"/>
          <circle cx="200" cy="45" r="3" fill="#8B0000"/>
          {/* Corner flourishes */}
          <path d="M30,10 Q50,25 70,15" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.6"/>
          <path d="M370,10 Q350,25 330,15" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.6"/>
        </svg>
      </div>

      {/* Corner decorations */}
      <CornerFloral position="top-left" />
      <CornerFloral position="top-right" />
      <CornerFloral position="bottom-left" />
      <CornerFloral position="bottom-right" />

      {/* Content */}
      <div className="relative z-10 py-10 px-6">
        {children}
      </div>
    </div>
  )
}

function CornerFloral({ position }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  const positionClasses = {
    'top-left': 'top-8 left-0',
    'top-right': 'top-8 right-0 -scale-x-100',
    'bottom-left': 'bottom-8 left-0 -scale-y-100',
    'bottom-right': 'bottom-8 right-0 scale-[-1]'
  }

  return (
    <div className={`absolute w-16 h-16 pointer-events-none ${positionClasses[position]}`}>
      <svg viewBox="0 0 60 60" className="w-full h-full">
        {/* Lotus flower */}
        <ellipse cx="15" cy="15" rx="10" ry="6" fill="#d4af37" opacity="0.8" transform="rotate(-45 15 15)"/>
        <ellipse cx="20" cy="20" rx="8" ry="5" fill="#d4af37" opacity="0.6" transform="rotate(-30 20 20)"/>
        <ellipse cx="10" cy="20" rx="8" ry="5" fill="#d4af37" opacity="0.6" transform="rotate(-60 10 20)"/>
        <circle cx="15" cy="15" r="4" fill="#8B0000"/>
        {/* Swirl */}
        <path d="M25,25 Q40,10 50,25 Q55,35 45,45" fill="none" stroke="#d4af37" strokeWidth="1.5" opacity="0.7"/>
        {/* Dots */}
        <circle cx="35" cy="20" r="2" fill="#d4af37" opacity="0.5"/>
        <circle cx="45" cy="35" r="2" fill="#d4af37" opacity="0.5"/>
      </svg>
    </div>
  )
}

function GoldenDivider() {
  return (
    <div className="flex items-center justify-center gap-2 my-4">
      <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#d4af37]" />
      <svg viewBox="0 0 24 24" className="w-5 h-5">
        <circle cx="12" cy="12" r="6" fill="none" stroke="#d4af37" strokeWidth="1"/>
        <circle cx="12" cy="12" r="3" fill="#d4af37"/>
      </svg>
      <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#d4af37]" />
    </div>
  )
}

function LanternIcon() {
  return (
    <svg viewBox="0 0 40 60" className="w-10 h-14 mx-auto">
      <line x1="20" y1="0" x2="20" y2="8" stroke="#d4af37" strokeWidth="1"/>
      <rect x="8" y="8" width="24" height="6" fill="#d4af37" rx="2"/>
      <rect x="10" y="14" width="20" height="35" fill="none" stroke="#d4af37" strokeWidth="2" rx="3"/>
      <ellipse cx="20" cy="31" rx="8" ry="12" fill="#d4af37" opacity="0.2"/>
      <rect x="8" y="49" width="24" height="6" fill="#d4af37" rx="2"/>
    </svg>
  )
}

function LotusIcon() {
  return (
    <svg viewBox="0 0 60 40" className="w-14 h-10 mx-auto">
      <ellipse cx="30" cy="30" rx="10" ry="15" fill="#d4af37" opacity="0.9"/>
      <ellipse cx="18" cy="28" rx="8" ry="12" fill="#d4af37" opacity="0.7" transform="rotate(-25 18 28)"/>
      <ellipse cx="42" cy="28" rx="8" ry="12" fill="#d4af37" opacity="0.7" transform="rotate(25 42 28)"/>
      <ellipse cx="8" cy="24" rx="6" ry="10" fill="#d4af37" opacity="0.5" transform="rotate(-45 8 24)"/>
      <ellipse cx="52" cy="24" rx="6" ry="10" fill="#d4af37" opacity="0.5" transform="rotate(45 52 24)"/>
      <circle cx="30" cy="32" r="4" fill="#8B0000"/>
    </svg>
  )
}

function DateBox({ day, month, year, weekday }: { day: number; month: string; year: number; weekday: string }) {
  return (
    <div className="inline-block border-2 border-[#d4af37] rounded-lg px-8 py-5 bg-[#2d0808]/60">
      <p className="text-[#d4af37] text-xs tracking-wider mb-1">{weekday}</p>
      <p className="font-serif text-5xl text-[#d4af37] font-bold">{day}</p>
      <p className="text-[#f5e6d3] text-sm mt-1">{month} {year}</p>
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
          <div className="w-14 h-16 bg-[#2d0808] border border-[#d4af37]/60 rounded-lg flex items-center justify-center">
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
