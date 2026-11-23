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
  const contentRef = useRef<HTMLDivElement>(null)

  // Get custom labels with fallbacks
  const mainCeremonyLabel = data.mainCeremonyLabel || 'WEDDING CEREMONY'
  const secondaryCeremonyLabel = data.secondaryCeremonyLabel || 'HALADI CEREMONY'
  const receptionLabel = data.receptionLabel || 'RECEPTION'
  const isWeddingType = data.eventType === 'wedding' || !data.eventType

  // Auto-scroll
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

    return () => { clearInterval(interval); el.removeEventListener('wheel', pause); el.removeEventListener('touchstart', pause) }
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
    const [h, m] = t.split(':')
    const hr = parseInt(h)
    return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`
  }
  const getDay = (d: string) => new Date(d).getDate()
  const getMonth = (d: string) => new Date(d).toLocaleString('en', { month: 'long' }).toUpperCase()
  const getYear = (d: string) => new Date(d).getFullYear()
  const getWeekday = (d: string) => new Date(d).toLocaleString('en', { weekday: 'long' }).toUpperCase()

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2a0a0a] via-[#1a0505] to-[#2a0a0a]">
      {/* Opening Screen */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'linear-gradient(135deg, #2a0a0a 0%, #1a0505 50%, #2a0a0a 100%)' }}
            exit={{ opacity: 0 }}
          >
            {/* Floating particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-[#d4af37] rounded-full"
                style={{ left: `${Math.random() * 100}%` }}
                animate={{ y: ['100vh', '-10vh'], opacity: [0, 1, 0] }}
                transition={{ duration: 8 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
              />
            ))}

            <motion.div
              className="relative w-full max-w-sm text-center p-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {/* Corner florals */}
              <FlowerCorner position="top-left" />
              <FlowerCorner position="top-right" />
              <FlowerCorner position="bottom-left" />
              <FlowerCorner position="bottom-right" />

              {/* Border */}
              <div className="absolute inset-4 border border-[#d4af37]/40 rounded-lg" />

              <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <span className="text-4xl">{isWeddingType ? '❤️' : '🎊'}</span>
              </motion.div>

              <h1 className="font-script text-5xl text-[#d4af37] mt-4">{data.groomName}</h1>
              {data.brideName && (
                <>
                  <p className="font-script text-2xl text-[#c9a86c] my-2">&</p>
                  <h1 className="font-script text-5xl text-[#d4af37]">{data.brideName}</h1>
                </>
              )}

              <Divider />

              <p className="font-serif text-[#c9a86c] tracking-widest text-sm mt-4">{formatDate(data.weddingDate)}</p>
              <p className="font-serif text-[#f5e6d3] mt-2">Cordially Invites You</p>

              <motion.button
                className="mt-6 px-10 py-3 bg-gradient-to-r from-[#d4af37] to-[#b8960c] rounded-full font-serif text-[#1a0505] font-semibold tracking-wider"
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpened(true)}
              >
                Open
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div ref={contentRef} className={`h-screen overflow-y-auto ${isOpened ? '' : 'invisible'}`}>
        {/* Save The Date */}
        <Section>
          <FlowerCorner position="top-left" />
          <FlowerCorner position="top-right" />
          <FlowerCorner position="bottom-left" />
          <FlowerCorner position="bottom-right" />

          <p className="font-serif text-[#d4af37] tracking-[0.3em] text-sm mb-6">SAVE THE DATE</p>
          
          {data.mainPhoto && (
            <div className="relative mx-auto w-48 mb-6">
              <div className="p-1 bg-gradient-to-br from-[#d4af37] to-[#b8960c] rounded">
                <img src={data.mainPhoto} alt="Couple" className="w-full aspect-[3/4] object-cover rounded" />
              </div>
            </div>
          )}

          <h2 className="font-script text-5xl text-[#d4af37]">{data.groomName}</h2>
          {data.brideName && (
            <>
              <p className="font-script text-2xl text-[#c9a86c] my-1">&</p>
              <h2 className="font-script text-5xl text-[#d4af37]">{data.brideName}</h2>
            </>
          )}
        </Section>

        {/* Main Ceremony (Wedding/Griha Pravesh/Birthday etc.) */}
        <Section>
          <FlowerCorner position="top-left" />
          <FlowerCorner position="top-right" />

          <Divider />
          <p className="font-serif text-[#d4af37] tracking-[0.2em] text-sm my-4">{mainCeremonyLabel}</p>

          <p className="font-serif text-xl text-[#f5e6d3] mb-2">{data.weddingVenue}</p>
          <p className="text-[#c9a86c] text-sm mb-4">
            {formatTime(data.weddingTime)} • {getWeekday(data.weddingDate)}
          </p>

          <DateBox day={getDay(data.weddingDate)} month={getMonth(data.weddingDate)} year={getYear(data.weddingDate)} />

          <FlowerCorner position="bottom-left" />
          <FlowerCorner position="bottom-right" />
        </Section>

        {/* Secondary Ceremony (Haladi/Pooja/Ring Ceremony etc.) */}
        {data.haladiDate && (
          <Section>
            <Divider />
            <p className="font-serif text-[#d4af37] tracking-[0.2em] text-sm my-4">{secondaryCeremonyLabel}</p>

            <p className="font-serif text-xl text-[#f5e6d3] mb-2">{data.haladiVenue}</p>
            <p className="text-[#c9a86c] text-sm mb-4">
              {formatTime(data.haladiTime || '08:30')} • {getWeekday(data.haladiDate)}
            </p>

            <DateBox day={getDay(data.haladiDate)} month={getMonth(data.haladiDate)} year={getYear(data.haladiDate)} />
          </Section>
        )}

        {/* Reception/Party */}
        {data.receptionDate && (
          <Section>
            <Divider />
            <p className="font-serif text-[#d4af37] tracking-[0.2em] text-sm my-4">{receptionLabel}</p>

            <p className="font-serif text-xl text-[#f5e6d3] mb-2">{data.receptionVenue}</p>
            <p className="text-[#c9a86c] text-sm mb-4">
              {formatTime(data.receptionTime || '19:00')} • {getWeekday(data.receptionDate)}
            </p>

            <DateBox day={getDay(data.receptionDate)} month={getMonth(data.receptionDate)} year={getYear(data.receptionDate)} />
          </Section>
        )}

        {/* Photo Gallery */}
        {data.galleryPhotos.length > 0 && (
          <Section>
            <FlowerCorner position="bottom-left" />
            <FlowerCorner position="bottom-right" />

            <div className="relative w-64 mx-auto">
              <div className="p-1 bg-gradient-to-br from-[#d4af37] to-[#b8960c] rounded">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentPhoto}
                    src={data.galleryPhotos[currentPhoto]}
                    alt="Gallery"
                    className="w-full aspect-square object-cover rounded"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                </AnimatePresence>
              </div>

              {/* Nav arrows */}
              <button
                onClick={() => setCurrentPhoto(p => (p - 1 + data.galleryPhotos.length) % data.galleryPhotos.length)}
                className="absolute left-[-40px] top-1/2 -translate-y-1/2 w-8 h-8 border border-[#d4af37] rounded-full text-[#d4af37] flex items-center justify-center"
              >
                ‹
              </button>
              <button
                onClick={() => setCurrentPhoto(p => (p + 1) % data.galleryPhotos.length)}
                className="absolute right-[-40px] top-1/2 -translate-y-1/2 w-8 h-8 border border-[#d4af37] rounded-full text-[#d4af37] flex items-center justify-center"
              >
                ›
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {data.galleryPhotos.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === currentPhoto ? 'bg-[#d4af37]' : 'bg-[#d4af37]/30'}`} />
              ))}
            </div>
            <p className="text-[#c9a86c] text-sm mt-2">{currentPhoto + 1} / {data.galleryPhotos.length}</p>
          </Section>
        )}

        {/* Countdown */}
        <Section>
          <p className="font-serif text-[#d4af37] tracking-[0.2em] text-sm mb-6">COUNTDOWN</p>
          <Countdown targetDate={data.weddingDate} targetTime={data.weddingTime} />
        </Section>

        {/* Map */}
        {data.googleMapsLink && (
          <Section>
            <Divider />
            <p className="font-serif text-[#d4af37] tracking-[0.2em] text-sm my-4">VENUE LOCATION</p>
            <p className="text-[#c9a86c] text-sm mb-4">{data.weddingVenueAddress || data.weddingVenue}</p>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(data.weddingVenueAddress || data.weddingVenue)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 border border-[#d4af37] rounded-full text-[#d4af37] font-serif text-sm"
            >
              📍 Get Directions
            </a>
          </Section>
        )}

        {/* Guestbook */}
        <Section>
          <Divider />
          <p className="font-serif text-[#d4af37] tracking-[0.2em] text-sm my-4">GUESTBOOK</p>
          <GuestbookForm entries={guestbookEntries} onSubmit={onGuestbookSubmit} />
        </Section>

        {/* Gift Box */}
        {data.qrCodeImage && (
          <Section>
            <Divider />
            <p className="font-serif text-[#d4af37] tracking-[0.2em] text-sm my-4">{isWeddingType ? 'WEDDING GIFT' : 'GIFT'}</p>
            
            <motion.div
              className="w-32 h-36 mx-auto cursor-pointer relative"
              onClick={() => setGiftOpen(true)}
              whileTap={{ scale: 0.95 }}
            >
              {/* Box */}
              <div className="absolute bottom-0 w-full h-24 bg-gradient-to-b from-[#8B0000] to-[#5a0000] rounded border-2 border-[#d4af37]">
                <div className="absolute left-1/2 -translate-x-1/2 w-6 h-full bg-[#d4af37]" />
                <div className="absolute top-1/2 -translate-y-1/2 w-full h-6 bg-[#d4af37]" />
              </div>
              {/* Lid */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[110%] h-8 bg-gradient-to-b from-[#8B0000] to-[#6a0000] rounded-t border-2 border-[#d4af37]">
                <div className="absolute left-1/2 -translate-x-1/2 w-6 h-full bg-[#d4af37]" />
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl">🎀</div>
              </div>
            </motion.div>
            <p className="text-[#c9a86c] text-sm mt-4">Tap to open</p>

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
                    className="bg-[#f5e6d3] rounded-xl p-6 max-w-xs w-full text-center relative"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    onClick={e => e.stopPropagation()}
                  >
                    <button onClick={() => setGiftOpen(false)} className="absolute top-2 right-2 text-[#8B0000] text-xl">✕</button>
                    <p className="font-serif text-2xl text-[#8B0000] mb-2">🎁 Gift Box</p>
                    <p className="text-[#5a0000] mb-4">{data.qrLabel || 'Scan to send gift'}</p>
                    <div className="bg-white p-3 rounded-lg inline-block">
                      <img src={data.qrCodeImage} alt="QR" className="w-40 h-40" />
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </Section>
        )}

        {/* Footer */}
        <footer className="py-8 text-center relative">
          <FlowerCorner position="bottom-left" />
          <FlowerCorner position="bottom-right" />
          <p className="font-script text-2xl text-[#d4af37]">
            {data.groomName}{data.brideName ? ` & ${data.brideName}` : ''}
          </p>
          <p className="text-[#c9a86c] text-sm mt-2">{formatDate(data.weddingDate)}</p>
          <p className="text-[#a08060] text-xs mt-4">Made with ❤️</p>
        </footer>
      </div>
    </div>
  )
}

// Components

function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative min-h-[80vh] py-12 px-6 flex flex-col items-center justify-center text-center">
      {children}
    </section>
  )
}

