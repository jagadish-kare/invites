import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { GuestbookEntry } from '../../types/invitation'

interface GuestbookProps {
  entries: GuestbookEntry[];
  onSubmit: (name: string, wishes: string) => Promise<void>;
  className?: string;
}

export default function Guestbook({ 
  entries, 
  onSubmit,
  className = '' 
}: GuestbookProps) {
  const [name, setName] = useState('')
  const [wishes, setWishes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !wishes.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit(name.trim(), wishes.trim())
      setName('')
      setWishes('')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error submitting guestbook entry:', error)
      alert('Failed to submit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={className}>
      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-[#d4af37] to-[#f5d67a] 
              text-[#1a0a0a] px-6 py-3 rounded-full font-serif shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            ✨ Thank you for your wishes! ✨
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <motion.form 
        onSubmit={handleSubmit} 
        className="max-w-lg mx-auto mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div 
          className="bg-gradient-to-br from-[#2d1515]/80 to-[#1a0a0a]/80 rounded-2xl p-6 md:p-8 relative"
          style={{
            boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset 0 0 60px rgba(212,175,55,0.05)'
          }}
        >
          {/* Inner border */}
          <div className="absolute inset-3 border border-[#d4af37]/30 rounded-xl pointer-events-none" />
          
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name *"
              required
              className="w-full p-4 mb-4 bg-[#1a0a0a]/60 border-2 border-[#d4af37]/30 rounded-xl 
                text-[#f5e6d3] placeholder-[#a08060] font-serif text-lg
                focus:outline-none focus:border-[#d4af37]/70 focus:bg-[#1a0a0a]/80
                transition-all"
            />
            <textarea
              value={wishes}
              onChange={(e) => setWishes(e.target.value)}
              placeholder="Your Wishes & Blessings *"
              required
              rows={4}
              className="w-full p-4 mb-6 bg-[#1a0a0a]/60 border-2 border-[#d4af37]/30 rounded-xl 
                text-[#f5e6d3] placeholder-[#a08060] font-serif text-lg
                focus:outline-none focus:border-[#d4af37]/70 focus:bg-[#1a0a0a]/80
                transition-all resize-none"
            />
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-8 bg-gradient-to-r from-[#d4af37] via-[#f5d67a] to-[#d4af37] 
                rounded-full text-[#1a0a0a] font-serif font-semibold uppercase tracking-wider text-lg
                disabled:opacity-50 relative overflow-hidden"
              whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(212,175,55,0.4)' }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    ⏳
                  </motion.span>
                  Sending...
                </span>
              ) : (
                '💝 Send Your Wishes'
              )}
            </motion.button>
          </div>
        </div>
      </motion.form>

      {/* Entries */}
      {entries.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="font-serif text-xl text-[#d4af37] text-center mb-6 tracking-wide">
            💌 Wishes from Loved Ones
          </h3>
          
          <div className="max-w-lg mx-auto space-y-4">
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-[#2d1515]/60 to-[#1a0a0a]/60 rounded-xl p-5 relative"
                style={{
                  boxShadow: '0 5px 20px rgba(0,0,0,0.2)'
                }}
              >
                {/* Quote decoration */}
                <span className="absolute top-2 left-3 text-4xl text-[#d4af37]/20 font-serif">"</span>
                
                <div className="pl-6">
                  <p className="text-[#f5e6d3] leading-relaxed mb-3 italic">
                    {entry.wishes}
                  </p>
                  
                  <div className="flex justify-between items-center border-t border-[#d4af37]/20 pt-3">
                    <span className="font-script text-xl text-[#d4af37]">
                      — {entry.guestName}
                    </span>
                    <span className="text-xs text-[#a08060]">
                      {new Date(entry.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
