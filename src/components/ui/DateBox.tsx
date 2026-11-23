import { motion } from 'framer-motion'

interface DateBoxProps {
  date: string;
  time?: string;
  className?: string;
}

export default function DateBox({ date, time, className = '' }: DateBoxProps) {
  const dateObj = new Date(date)
  const day = dateObj.getDate()
  const month = dateObj.toLocaleString('en', { month: 'long' }).toUpperCase()
  const year = dateObj.getFullYear()
  const weekday = dateObj.toLocaleString('en', { weekday: 'long' }).toUpperCase()

  const formatTime = (timeStr: string) => {
    const [hours, mins] = timeStr.split(':')
    const h = parseInt(hours)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const hour12 = h % 12 || 12
    return `${hour12}:${mins} ${ampm}`
  }

  return (
    <motion.div 
      className={`text-center ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {time && (
        <p className="text-[#c9a86c] mb-4 font-serif text-lg tracking-wide">
          <span className="text-[#d4af37]">{formatTime(time)}</span>
          <span className="mx-4 text-[#d4af37]/50">•</span>
          <span>{weekday}</span>
        </p>
      )}
      
      <div 
        className="inline-flex items-center gap-4 md:gap-6 bg-gradient-to-br from-[#1a0a0a]/90 to-[#2d1515]/90 
          rounded-2xl px-6 md:px-8 py-5 md:py-6 relative"
        style={{
          boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset 0 0 60px rgba(212,175,55,0.05)'
        }}
      >
        {/* Border decorations */}
        <div className="absolute inset-0 border-2 border-[#d4af37]/50 rounded-2xl pointer-events-none" />
        <div className="absolute inset-2 border border-[#d4af37]/20 rounded-xl pointer-events-none" />
        
        {/* Decorative left flourish */}
        <svg className="w-6 h-16 text-[#d4af37]" viewBox="0 0 24 64">
          <path 
            d="M22,2 Q2,32 22,62" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="22" cy="2" r="2" fill="currentColor" />
          <circle cx="22" cy="62" r="2" fill="currentColor" />
        </svg>
        
        {/* Day number */}
        <div className="relative">
          <span className="font-serif text-6xl md:text-7xl text-[#d4af37] font-bold drop-shadow-lg">
            {day}
          </span>
        </div>
        
        {/* Month and year */}
        <div className="text-left border-l-2 border-[#d4af37]/50 pl-4 md:pl-6">
          <div className="font-serif text-2xl md:text-3xl text-[#d4af37] tracking-widest">
            {month}
          </div>
          <div className="text-[#c9a86c] text-lg tracking-widest">
            {year}
          </div>
        </div>
        
        {/* Decorative right flourish */}
        <svg className="w-6 h-16 text-[#d4af37]" viewBox="0 0 24 64">
          <path 
            d="M2,2 Q22,32 2,62" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="2" cy="2" r="2" fill="currentColor" />
          <circle cx="2" cy="62" r="2" fill="currentColor" />
        </svg>
      </div>
    </motion.div>
  )
}