function FlowerCorner({ position }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  const pos = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0 -scale-x-100',
    'bottom-left': 'bottom-0 left-0 -scale-y-100',
    'bottom-right': 'bottom-0 right-0 scale-[-1]',
  }
  return (
    <div className={`absolute w-24 h-24 pointer-events-none ${pos[position]}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5d67a" />
            <stop offset="100%" stopColor="#b8960c" />
          </linearGradient>
        </defs>
        {/* Maroon flowers */}
        <circle cx="25" cy="25" r="15" fill="#8B0000" />
        <circle cx="25" cy="25" r="8" fill="#5a0000" />
        <circle cx="25" cy="25" r="4" fill="#d4af37" />
        {/* White flowers */}
        <circle cx="50" cy="15" r="8" fill="#f5e6d3" />
        <circle cx="50" cy="15" r="4" fill="#d4af37" />
        <circle cx="15" cy="50" r="8" fill="#f5e6d3" />
        <circle cx="15" cy="50" r="4" fill="#d4af37" />
        {/* Golden swirl */}
        <path d="M5,5 Q40,5 70,30 Q50,50 30,70 Q5,40 5,5" fill="none" stroke="url(#gold)" strokeWidth="1.5" />
        {/* Dots */}
        <circle cx="60" cy="40" r="3" fill="#d4af37" />
        <circle cx="40" cy="60" r="3" fill="#d4af37" />
      </svg>
    </div>
  )
}

function Divider() {
  return (
    <div className="w-32 h-6 mx-auto">
      <svg viewBox="0 0 120 24" className="w-full h-full">
        <path d="M0,12 Q30,2 60,12 Q90,22 120,12" fill="none" stroke="#d4af37" strokeWidth="1" />
        <path d="M0,12 Q30,22 60,12 Q90,2 120,12" fill="none" stroke="#d4af37" strokeWidth="1" />
        <circle cx="60" cy="12" r="4" fill="#8B0000" />
        <circle cx="60" cy="12" r="2" fill="#d4af37" />
      </svg>
    </div>
  )
}

function DateBox({ day, month, year }: { day: number; month: string; year: number }) {
  return (
    <div className="inline-flex items-center gap-3 border border-[#d4af37] rounded-lg px-5 py-3 bg-[#1a0505]/50">
      <span className="text-[#d4af37] text-2xl">(</span>
      <span className="font-serif text-4xl text-[#d4af37] font-bold">{day}</span>
      <div className="border-l border-[#d4af37] pl-3 text-left">
        <p className="font-serif text-lg text-[#d4af37]">{month}</p>
        <p className="text-[#c9a86c] text-sm">{year}</p>
      </div>
      <span className="text-[#d4af37] text-2xl">)</span>
    </div>
  )
}

function Countdown({ targetDate, targetTime }: { targetDate: string; targetTime: string }) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 })

  useEffect(() => {
    const target = new Date(`${targetDate}T${targetTime}`)
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
      {[['d', 'Days'], ['h', 'Hrs'], ['m', 'Min'], ['s', 'Sec']].map(([k, l]) => (
        <div key={k} className="text-center">
          <div className="w-14 h-16 bg-[#1a0505] border border-[#d4af37]/50 rounded flex items-center justify-center">
            <span className="font-serif text-2xl text-[#d4af37]">{String(time[k as keyof typeof time]).padStart(2, '0')}</span>
          </div>
          <p className="text-[#c9a86c] text-xs mt-1">{l}</p>
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
    if (!name || !wishes) return
    setLoading(true)
    await onSubmit(name, wishes)
    setName('')
    setWishes('')
    setLoading(false)
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <form onSubmit={submit} className="space-y-3">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your Name"
          className="w-full p-3 bg-[#1a0505]/80 border border-[#d4af37]/30 rounded text-[#f5e6d3] placeholder-[#a08060] text-sm"
        />
        <textarea
          value={wishes}
          onChange={e => setWishes(e.target.value)}
          placeholder="Your Wishes"
          rows={3}
          className="w-full p-3 bg-[#1a0505]/80 border border-[#d4af37]/30 rounded text-[#f5e6d3] placeholder-[#a08060] text-sm resize-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-gradient-to-r from-[#d4af37] to-[#b8960c] rounded text-[#1a0505] font-serif text-sm"
        >
          {loading ? 'Sending...' : 'Send Wishes'}
        </button>
      </form>

      {entries.length > 0 && (
        <div className="mt-6 space-y-3 max-h-48 overflow-y-auto">
          {entries.map((e, i) => (
            <div key={i} className="bg-[#1a0505]/50 border border-[#d4af37]/20 rounded p-3 text-left">
              <p className="text-[#f5e6d3] text-sm italic">"{e.wishes}"</p>
              <p className="text-[#d4af37] text-xs mt-1">— {e.guest_name || e.guestName}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
