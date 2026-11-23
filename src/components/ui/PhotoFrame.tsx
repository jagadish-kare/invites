import { FloralSide } from './FloralFrame'

interface PhotoFrameProps {
  src: string;
  alt?: string;
  className?: string;
  showFloralSides?: boolean;
}

export default function PhotoFrame({ 
  src, 
  alt = 'Photo', 
  className = '',
  showFloralSides = true 
}: PhotoFrameProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Floral side decorations */}
      {showFloralSides && (
        <>
          <FloralSide side="left" />
          <FloralSide side="right" />
        </>
      )}
      
      {/* Ornate golden frame */}
      <div 
        className="relative p-4 md:p-5 bg-gradient-to-br from-[#d4af37] via-[#f5d67a] to-[#d4af37] rounded-xl"
        style={{
          boxShadow: '0 10px 50px rgba(212, 175, 55, 0.4), 0 20px 60px rgba(0,0,0,0.5)'
        }}
      >
        {/* Outer decorative border */}
        <div className="absolute inset-1 border-2 border-[#b8960c]/50 rounded-lg pointer-events-none" />
        
        {/* Inner dark border */}
        <div className="absolute inset-3 md:inset-4 border-3 border-[#1a0a0a] rounded-md pointer-events-none" />
        
        {/* Photo */}
        <img 
          src={src} 
          alt={alt}
          className="relative w-full aspect-[3/4] object-cover rounded-md"
        />
        
        {/* Frame corner accents */}
        <FrameCornerAccent position="top-left" />
        <FrameCornerAccent position="top-right" />
        <FrameCornerAccent position="bottom-left" />
        <FrameCornerAccent position="bottom-right" />
      </div>
    </div>
  )
}

function FrameCornerAccent({ position }: { position: string }) {
  const positionClasses: Record<string, string> = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0 -scale-x-100',
    'bottom-left': 'bottom-0 left-0 -scale-y-100',
    'bottom-right': 'bottom-0 right-0 scale-[-1]',
  }

  return (
    <div className={`absolute w-10 h-10 ${positionClasses[position]}`}>
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <defs>
          <linearGradient id="cornerGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5d67a" />
            <stop offset="100%" stopColor="#b8960c" />
          </linearGradient>
        </defs>
        {/* Ornate corner design */}
        <path 
          d="M0,0 L35,0 C25,5 20,10 15,15 C10,20 5,25 0,35 Z" 
          fill="url(#cornerGold)"
        />
        {/* Small flower accent */}
        <circle cx="12" cy="12" r="6" fill="#8B0000" />
        <circle cx="12" cy="12" r="3" fill="#f5d67a" />
      </svg>
    </div>
  )
}
