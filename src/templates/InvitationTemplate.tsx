import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { TemplateProps } from '../types/invitation'
import { getTheme, ThemeColors } from './themes'

interface Props extends TemplateProps {
  themeId?: string;
}

export default function InvitationTemplate({ 
  data, 
  onGuestbookSubmit, 
  guestbookEntries,
  themeId = 'royal-maroon'
}: Props) {
  const [isOpened, setIsOpened] = useState(false)
  const [currentPhoto, setCurrentPhoto] = useState(0)
  const [giftOpen, setGiftOpen] = useState(false)
  const [slideDirection, setSlideDirection] = useState(1)
  const [isMuted, setIsMuted] = useState(true)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Get theme colors
  const theme = getTheme(themeId)
  const c = theme.colors

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
        audioRef.current.play().catch(err => {
          console.log('Audio play failed:', err)
        })
        setIsMuted(false)
      } else {
        audioRef.current.pause()
        setIsMuted(true)
      }
    }
  }

  // Try to play audio when user opens invitation (after user interaction)
  const handleOpen = () => {
    setIsOpened(true)
    // Try to play audio - browser may still block but worth trying after click
    if (audioRef.current && data.audioUrl) {
      audioRef.current.volume = 0.5 // Start at 50% volume
      audioRef.current.play()
        .then(() => setIsMuted(false))
        .catch(() => {
          // Browser blocked autoplay, user will need to click audio button
          setIsMuted(true)
        })
    }
  }

  // Auto-scroll - stops at end, pauses on input focus
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
      setTimeout(() => { isPaused = false }, 5000)
    }
    
    const handleFocus = () => { isInputFocused = true }
    const handleBlur = () => { isInputFocused = false }

    const el = contentRef.current
    el.addEventListener('wheel', pause)
    el.addEventListener('touchstart', pause)
    
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

  const nextPhoto = () => {
    setSlideDirection(1)
    setCurrentPhoto(p => (p + 1) % data.galleryPhotos.length)
  }

  const prevPhoto = () => {
    setSlideDirection(-1)
    setCurrentPhoto(p => (p - 1 + data.galleryPhotos.length) % data.galleryPhotos.length)
  }

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? '100%' : '-100%', opacity: 0 })
  }

  // Dynamic styles based on theme
  const bgGradient = `linear-gradient(to bottom, ${c.bgGradientFrom}, ${c.bgGradientVia}, ${c.bgGradientTo})`
  const buttonGradient = `linear-gradient(to right, ${c.primaryDark}, ${c.primary})`

  return (
    <div className="min-h-screen overflow-hidden font-sans" style={{ backgroundColor: c.bgDark }}>
      {/* Audio */}
      {data.audioUrl && (
        <audio ref={audioRef} loop preload="auto">
          <source src={data.audioUrl} type="audio/mpeg" />
        </audio>
      )}

      {/* Audio Control - more prominent when muted and audio is available */}
      {audioLoaded && isOpened && (
        <motion.button
          onClick={toggleAudio}
          className={`fixed bottom-6 right-6 z-50 rounded-full flex items-center justify-center shadow-lg ${
            isMuted ? 'w-auto px-4 py-3 gap-2' : 'w-12 h-12'
          }`}
          style={{ backgroundColor: c.bgLight, border: `2px solid ${c.primary}` }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" style={{ color: c.primary }} fill="currentColor">
            {isMuted ? (
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            ) : (
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            )}
          </svg>
          {isMuted && (
            <span className="text-xs font-medium" style={{ color: c.primary }}>Play Music</span>
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
            <div className="absolute inset-0" style={{ background: bgGradient }}>
              <div 
                className="absolute inset-0"
                style={{
                  opacity: theme.patternOpacity,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodeURIComponent(c.primary)}' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
            </div>

            {/* Particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: theme.particleColor, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                animate={{ y: [0, -30, 0], opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }}
                transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
              />
            ))}

            {/* Main Card */}
            <motion.div
              className="relative w-full max-w-sm"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative rounded-lg overflow-hidden" style={{ background: `linear-gradient(to bottom, ${c.bgLight}, ${c.bgMedium}, ${c.bgDark})` }}>
                <div className="h-2" style={{ background: `linear-gradient(to right, ${c.primaryDark}, ${c.primary}, ${c.primaryDark})` }} />
                
                <div className="m-3 rounded-sm p-6" style={{ border: `2px solid ${c.borderColor}60` }}>
                  <div className="text-center">
                    <motion.div
                      className="text-4xl mb-3"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {isWeddingType ? '🙏' : '✨'}
                    </motion.div>

                    <p className="text-xs tracking-[0.4em] font-medium mb-4" style={{ color: c.primary }}>
                      {isWeddingType ? '॥ शुभ विवाह ॥' : 'YOU ARE CORDIALLY INVITED'}
                    </p>

                    {data.mainPhoto && (
                      <div className="relative mx-auto w-36 h-44 mb-5">
                        <div className="absolute inset-1 rounded-t-full overflow-hidden" style={{ border: `2px solid ${c.primary}`, backgroundColor: c.bgDark }}>
                          <img src={data.mainPhoto} alt="Couple" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    )}

                    <h1 className="font-serif text-3xl font-semibold tracking-wide" style={{ color: c.primary }}>{data.groomName}</h1>
                    {data.brideName && (
                      <>
                        <p className="text-2xl my-1 font-serif" style={{ color: `${c.primary}80` }}>&</p>
                        <h1 className="font-serif text-3xl font-semibold tracking-wide" style={{ color: c.primary }}>{data.brideName}</h1>
                      </>
                    )}

                    <Divider color={c.primary} />

                    <p className="text-sm tracking-widest" style={{ color: c.textPrimary }}>{formatDate(data.weddingDate)}</p>

                    <motion.button
                      onClick={handleOpen}
                      className="mt-6 px-10 py-3 rounded-full font-bold tracking-wider text-sm uppercase shadow-lg relative overflow-hidden"
                      style={{ background: buttonGradient, color: c.buttonText }}
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

                <div className="h-2" style={{ background: `linear-gradient(to right, ${c.primaryDark}, ${c.primary}, ${c.primaryDark})` }} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      {isOpened && (
        <div ref={contentRef} className="h-screen overflow-y-auto scroll-smooth">
          <div className="fixed inset-0" style={{ background: bgGradient, zIndex: -1 }}>
            <div className="absolute inset-0" style={{ opacity: theme.patternOpacity, backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodeURIComponent(c.primary)}' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
          </div>

          <div className="relative z-10 py-6 px-4 space-y-6 max-w-md mx-auto">
            {/* Save The Date */}
            <Card colors={c}>
              <p className="text-xs tracking-[0.3em] mb-4" style={{ color: c.primary }}>SAVE THE DATE</p>
              
              {data.mainPhoto && (
                <div className="relative mx-auto w-48 h-56 mb-5 rounded-t-full overflow-hidden" style={{ border: `2px solid ${c.primary}`, backgroundColor: c.bgDark }}>
                  <img src={data.mainPhoto} alt="Couple" className="w-full h-full object-cover" />
                </div>
              )}

              <h2 className="font-serif text-3xl" style={{ color: c.primary }}>{data.groomName}</h2>
              {data.brideName && (
                <>
                  <p className="text-xl my-1" style={{ color: `${c.primary}80` }}>&</p>
                  <h2 className="font-serif text-3xl" style={{ color: c.primary }}>{data.brideName}</h2>
                </>
              )}

              <Divider color={c.primary} />
              <p className="text-sm" style={{ color: c.textPrimary }}>{formatDate(data.weddingDate)}</p>
            </Card>

            {/* Main Ceremony */}
            <Card colors={c}>
              <div className="text-3xl mb-2">🪔</div>
              <p className="text-xs tracking-[0.2em] mb-4" style={{ color: c.primary }}>{mainCeremonyLabel}</p>
              
              <DateBox 
                day={getDay(data.weddingDate)} 
                month={getMonth(data.weddingDate)} 
                year={getYear(data.weddingDate)} 
                weekday={getWeekday(data.weddingDate)}
                colors={c}
              />

              <p className="text-lg mt-4 font-medium" style={{ color: c.textPrimary }}>{data.weddingVenue}</p>
              {data.weddingVenueAddress && (
                <p className="text-sm mt-1" style={{ color: c.textSecondary }}>{data.weddingVenueAddress}</p>
              )}
              <p className="text-sm mt-2 font-medium" style={{ color: c.primary }}>{formatTime(data.weddingTime)}</p>
            </Card>

            {/* Secondary Ceremony */}
            {data.haladiDate && (
              <Card colors={c}>
                <div className="text-3xl mb-2">🌸</div>
                <p className="text-xs tracking-[0.2em] mb-4" style={{ color: c.primary }}>{secondaryCeremonyLabel}</p>
                
                <DateBox 
                  day={getDay(data.haladiDate)} 
                  month={getMonth(data.haladiDate)} 
                  year={getYear(data.haladiDate)} 
                  weekday={getWeekday(data.haladiDate)}
                  colors={c}
                />

                <p className="text-lg mt-4" style={{ color: c.textPrimary }}>{data.haladiVenue}</p>
                <p className="text-sm mt-2" style={{ color: c.primary }}>{formatTime(data.haladiTime || '')}</p>
              </Card>
            )}

            {/* Reception */}
            {data.receptionDate && (
              <Card colors={c}>
                <div className="text-3xl mb-2">🎊</div>
                <p className="text-xs tracking-[0.2em] mb-4" style={{ color: c.primary }}>{receptionLabel}</p>
                
                <DateBox 
                  day={getDay(data.receptionDate)} 
                  month={getMonth(data.receptionDate)} 
                  year={getYear(data.receptionDate)} 
                  weekday={getWeekday(data.receptionDate)}
                  colors={c}
                />

                <p className="text-lg mt-4" style={{ color: c.textPrimary }}>{data.receptionVenue}</p>
                <p className="text-sm mt-2" style={{ color: c.primary }}>{formatTime(data.receptionTime || '')}</p>
              </Card>
            )}

            {/* Photo Gallery */}
            {data.galleryPhotos.length > 0 && (
              <Card colors={c}>
                <p className="text-xs tracking-[0.2em] mb-4" style={{ color: c.primary }}>MOMENTS</p>
                
                <div className="relative w-full aspect-[3/4] max-w-[280px] mx-auto">
                  <button 
                    onClick={prevPhoto}
                    className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${c.bgDark}80`, border: `1px solid ${c.primary}50`, color: c.primary }}
                  >
                    ‹
                  </button>
                  <button 
                    onClick={nextPhoto}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${c.bgDark}80`, border: `1px solid ${c.primary}50`, color: c.primary }}
                  >
                    ›
                  </button>

                  <div className="absolute inset-0 rounded-lg overflow-hidden" style={{ border: `4px solid ${c.primary}`, backgroundColor: c.bgDark }}>
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

                <div className="flex justify-center gap-2 mt-4">
                  {data.galleryPhotos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSlideDirection(i > currentPhoto ? 1 : -1)
                        setCurrentPhoto(i)
                      }}
                      className="w-2 h-2 rounded-full transition-all"
                      style={{ backgroundColor: i === currentPhoto ? c.primary : `${c.primary}30`, transform: i === currentPhoto ? 'scale(1.25)' : 'scale(1)' }}
                    />
                  ))}
                </div>
              </Card>
            )}

            {/* Countdown */}
            <Card colors={c}>
              <p className="text-xs tracking-[0.2em] mb-6" style={{ color: c.primary }}>COUNTING DOWN</p>
              <Countdown targetDate={data.weddingDate} targetTime={data.weddingTime} colors={c} />
            </Card>

            {/* Location */}
            {data.googleMapsLink && (
              <Card colors={c}>
                <div className="text-3xl mb-2">📍</div>
                <p className="text-xs tracking-[0.2em] mb-4" style={{ color: c.primary }}>VENUE</p>
                
                <p className="text-sm mb-5" style={{ color: c.textPrimary }}>
                  {data.weddingVenueAddress || data.weddingVenue}
                </p>

                <a
                  href={data.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold shadow-lg"
                  style={{ background: buttonGradient, color: c.buttonText }}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  Get Directions
                </a>
              </Card>
            )}

            {/* Guestbook */}
            <Card colors={c}>
              <div className="text-3xl mb-2">💌</div>
              <p className="text-xs tracking-[0.2em] mb-4" style={{ color: c.primary }}>WISHES & BLESSINGS</p>
              <GuestbookForm entries={guestbookEntries} onSubmit={onGuestbookSubmit} colors={c} />
            </Card>

            {/* Gift Box */}
            {data.qrCodeImage && (
              <Card colors={c}>
                <p className="text-xs tracking-[0.2em] mb-2" style={{ color: c.primary }}>YOUR PRESENCE IS</p>
                <p className="text-lg font-serif mb-4" style={{ color: c.textPrimary }}>Our Biggest Gift</p>
                
                <motion.div
                  className="w-24 h-28 mx-auto cursor-pointer"
                  onClick={() => setGiftOpen(true)}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-lg">
                    <defs>
                      <linearGradient id={`boxGrad-${themeId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={c.bgLight}/>
                        <stop offset="100%" stopColor={c.bgMedium}/>
                      </linearGradient>
                    </defs>
                    <rect x="10" y="40" width="80" height="70" fill={`url(#boxGrad-${themeId})`} stroke={c.primary} strokeWidth="3" rx="4"/>
                    <rect x="45" y="40" width="10" height="70" fill={c.primary}/>
                    <rect x="5" y="30" width="90" height="15" fill={c.bgMedium} stroke={c.primary} strokeWidth="3" rx="3"/>
                    <rect x="45" y="30" width="10" height="15" fill={c.primary}/>
                    <ellipse cx="50" cy="22" rx="18" ry="10" fill={c.primary}/>
                    <ellipse cx="32" cy="20" rx="12" ry="8" fill={c.primary}/>
                    <ellipse cx="68" cy="20" rx="12" ry="8" fill={c.primary}/>
                    <circle cx="50" cy="22" r="6" fill={c.bgMedium}/>
                  </svg>
                </motion.div>
                <p className="text-xs mt-3" style={{ color: c.textSecondary }}>Tap to open</p>

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
                        className="rounded-2xl p-6 max-w-xs w-full text-center relative shadow-2xl"
                        style={{ background: `linear-gradient(to bottom, ${c.textPrimary}, ${c.textSecondary})` }}
                        initial={{ scale: 0.8, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.8, y: 50 }}
                        onClick={e => e.stopPropagation()}
                      >
                        <button 
                          onClick={() => setGiftOpen(false)} 
                          className="absolute top-3 right-3 text-2xl w-8 h-8"
                          style={{ color: c.bgMedium }}
                        >
                          ✕
                        </button>
                        <div className="text-4xl mb-2">🎁</div>
                        <p className="font-serif text-xl mb-1" style={{ color: c.bgMedium }}>Blessings</p>
                        <p className="text-sm mb-4" style={{ color: c.bgDark }}>{data.qrLabel || 'Scan to send gift'}</p>
                        <div className="bg-white p-4 rounded-xl inline-block shadow-inner mb-4">
                          <img src={data.qrCodeImage} alt="QR Code" className="w-48 h-48 object-contain" />
                        </div>
                        
                        {/* Save QR Button */}
                        <div>
                          <a
                            href={data.qrCodeImage}
                            download={`qr-code-${data.groomName || 'gift'}.png`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
                            style={{ 
                              backgroundColor: c.bgMedium, 
                              color: c.textPrimary,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              // For cross-origin images, we need to handle differently
                              const img = new Image()
                              img.crossOrigin = 'anonymous'
                              img.onload = () => {
                                const canvas = document.createElement('canvas')
                                canvas.width = img.width
                                canvas.height = img.height
                                const ctx = canvas.getContext('2d')
                                ctx?.drawImage(img, 0, 0)
                                const link = document.createElement('a')
                                link.download = `qr-code-${data.groomName || 'gift'}.png`
                                link.href = canvas.toDataURL('image/png')
                                link.click()
                              }
                              img.onerror = () => {
                                // Fallback: open in new tab
                                window.open(data.qrCodeImage, '_blank')
                              }
                              img.src = data.qrCodeImage
                              e.preventDefault()
                            }}
                          >
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                            </svg>
                            Save QR Code
                          </a>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            )}

            {/* Footer */}
            <footer className="py-8 text-center">
              <Divider color={c.primary} />
              <p className="font-serif text-2xl mt-4" style={{ color: c.primary }}>
                {data.groomName}{data.brideName ? ` & ${data.brideName}` : ''}
              </p>
              <p className="text-sm mt-2" style={{ color: c.textSecondary }}>{formatDate(data.weddingDate)}</p>
              <p className="text-xs mt-6" style={{ color: `${c.textSecondary}60` }}>Made with ❤️</p>
            </footer>
          </div>
        </div>
      )}
    </div>
  )
}

// ============ COMPONENTS ============

function Card({ children, colors: c }: { children: React.ReactNode; colors: ThemeColors }) {
  return (
    <motion.div
      className="relative rounded-lg overflow-hidden backdrop-blur-sm"
      style={{ background: `linear-gradient(to bottom, ${c.bgLight}e6, ${c.bgMedium}e6)` }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="h-1" style={{ background: `linear-gradient(to right, transparent, ${c.primary}, transparent)` }} />
      <div className="p-6 text-center" style={{ borderLeft: `2px solid ${c.primary}30`, borderRight: `2px solid ${c.primary}30` }}>
        {children}
      </div>
      <div className="h-1" style={{ background: `linear-gradient(to right, transparent, ${c.primary}, transparent)` }} />
    </motion.div>
  )
}

function Divider({ color }: { color: string }) {
  return (
    <div className="flex items-center justify-center gap-3 my-4">
      <div className="w-16 h-px" style={{ background: `linear-gradient(to right, transparent, ${color})` }} />
      <div className="w-2 h-2 rotate-45" style={{ backgroundColor: color }} />
      <div className="w-16 h-px" style={{ background: `linear-gradient(to left, transparent, ${color})` }} />
    </div>
  )
}

function DateBox({ day, month, year, weekday, colors: c }: { day: number; month: string; year: number; weekday: string; colors: ThemeColors }) {
  return (
    <div className="inline-block rounded-lg px-8 py-4" style={{ border: `2px solid ${c.primary}`, backgroundColor: `${c.bgDark}60` }}>
      <p className="text-xs tracking-wider mb-1" style={{ color: `${c.primary}80` }}>{weekday}</p>
      <p className="font-serif text-5xl font-bold leading-none" style={{ color: c.primary }}>{day}</p>
      <p className="text-sm mt-1" style={{ color: c.textPrimary }}>{month} {year}</p>
    </div>
  )
}

function Countdown({ targetDate, targetTime, colors: c }: { targetDate: string; targetTime: string; colors: ThemeColors }) {
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
          <div className="w-14 h-16 rounded-lg flex items-center justify-center" style={{ backgroundColor: c.bgDark, border: `2px solid ${c.primary}50` }}>
            <span className="font-serif text-2xl font-bold" style={{ color: c.primary }}>
              {String(item.value).padStart(2, '0')}
            </span>
          </div>
          <p className="text-[10px] mt-1" style={{ color: c.textSecondary }}>{item.label}</p>
        </div>
      ))}
    </div>
  )
}

function GuestbookForm({ entries, onSubmit, colors: c }: { entries: any[]; onSubmit: (n: string, w: string) => Promise<void>; colors: ThemeColors }) {
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

  const inputStyle = {
    backgroundColor: `${c.inputBg}80`,
    border: `1px solid ${c.inputBorder}`,
    color: c.textPrimary,
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <form onSubmit={submit} className="space-y-3">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your Name"
          className="w-full p-3 rounded-lg text-sm focus:outline-none"
          style={inputStyle}
        />
        <textarea
          value={wishes}
          onChange={e => setWishes(e.target.value)}
          placeholder="Your wishes..."
          rows={3}
          className="w-full p-3 rounded-lg text-sm resize-none focus:outline-none"
          style={inputStyle}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg font-semibold text-sm disabled:opacity-50"
          style={{ background: `linear-gradient(to right, ${c.primaryDark}, ${c.primary})`, color: c.buttonText }}
        >
          {loading ? 'Sending...' : 'Send Wishes'}
        </button>
      </form>

      {entries.length > 0 && (
        <div className="mt-6 space-y-3 max-h-48 overflow-y-auto">
          {entries.map((e, i) => (
            <div key={i} className="rounded-lg p-3 text-left" style={{ backgroundColor: `${c.bgDark}50`, border: `1px solid ${c.primary}20` }}>
              <p className="text-sm italic" style={{ color: c.textPrimary }}>"{e.wishes}"</p>
              <p className="text-xs mt-2" style={{ color: c.primary }}>— {e.guest_name || e.guestName}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
