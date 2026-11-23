import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface CountdownTimerProps {
  targetDate: string;
  targetTime?: string;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ 
  targetDate, 
  targetTime = '12:00',
  className = '' 
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const target = new Date(`${targetDate}T${targetTime}`)
    
    const calculateTimeLeft = () => {
      const now = new Date()
      const diff = target.getTime() - now.getTime()
      
      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }
      
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      }
    }

    setTimeLeft(calculateTimeLeft())
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate, targetTime])

  return (
    <div className={`flex justify-center gap-3 md:gap-5 flex-wrap ${className}`}>
      <TimeUnit value={timeLeft.days} label="DAYS" />
      <TimeSeparator />
      <TimeUnit value={timeLeft.hours} label="HOURS" />
      <TimeSeparator />
      <TimeUnit value={timeLeft.minutes} label="MINS" />
      <TimeSeparator />
      <TimeUnit value={timeLeft.seconds} label="SECS" />
    </div>
  )
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <motion.div 
      className="text-center"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring' }}
    >
      <div 
        className="relative w-20 h-24 md:w-24 md:h-28 bg-gradient-to-br from-[#2d1515] to-[#1a0a0a] 
          rounded-xl flex items-center justify-center mb-2"
        style={{
          boxShadow: '0 8px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(212,175,55,0.1)'
        }}
      >
        {/* Inner border */}
        <div className="absolute inset-1 border border-[#d4af37]/30 rounded-lg pointer-events-none" />
        
        {/* Value */}
        <motion.span 
          className="font-serif text-4xl md:text-5xl text-[#d4af37] font-bold"
          key={value}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {value.toString().padStart(2, '0')}
        </motion.span>
        
        {/* Corner decorations */}
        <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-[#d4af37]/50 rounded-tl" />
        <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-[#d4af37]/50 rounded-tr" />
        <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-[#d4af37]/50 rounded-bl" />
        <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-[#d4af37]/50 rounded-br" />
      </div>
      
      <span className="text-xs md:text-sm text-[#c9a86c] tracking-widest font-serif">
        {label}
      </span>
    </motion.div>
  )
}

function TimeSeparator() {
  return (
    <div className="flex flex-col justify-center items-center gap-3 pt-2">
      <motion.div 
        className="w-2 h-2 bg-[#d4af37] rounded-full"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <motion.div 
        className="w-2 h-2 bg-[#d4af37] rounded-full"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
      />
    </div>
  )
}
