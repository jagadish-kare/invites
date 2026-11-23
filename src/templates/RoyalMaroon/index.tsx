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
  const [slideDirection, setSlideDirection] = useState(1)
  const [isMuted, setIsMuted] = useState(true)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const mainCeremonyLabel = data.mainCeremonyLabel || 'WEDDING CEREMONY'
  const secondaryCeremonyLabel = data.secondaryCeremonyLabel || 'HALADI CEREMONY'
  const receptionLabel = data.receptionLabel || 'RECEPTION'
  const isWeddingType = data.eventType === 'wedding' || !data.eventType

  // Audio handling
  useEffect(() => {
    if (data.audioUrl && audioRef.current) {
      audioRef.current.src = data.audioUrl
      audioRef.current.load()
      setAudioLoaded(true)
    }
  }, [data.audioUrl])

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(console.log)
        setIsMuted(false)
      } else {
        audioRef.current.pause()
        setIsMuted(true)
      }
    }
  }

  // Auto-scroll after opening - stops at end, pauses on interaction/input focus
  useEffect(() => {
    if (!isOpened || !contentRef.current) return
    let interval: NodeJS.Timeout | null = null
    let isPaused = false
    let isInputFocused = false
    let hasReachedEnd = false

    const startScroll = () => {
      if (interval) clearInterval(interval)
      interval = setInterval(() => {
        if (!isPaused && !isInputFocused && !hasReachedEnd && contentRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = contentRef.current
          // Check if reached the end (with small buffer)
          if (scrollTop + clientHeight >= scrollHeight - 5) {
            hasReachedEnd = true
            if (interval) clearInterval(interval)
          } else {
            contentRef.current.scrollBy({ top: 1 })
          }
        }
      }, 50)
    }

    const pause = () => { 
      isPaused = true 
      setTimeout(() => { isPaused = false }, 5000) // Resume after 5 seconds
    }
    
    const handleFocus = () => { 
      isInputFocused = true 
    }
    
    const handleBlur = () => { 
      isInputFocused = false 
    }

    const el = contentRef.current
    el.addEventListener('wheel', pause)
    el.addEventListener('touchstart', pause)
    
    // Listen for input focus/blur events
    const inputs = el.querySelectorAll('input, textarea')
    inputs.forEach(input => {
      input.addEventListener('focus', handleFocus)
      input.addEventListener('blur', handleBlur)
    })
    
    setTimeout(startScroll, 2000)

    return () => { 
      if (interval) clearInterval(interval)
      el?.removeEventListener('wheel', pause)
      el?.removeEventListener('touchstart', pause)
      inputs.forEach(input => {
        input.removeEventListener('focus', handleFocus)
        input.removeEventListener('blur', handleBlur)
      })
    }
  }, [isOpened])

  // Photo gallery auto-advance
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
    // Auto-play audio on open (muted first, user can unmute)
    if (audioRef.current && data.audioUrl) {
      audioRef.current.play().catch(() => {})
      setIsMuted(false)
    }
  }

  const nextPhoto = () => {
    setSlideDirection(1)
    setCurrentPhoto(p => (p + 1) % data.galleryPhotos.length)
  }

  const prevPhoto = () => {
    setSlideDirection(-1)
    setCurrentPhoto(p => (p - 1 + data.galleryPhotos.length) % data.galleryPhotos.length)
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  }

  return (
    <div className="min-h-screen bg-[#1a0505] overflow-hidden font-sans">
      {/* Hidden Audio Element */}
      {data.audioUrl && (
        <audio ref={audioRef} loop preload="auto">
          <source src={data.audioUrl} type="audio/mpeg" />
        </audio>
      )}

      {/* Audio Control Button - Fixed position */}
      {audioLoaded && isOpened && (
        <motion.button
          onClick={toggleAudio}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#8B0000] border-2 border-[#d4af37] flex items-center justify-center shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMuted ? (
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#d4af37]" fill="currentColor">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#d4af37]" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          )}
        </motion.button>
      )}

      {/* Opening Screen */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Rich textured background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#8B0000] via-[#5c0000] to-[#2a0000]">
              {/* Decorative pattern overlay */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
            </div>

            {/* Floating golden particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-[#d4af37] rounded-full"
                style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.5, 1]
                }}
                transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
              />
            ))}

            {/* Main Card */}
            <motion.div
              className="relative w-full max-w-sm"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {/* Card with golden border */}
              <div className="relative bg-gradient-to-b from-[#4a0000] via-[#3a0000] to-[#2a0000] rounded-lg overflow-hidden">
                {/* Top decorative border */}
                <div className="h-2 bg-gradient-to-r from-[#8B6914] via-[#d4af37] to-[#8B6914]" />
                
                {/* Inner golden frame */}
                <div className="m-3 border-2 border-[#d4af37]/60 rounded-sm p-6">
                  {/* Corner ornaments */}
                  <CornerOrnament position="top-left" />
                  <CornerOrnament position="top-right" />
                  <CornerOrnament position="bottom-left" />
                  <CornerOrnament position="bottom-right" />

                  <div className="text-center">
                    {/* Om/Ganesh Symbol */}
                    <motion.div
                      className="text-[#d4af37] text-4xl mb-3"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {isWeddingType ? '🙏' : '✨'}
                    </motion.div>

                    {/* Shubh Vivah / Invitation text */}
                    <p className="text-[#d4af37] text-xs tracking-[0.4em] font-medium mb-4">
                      {isWeddingType ? '॥ शुभ विवाह ॥' : 'YOU ARE CORDIALLY INVITED'}
                    </p>

                    {/* Main Photo */}
                    {data.mainPhoto && (
                      <div className="relative mx-auto w-36 h-44 mb-5">
                        <div className="absolute inset-0 bg-gradient-to-b from-[#d4af37]/20 to-transparent rounded-t-full" />
                        <div className="absolute inset-1 border-2 border-[#d4af37] rounded-t-full overflow-hidden bg-[#1a0505]">
                          <img 
                            src={data.mainPhoto} 
                            alt="Couple" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Decorative bottom */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-4">
                          <svg viewBox="0 0 80 16" className="w-full h-full">
                            <path d="M0,8 Q20,0 40,8 Q60,16 80,8" fill="none" stroke="#d4af37" strokeWidth="2"/>
                            <circle cx="40" cy="8" r="4" fill="#d4af37"/>
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* Names */}
                    <h1 className="font-serif text-3xl text-[#d4af37] font-semibold tracking-wide">{data.groomName}</h1>
                    {data.brideName && (
                      <>
                        <p className="text-[#d4af37]/80 text-2xl my-1 font-serif">&</p>
                        <h1 className="font-serif text-3xl text-[#d4af37] font-semibold tracking-wide">{data.brideName}</h1>
                      </>
                    )}

                    {/* Decorative divider */}
                    <div className="flex items-center justify-center gap-3 my-5">
                      <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#d4af37]" />
                      <div className="w-2 h-2 rotate-45 bg-[#d4af37]" />
                      <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#d4af37]" />
                    </div>

                    {/* Date */}
                    <p className="text-[#f0d9b5] text-sm tracking-widest">{formatDate(data.weddingDate)}</p>

                    {/* Open Button */}
                    <motion.button
                      onClick={handleOpen}
                      className="mt-6 px-10 py-3 bg-gradient-to-r from-[#8B6914] via-[#d4af37] to-[#8B6914] 
                        rounded-full text-[#2a0000] font-bold tracking-wider text-sm uppercase
                        shadow-lg shadow-[#d4af37]/30 relative overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10">Open Invitation</span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: [-200, 200] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.button>
                  </div>
                </div>

                {/* Bottom decorative border */}
                <div className="h-2 bg-gradient-to-r from-[#8B6914] via-[#d4af37] to-[#8B6914]" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Invitation Content */}
      {isOpened && (
        <div 
          ref={contentRef} 
          className="h-screen overflow-y-auto scroll-smooth"
        >
          {/* Background with texture */}
          <div 
            className="fixed inset-0 bg-gradient-to-b from-[#8B0000] via-[#5c0000] to-[#2a0000]"
            style={{ zIndex: -1 }}
          >
            <div 
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          {/* Content sections */}
          <div className="relative z-10 py-6 px-4 space-y-6 max-w-md mx-auto">
            {/* Save The Date Card */}
            <Card>
              <p className="text-[#d4af37] text-xs tracking-[0.3em] mb-4">SAVE THE DATE</p>
              
              {data.mainPhoto && (
                <div className="relative mx-auto w-48 h-56 mb-5 border-2 border-[#d4af37] rounded-t-full overflow-hidden bg-[#1a0505]">
                  <img src={data.mainPhoto} alt="Couple" className="w-full h-full object-cover" />
                </div>
              )}

              <h2 className="font-serif text-3xl text-[#d4af37]">{data.groomName}</h2>
              {data.brideName && (
                <>
                  <p className="text-[#d4af37]/80 text-xl my-1">&</p>
                  <h2 className="font-serif text-3xl text-[#d4af37]">{data.brideName}</h2>
                </>
              )}

              <Divider />
              <p className="text-[#f0d9b5] text-sm">{formatDate(data.weddingDate)}</p>
            </Card>

            {/* Main Ceremony */}
            <Card>
              <div className="text-3xl mb-2">🪔</div>
              <p className="text-[#d4af37] text-xs tracking-[0.2em] mb-4">{mainCeremonyLabel}</p>
              
              <DateBox 
                day={getDay(data.weddingDate)} 
                month={getMonth(data.weddingDate)} 
                year={getYear(data.weddingDate)} 
                weekday={getWeekday(data.weddingDate)}
              />

              <p className="text-[#f0d9b5] text-lg mt-4 font-medium">{data.weddingVenue}</p>
              {data.weddingVenueAddress && (
                <p className="text-[#c9a86c] text-sm mt-1">{data.weddingVenueAddress}</p>
              )}
              <p className="text-[#d4af37] text-sm mt-2 font-medium">{formatTime(data.weddingTime)}</p>
            </Card>

            {/* Secondary Ceremony */}
            {data.haladiDate && (
              <Card>
                <div className="text-3xl mb-2">🌸</div>
                <p className="text-[#d4af37] text-xs tracking-[0.2em] mb-4">{secondaryCeremonyLabel}</p>
                
                <DateBox 
                  day={getDay(data.haladiDate)} 
                  month={getMonth(data.haladiDate)} 
                  year={getYear(data.haladiDate)} 
                  weekday={getWeekday(data.haladiDate)}
                />

                <p className="text-[#f0d9b5] text-lg mt-4">{data.haladiVenue}</p>
                <p className="text-[#d4af37] text-sm mt-2">{formatTime(data.haladiTime || '')}</p>
              </Card>
            )}

            {/* Reception */}
            {data.receptionDate && (
              <Card>
                <div className="text-3xl mb-2">🎊</div>
                <p className="text-[#d4af37] text-xs tracking-[0.2em] mb-4">{receptionLabel}</p>
                
                <DateBox 
                  day={getDay(data.receptionDate)} 
                  month={getMonth(data.receptionDate)} 
                  year={getYear(data.receptionDate)} 
                  weekday={getWeekday(data.receptionDate)}
                />

                <p className="text-[#f0d9b5] text-lg mt-4">{data.receptionVenue}</p>
                <p className="text-[#d4af37] text-sm mt-2">{formatTime(data.receptionTime || '')}</p>
              </Card>
            )}

            {/* Photo Gallery */}
            {data.galleryPhotos.length > 0 && (
              <Card>
                <p className="text-[#d4af37] text-xs tracking-[0.2em] mb-4">MOMENTS</p>
                
                <div className="relative w-full aspect-[3/4] max-w-[280px] mx-auto">
                  {/* Navigation */}
                  <button 
                    onClick={prevPhoto}
                    className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-[#2a0000]/80 border border-[#d4af37]/50 rounded-full flex items-center justify-center text-[#d4af37] text-xl"
                  >
                    ‹
                  </button>
                  <button 
                    onClick={nextPhoto}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-[#2a0000]/80 border border-[#d4af37]/50 rounded-full flex items-center justify-center text-[#d4af37] text-xl"
                  >
                    ›
                  </button>

                  {/* Photo frame */}
                  <div className="absolute inset-0 border-4 border-[#d4af37] rounded-lg overflow-hidden bg-[#1a0505]">
                    <AnimatePresence initial={false} custom={slideDirection}>
                      <motion.div
                        key={currentPhoto}
                        className="absolute inset-0 flex items-center justify-center p-2"
                        custom={slideDirection}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                      >
                        <img
                          src={data.galleryPhotos[currentPhoto]}
                          alt={`Photo ${currentPhoto + 1}`}
                          className="max-w-full max-h-full object-contain rounded"
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-4">
                  {data.galleryPhotos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSlideDirection(i > currentPhoto ? 1 : -1)
                        setCurrentPhoto(i)
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === currentPhoto ? 'bg-[#d4af37] scale-125' : 'bg-[#d4af37]/30'
                      }`}
                    />
                  ))}
                </div>
              </Card>
            )}

            {/* Countdown */}
            <Card>
              <p className="text-[#d4af37] text-xs tracking-[0.2em] mb-6">COUNTING DOWN</p>
              <Countdown targetDate={data.weddingDate} targetTime={data.weddingTime} />
            </Card>

            {/* Location */}
            {data.googleMapsLink && (
              <Card>
                <div className="text-3xl mb-2">📍</div>
                <p className="text-[#d4af37] text-xs tracking-[0.2em] mb-4">VENUE</p>
                
                <p className="text-[#f0d9b5] text-sm mb-5">
                  {data.weddingVenueAddress || data.weddingVenue}
                </p>

                <a
                  href={data.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#8B6914] to-[#d4af37] 
                    rounded-full text-[#2a0000] text-sm font-semibold shadow-lg"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  Get Directions
                </a>
              </Card>
            )}

            {/* Guestbook */}
            <Card>
              <div className="text-3xl mb-2">💌</div>
              <p className="text-[#d4af37] text-xs tracking-[0.2em] mb-4">WISHES & BLESSINGS</p>
              <GuestbookForm entries={guestbookEntries} onSubmit={onGuestbookSubmit} />
            </Card>

            {/* Gift Box */}
            {data.qrCodeImage && (
              <Card>
                <p className="text-[#d4af37] text-xs tracking-[0.2em] mb-2">YOUR PRESENCE IS</p>
                <p className="text-[#f0d9b5] text-lg font-serif mb-4">Our Biggest Gift</p>
                
                <motion.div
                  className="w-24 h-28 mx-auto cursor-pointer"
                  onClick={() => setGiftOpen(true)}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-lg">
                    <defs>
                      <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B0000"/>
                        <stop offset="100%" stopColor="#5c0000"/>
                      </linearGradient>
                    </defs>
                    <rect x="10" y="40" width="80" height="70" fill="url(#boxGrad)" stroke="#d4af37" strokeWidth="3" rx="4"/>
                    <rect x="45" y="40" width="10" height="70" fill="#d4af37"/>
                    <rect x="5" y="30" width="90" height="15" fill="#6a0000" stroke="#d4af37" strokeWidth="3" rx="3"/>
                    <rect x="45" y="30" width="10" height="15" fill="#d4af37"/>
                    <ellipse cx="50" cy="22" rx="18" ry="10" fill="#d4af37"/>
                    <ellipse cx="32" cy="20" rx="12" ry="8" fill="#d4af37"/>
                    <ellipse cx="68" cy="20" rx="12" ry="8" fill="#d4af37"/>
                    <circle cx="50" cy="22" r="6" fill="#8B0000"/>
                  </svg>
                </motion.div>
                <p className="text-[#c9a86c] text-xs mt-3">Tap to open</p>

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
                        className="bg-gradient-to-b from-[#f8f0e3] to-[#e8dcc8] rounded-2xl p-6 max-w-xs w-full text-center relative shadow-2xl"
                        initial={{ scale: 0.8, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.8, y: 50 }}
                        onClick={e => e.stopPropagation()}
                      >
                        <button 
                          onClick={() => setGiftOpen(false)} 
                          className="absolute top-3 right-3 text-[#8B0000] text-2xl w-8 h-8"
                        >
                          ✕
                        </button>
                        <div className="text-4xl mb-2">🎁</div>
                        <p className="font-serif text-xl text-[#8B0000] mb-1">Blessings</p>
                        <p className="text-[#5a0000] text-sm mb-4">{data.qrLabel || 'Scan to send gift'}</p>
                        <div className="bg-white p-4 rounded-xl inline-block shadow-inner">
                          <img src={data.qrCodeImage} alt="QR Code" className="w-48 h-48 object-contain" />
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            )}

            {/* Footer */}
            <footer className="py-8 text-center">
              <Divider />
              <p className="font-serif text-2xl text-[#d4af37] mt-4">
                {data.groomName}{data.brideName ? ` & ${data.brideName}` : ''}
              </p>
              <p className="text-[#c9a86c] text-sm mt-2">{formatDate(data.weddingDate)}</p>
              <p className="text-[#5c3a3a] text-xs mt-6">Made with ❤️</p>
            </footer>
          </div>
        </div>
      )}
    </div>
  )
}

// ============ COMPONENTS ============

function Card({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="relative bg-gradient-to-b from-[#3a0000]/90 to-[#2a0000]/90 backdrop-blur-sm rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Top gold line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
      
      {/* Content */}
      <div className="p-6 text-center border-x-2 border-[#d4af37]/30">
        {children}
      </div>
      
      {/* Bottom gold line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
    </motion.div>
  )
}

function CornerOrnament({ position }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0 -scale-x-100',
    'bottom-left': 'bottom-0 left-0 -scale-y-100',
    'bottom-right': 'bottom-0 right-0 scale-[-1]'
  }

  return (
    <div className={`absolute w-10 h-10 ${positionClasses[position]}`}>
      <svg viewBox="0 0 40 40" className="w-full h-full text-[#d4af37]" fill="currentColor">
        <path d="M0,0 L0,15 Q0,0 15,0 Z" opacity="0.8"/>
        <path d="M0,0 Q8,8 0,20 M0,0 Q8,8 20,0" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
      </svg>
    </div>
  )
}

function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 my-4">
      <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#d4af37]" />
      <div className="w-2 h-2 rotate-45 bg-[#d4af37]" />
      <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#d4af37]" />
    </div>
  )
}

function DateBox({ day, month, year, weekday }: { day: number; month: string; year: number; weekday: string }) {
  return (
    <div className="inline-block border-2 border-[#d4af37] rounded-lg px-8 py-4 bg-[#1a0505]/60">
      <p className="text-[#d4af37]/80 text-xs tracking-wider mb-1">{weekday}</p>
      <p className="font-serif text-5xl text-[#d4af37] font-bold leading-none">{day}</p>
      <p className="text-[#f0d9b5] text-sm mt-1">{month} {year}</p>
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
          <div className="w-14 h-16 bg-[#1a0505] border-2 border-[#d4af37]/50 rounded-lg flex items-center justify-center">
            <span className="font-serif text-2xl text-[#d4af37] font-bold">
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
      console.error('Failed:', err)
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
          className="w-full p-3 bg-[#1a0505]/80 border border-[#d4af37]/30 rounded-lg text-[#f0d9b5] placeholder-[#8b7355] text-sm focus:outline-none focus:border-[#d4af37]"
        />
        <textarea
          value={wishes}
          onChange={e => setWishes(e.target.value)}
          placeholder="Your wishes..."
          rows={3}
          className="w-full p-3 bg-[#1a0505]/80 border border-[#d4af37]/30 rounded-lg text-[#f0d9b5] placeholder-[#8b7355] text-sm resize-none focus:outline-none focus:border-[#d4af37]"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-gradient-to-r from-[#8B6914] to-[#d4af37] rounded-lg text-[#2a0000] font-semibold text-sm disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Wishes'}
        </button>
      </form>

      {entries.length > 0 && (
        <div className="mt-6 space-y-3 max-h-48 overflow-y-auto">
          {entries.map((e, i) => (
            <div key={i} className="bg-[#1a0505]/50 border border-[#d4af37]/20 rounded-lg p-3 text-left">
              <p className="text-[#f0d9b5] text-sm italic">"{e.wishes}"</p>
              <p className="text-[#d4af37] text-xs mt-2">— {e.guest_name || e.guestName}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
