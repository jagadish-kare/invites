import { motion } from 'framer-motion'

interface CalendarProps {
  targetDate: string;
  className?: string;
}

export default function Calendar({ targetDate, className = '' }: CalendarProps) {
  const date = new Date(targetDate)
  const year = date.getFullYear()
  const month = date.getMonth()
  const targetDay = date.getDate()
  
  const monthName = date.toLocaleString('en', { month: 'long', year: 'numeric' })
  const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
  
  // Get first day of month (adjusted for Monday start)
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1
  
  // Get number of days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  
  // Generate calendar grid
  const calendarDays = []
  
  // Empty cells before first day
  for (let i = 0; i < adjustedFirstDay; i++) {
    calendarDays.push(null)
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  return (
    <motion.div 
      className={`max-w-sm mx-auto ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
    >
      <div 
        className="bg-gradient-to-br from-[#2d1515]/80 to-[#1a0a0a]/80 rounded-2xl p-6 relative"
        style={{
          boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset 0 0 60px rgba(212,175,55,0.05)'
        }}
      >
        {/* Inner borders */}
        <div className="absolute inset-2 border border-[#d4af37]/40 rounded-xl pointer-events-none" />
        <div className="absolute inset-4 border border-[#d4af37]/20 rounded-lg pointer-events-none" />
        
        {/* Month header */}
        <div className="text-center mb-6 relative">
          <h3 className="font-serif text-2xl text-[#d4af37] tracking-widest">
            {monthName.toUpperCase()}
          </h3>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-2" />
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center">
          {/* Day names */}
          {dayNames.map((day) => (
            <div key={day} className="text-xs text-[#c9a86c] font-serif p-2 tracking-wider">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map((day, index) => (
            <div 
              key={index}
              className={`
                relative p-2 text-sm rounded-full transition-all
                ${day === null ? 'invisible' : ''}
                ${day === targetDay 
                  ? '' 
                  : 'text-[#f5e6d3] hover:bg-[#d4af37]/10'
                }
              `}
            >
              {day === targetDay ? (
                <motion.div
                  className="w-10 h-10 mx-auto bg-gradient-to-br from-[#d4af37] to-[#b8960c] rounded-full 
                    flex items-center justify-center font-serif font-bold text-[#1a0a0a] text-lg"
                  animate={{ 
                    boxShadow: [
                      '0 0 10px rgba(212,175,55,0.5)',
                      '0 0 25px rgba(212,175,55,0.8)',
                      '0 0 10px rgba(212,175,55,0.5)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {day}
                </motion.div>
              ) : (
                day
              )}
            </div>
          ))}
        </div>
        
        {/* Footer note */}
        <p className="text-center text-[#c9a86c] text-sm mt-6 font-serif">
          ❤️ The Big Day
        </p>
      </div>
    </motion.div>
  )
}
