import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { TemplateProps } from '../../types/invitation'

// Import reusable components
import FloatingParticles from '../../components/ui/FloatingParticles'
import { FloralCorner, OrnateDivider } from '../../components/ui/FloralFrame'
import PhotoFrame from '../../components/ui/PhotoFrame'
import PhotoGallery from '../../components/ui/PhotoGallery'
import CountdownTimer from '../../components/ui/CountdownTimer'
import Calendar from '../../components/ui/Calendar'
import MapEmbed from '../../components/ui/MapEmbed'
import Schedule from '../../components/ui/Schedule'
import Guestbook from '../../components/ui/Guestbook'
import GiftBox from '../../components/ui/GiftBox'
import DateBox from '../../components/ui/DateBox'

export default function RoyalMaroonTemplate({ 
  data, 
  onGuestbookSubmit, 
  guestbookEntries 
}: TemplateProps) {
  const [isOpened, setIsOpened] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Auto-scroll functionality
  useEffect(() => {
    if (!isOpened || !contentRef.current) return

    let scrollInterval: NodeJS.Timeout
    let isPaused = false
    
    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (!isPaused && contentRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = contentRef.current
          
          // If reached bottom, scroll back to top slowly
          if (scrollTop + clientHeight >= scrollHeight - 10) {
            contentRef.current.scrollTo({ top: 0, behavior: 'smooth' })
          } else {
            contentRef.current.scrollBy({ top: 1, behavior: 'auto' })
          }
        }
      }, 50) // Slow scroll speed
    }

    // Pause on user interaction
    const handleInteraction = () => {
      isPaused = true
      setTimeout(() => { isPaused = false }, 5000) // Resume after 5 seconds
    }

    const content = contentRef.current
    content.addEventListener('wheel', handleInteraction)
    content.addEventListener('touchstart', handleInteraction)
    content.addEventListener('click', handleInteraction)

    // Start auto-scroll after a short delay
    const timeout = setTimeout(startAutoScroll, 2000)

    return () => {
      clearTimeout(timeout)
      clearInterval(scrollInterval)
      content.removeEventListener('wheel', handleInteraction)
      content.removeEventListener('touchstart', handleInteraction)
      content.removeEventListener('click', handleInteraction)
    }
  }, [isOpened])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-[#1a0a0a]">
      {/* Opening Screen */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#1a0a0a] via-[#2d1515] to-[#1a0a0a] overflow-hidden"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <FloatingParticles count={40} />
            
            {/* Envelope Card */}
            <motion.div
              className="relative w-[92%] max-w-md mx-4 bg-gradient-to-br from-[#3d1a1a] to-[#2a1010] 
                rounded-2xl p-10 md:p-14 text-center shadow-2xl"
              style={{
                boxShadow: '0 0 60px rgba(212, 175, 55, 0.2), 0 25px 50px rgba(0,0,0,0.5)'
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, y: [0, -10, 0] }}
              transition={{ 
                scale: { duration: 0.5 },
                y: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
              }}
            >
              {/* Inner golden border */}
              <div className="absolute inset-4 border-2 border-[#d4af37]/50 rounded-xl pointer-events-none" />
              <div className="absolute inset-6 border border-[#d4af37]/30 rounded-lg pointer-events-none" />
              
              {/* Floral corners */}
              <FloralCorner position="top-left" size="medium" />
              <FloralCorner position="top-right" size="medium" />
              <FloralCorner position="bottom-left" size="medium" />
              <FloralCorner position="bottom-right" size="medium" />

              {/* Heart icon */}
              <motion.div
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#f5e6d3] to-[#d4af37] 
                  rounded-full flex items-center justify-center text-4xl shadow-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ❤️
              </motion.div>

              {/* Couple names */}
              <h1 className="font-script text-5xl md:text-6xl text-[#d4af37] leading-tight drop-shadow-lg">
                {data.groomName}
              </h1>
              <span className="font-script text-3xl text-[#c9a86c] block my-3">&</span>
              <h1 className="font-script text-5xl md:text-6xl text-[#d4af37] leading-tight drop-shadow-lg">
                {data.brideName}
              </h1>

              <OrnateDivider className="my-6" />

              {/* Date */}
              <p className="font-serif text-xl text-[#c9a86c] tracking-widest">
                {formatDate(data.weddingDate)}
              </p>

              {/* Cordially invites */}
              <p className="font-serif text-lg text-[#f5e6d3] mt-4 tracking-wide">
                Cordially Invites You
              </p>

              {/* Open button */}
              <motion.button
                className="mt-8 px-12 py-4 bg-gradient-to-r from-[#f5e6d3] via-[#d4af37] to-[#f5e6d3] 
                  rounded-full font-serif font-semibold text-[#1a0a0a] uppercase tracking-wider text-lg
                  shadow-xl"
                style={{
                  boxShadow: '0 5px 30px rgba(212, 175, 55, 0.4)'
                }}
                whileHover={{ scale: 1.05, boxShadow: '0 8px 40px rgba(212, 175, 55, 0.6)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpened(true)}
              >
                Open Invitation
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div 
        ref={contentRef}
        className={`h-screen overflow-y-auto custom-scrollbar ${isOpened ? '' : 'invisible'}`}
      >
        <div className="bg-gradient-to-b from-[#2d1515] via-[#1a0a0a] to-[#2d1515]">
          
          {/* Section 1: Save The Date */}
          <section className="min-h-screen py-20 px-6 md:px-8 flex flex-col items-center justify-center relative">
            <FloralCorner position="top-left" />
            <FloralCorner position="top-right" />
            <FloralCorner position="bottom-left" />
            <FloralCorner position="bottom-right" />

            <motion.h2 
              className="font-serif text-2xl md:text-3xl text-[#d4af37] tracking-[0.4em] mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              SAVE THE DATE
            </motion.h2>

            <motion.div 
              className="w-full max-w-md px-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <PhotoFrame 
                src={data.mainPhoto || '/placeholder-couple.jpg'} 
                showFloralSides={true}
              />
            </motion.div>

            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="font-script text-6xl md:text-7xl text-[#d4af37] drop-shadow-lg">{data.groomName}</h2>
              <span className="font-script text-4xl text-[#c9a86c] block my-4">&</span>
              <h2 className="font-script text-6xl md:text-7xl text-[#d4af37] drop-shadow-lg">{data.brideName}</h2>
            </motion.div>

            <OrnateDivider className="mt-10" />
          </section>

          {/* Section 2: Wedding Invitation */}
          <section className="min-h-screen py-20 px-6 md:px-8 flex flex-col items-center justify-center relative">
            <FloralCorner position="top-left" />
            <FloralCorner position="top-right" />
            
            <OrnateDivider className="mb-8" />
            
            <motion.h2 
              className="font-serif text-2xl md:text-3xl text-[#d4af37] tracking-[0.4em] mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              WEDDING INVITATION
            </motion.h2>

            {/* Parents Info */}
            <motion.div 
              className="flex flex-wrap justify-center gap-16 md:gap-24 mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <p className="text-sm text-[#c9a86c] mb-2 tracking-widest">MR. & MRS.</p>
                <p className="font-serif text-xl md:text-2xl text-[#f5e6d3]">{data.groomFatherName}</p>
                <p className="font-serif text-xl md:text-2xl text-[#f5e6d3]">{data.groomMotherName}</p>
                <p className="text-sm text-[#a08060] mt-2 max-w-[200px]">{data.groomAddress}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-[#c9a86c] mb-2 tracking-widest">MR. & MRS.</p>
                <p className="font-serif text-xl md:text-2xl text-[#f5e6d3]">{data.brideFatherName}</p>
                <p className="font-serif text-xl md:text-2xl text-[#f5e6d3]">{data.brideMotherName}</p>
                <p className="text-sm text-[#a08060] mt-2 max-w-[200px]">{data.brideAddress}</p>
              </div>
            </motion.div>

            <motion.p 
              className="font-serif text-lg text-[#c9a86c] tracking-widest text-center mb-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              JOYFULLY ANNOUNCE<br />THE WEDDING OF THEIR BELOVED
            </motion.p>

            {/* Couple Names */}
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="font-script text-6xl md:text-7xl text-[#d4af37] drop-shadow-lg">{data.groomName}</h2>
              <p className="font-serif text-sm text-[#c9a86c] tracking-[0.4em] mt-2">GROOM</p>
              <span className="font-script text-5xl text-[#c9a86c] block my-4">&</span>
              <h2 className="font-script text-6xl md:text-7xl text-[#d4af37] drop-shadow-lg">{data.brideName}</h2>
              <p className="font-serif text-sm text-[#c9a86c] tracking-[0.4em] mt-2">BRIDE</p>
            </motion.div>

            {/* Wedding Event Card */}
            <motion.div 
              className="bg-gradient-to-br from-[#2d1515]/80 to-[#1a0a0a]/80 rounded-2xl p-8 md:p-10 max-w-lg w-full text-center relative"
              style={{
                boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset 0 0 60px rgba(212,175,55,0.05)'
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* Inner border */}
              <div className="absolute inset-3 border border-[#d4af37]/40 rounded-xl pointer-events-none" />
              
              <h3 className="font-serif text-xl text-[#d4af37] tracking-[0.3em] mb-4">
                WEDDING CEREMONY
              </h3>
              <p className="font-serif text-2xl text-[#f5e6d3] mb-6">{data.weddingVenue}</p>
              <DateBox date={data.weddingDate} time={data.weddingTime} />
            </motion.div>

            {/* Haladi Event */}
            {data.haladiDate && (
              <motion.div 
                className="bg-gradient-to-br from-[#2d1515]/80 to-[#1a0a0a]/80 rounded-2xl p-8 md:p-10 max-w-lg w-full text-center mt-8 relative"
                style={{
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset 0 0 60px rgba(212,175,55,0.05)'
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="absolute inset-3 border border-[#d4af37]/40 rounded-xl pointer-events-none" />
                
                <h3 className="font-serif text-xl text-[#d4af37] tracking-[0.3em] mb-4">
                  HALADI CEREMONY
                </h3>
                <p className="font-serif text-2xl text-[#f5e6d3] mb-6">{data.haladiVenue}</p>
                <DateBox date={data.haladiDate} time={data.haladiTime} />
              </motion.div>
            )}

            <FloralCorner position="bottom-left" />
            <FloralCorner position="bottom-right" />
          </section>

          {/* Section 3: Photo Gallery */}
          {data.galleryPhotos.length > 0 && (
            <section className="min-h-screen py-20 px-6 md:px-8 flex flex-col items-center justify-center relative">
              <FloralCorner position="top-left" />
              <FloralCorner position="top-right" />

              <OrnateDivider className="mb-8" />

              <motion.h2 
                className="font-serif text-2xl md:text-3xl text-[#d4af37] tracking-[0.4em] mb-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                PHOTO GALLERY
              </motion.h2>

              <PhotoGallery 
                photos={data.galleryPhotos} 
                autoPlayInterval={3000}
                className="w-full max-w-4xl"
              />

              <FloralCorner position="bottom-left" />
              <FloralCorner position="bottom-right" />
            </section>
          )}

          {/* Section 4: Reception & Countdown */}
          <section className="min-h-screen py-20 px-6 md:px-8 flex flex-col items-center justify-center relative">
            <FloralCorner position="top-left" />
            <FloralCorner position="top-right" />

            <OrnateDivider className="mb-8" />

            <motion.h2 
              className="font-serif text-2xl md:text-3xl text-[#d4af37] tracking-[0.4em] mb-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              RECEPTION INFO
            </motion.h2>

            {data.receptionDate && (
              <motion.div 
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="font-serif text-xl text-[#c9a86c] mb-6 tracking-wide">
                  THE RECEPTION WILL TAKE PLACE AT:
                </p>
                <DateBox date={data.receptionDate} time={data.receptionTime} />
              </motion.div>
            )}

            <motion.div
              className="mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <p className="font-serif text-xl text-[#c9a86c] tracking-[0.4em] text-center mb-8">
                COUNTDOWN
              </p>
              <CountdownTimer 
                targetDate={data.weddingDate} 
                targetTime={data.weddingTime}
              />
            </motion.div>

            <Calendar targetDate={data.weddingDate} />

            <FloralCorner position="bottom-left" />
            <FloralCorner position="bottom-right" />
          </section>

          {/* Section 5: Map & Schedule */}
          <section className="py-20 px-6 md:px-8 relative">
            <FloralCorner position="top-left" />
            <FloralCorner position="top-right" />

            {/* Add to Calendar */}
            <div className="text-center mb-10">
              <motion.a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Wedding of ${data.groomName} & ${data.brideName}`)}&dates=${data.weddingDate.replace(/-/g, '')}/${data.weddingDate.replace(/-/g, '')}&location=${encodeURIComponent(data.weddingVenueAddress || data.weddingVenue)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block py-3 px-8 border-2 border-[#d4af37] rounded-full text-[#d4af37] font-serif text-lg hover:bg-[#d4af37]/10 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📅 Add to Calendar
              </motion.a>
            </div>

            <OrnateDivider className="mb-8" />

            <motion.h2 
              className="font-serif text-2xl md:text-3xl text-[#d4af37] tracking-[0.4em] text-center mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              VENUE LOCATION
            </motion.h2>
            
            <p className="text-center text-[#c9a86c] text-lg mb-8 max-w-md mx-auto">
              {data.weddingVenueAddress || data.weddingVenue}
            </p>

            {data.googleMapsLink && (
              <MapEmbed 
                googleMapsLink={data.googleMapsLink}
                venueName={data.weddingVenue}
                venueAddress={data.weddingVenueAddress}
                className="mb-16"
              />
            )}

            {/* Schedule */}
            {data.schedule.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <OrnateDivider className="mb-10" />
                <h2 className="font-serif text-2xl md:text-3xl text-[#d4af37] tracking-[0.4em] text-center mb-10">
                  WEDDING DAY SCHEDULE
                </h2>
                <Schedule items={data.schedule} />
              </motion.div>
            )}

            <FloralCorner position="bottom-left" />
            <FloralCorner position="bottom-right" />
          </section>

          {/* Section 6: Guestbook */}
          <section className="py-20 px-6 md:px-8 relative">
            <FloralCorner position="top-left" />
            <FloralCorner position="top-right" />

            <OrnateDivider className="mb-8" />

            <motion.h2 
              className="font-serif text-2xl md:text-3xl text-[#d4af37] tracking-[0.4em] text-center mb-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              GUESTBOOK
            </motion.h2>

            <motion.p
              className="font-serif text-lg text-[#c9a86c] text-center mb-8 max-w-md mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Leave your wishes and blessings for the happy couple
            </motion.p>

            <Guestbook 
              entries={guestbookEntries}
              onSubmit={onGuestbookSubmit}
            />

            <FloralCorner position="bottom-left" />
            <FloralCorner position="bottom-right" />
          </section>

          {/* Section 7: Gift Box */}
          {data.qrCodeImage && (
            <section className="py-20 px-6 md:px-8 relative">
              <FloralCorner position="top-left" />
              <FloralCorner position="top-right" />

              <OrnateDivider className="mb-8" />

              <motion.h2 
                className="font-serif text-2xl md:text-3xl text-[#d4af37] tracking-[0.4em] text-center mb-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                WEDDING GIFT
              </motion.h2>

              <GiftBox 
                qrCodeImage={data.qrCodeImage}
                qrLabel={data.qrLabel}
              />

              <motion.p 
                className="font-serif text-xl text-[#c9a86c] text-center mt-10 italic max-w-md mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                "Your presence at our wedding is the greatest gift of all"
              </motion.p>

              <FloralCorner position="bottom-left" />
              <FloralCorner position="bottom-right" />
            </section>
          )}

          {/* Footer */}
          <footer className="py-12 text-center border-t border-[#d4af37]/20 relative">
            <OrnateDivider className="mb-6" />
            
            <p className="font-script text-3xl text-[#d4af37] mb-2">
              {data.groomName} & {data.brideName}
            </p>
            <p className="font-serif text-[#c9a86c] tracking-widest mb-4">
              {formatDate(data.weddingDate)}
            </p>
            <p className="text-sm text-[#a08060]">Made with ❤️</p>
          </footer>
        </div>
      </div>
    </div>
  )
}
