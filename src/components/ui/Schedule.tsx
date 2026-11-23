import { motion } from 'framer-motion'
import type { ScheduleItem } from '../../types/invitation'

interface ScheduleProps {
  items: ScheduleItem[];
  className?: string;
}

// Format time from 24h to 12h format
const formatTime = (time: string) => {
  const [hours, mins] = time.split(':')
  const h = parseInt(hours)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 || 12
  return `${hour12}:${mins} ${ampm}`
}

export default function Schedule({ items, className = '' }: ScheduleProps) {
  if (items.length === 0) return null

  return (
    <div className={`max-w-lg mx-auto ${className}`}>
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-[120px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#d4af37] via-[#d4af37]/50 to-[#d4af37] hidden md:block" />
        
        {items.map((item, index) => (
          <motion.div 
            key={index}
            className="flex items-center gap-6 mb-8 last:mb-0"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Time */}
            <div 
              className="min-w-[100px] text-right bg-gradient-to-r from-[#2d1515]/80 to-[#1a0a0a]/80 
                py-2 px-3 rounded-lg border border-[#d4af37]/30"
            >
              <span className="font-serif text-lg text-[#d4af37] font-semibold">
                {formatTime(item.time)}
              </span>
            </div>
            
            {/* Timeline dot */}
            <motion.div 
              className="relative flex-shrink-0 hidden md:block"
              whileInView={{ scale: [0, 1.2, 1] }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8960c] shadow-lg" />
              <div className="absolute inset-1 rounded-full bg-[#1a0a0a]" />
              <div className="absolute inset-2 rounded-full bg-[#d4af37]" />
            </motion.div>
            
            {/* Event */}
            <div 
              className="flex-1 bg-gradient-to-r from-[#2d1515]/60 to-transparent 
                py-3 px-5 rounded-lg border-l-2 border-[#d4af37]/50"
            >
              <span className="font-serif text-xl text-[#f5e6d3]">
                {item.event}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
