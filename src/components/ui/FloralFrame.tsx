import { ReactNode } from 'react'

interface FloralFrameProps {
  children: ReactNode;
  className?: string;
}

// Beautiful ornate floral frame component
export default function FloralFrame({ children, className = '' }: FloralFrameProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Corner decorations */}
      <FloralCorner position="top-left" />
      <FloralCorner position="top-right" />
      <FloralCorner position="bottom-left" />
      <FloralCorner position="bottom-right" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

interface FloralCornerProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: 'small' | 'medium' | 'large';
}

export function FloralCorner({ position, size = 'large' }: FloralCornerProps) {
  const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0 -scale-x-100',
    'bottom-left': 'bottom-0 left-0 -scale-y-100',
    'bottom-right': 'bottom-0 right-0 scale-[-1]',
  }

  const sizeClasses = {
    small: 'w-24 h-24 md:w-28 md:h-28',
    medium: 'w-32 h-32 md:w-40 md:h-40',
    large: 'w-40 h-40 md:w-52 md:h-52',
  }

  return (
    <div 
      className={`absolute pointer-events-none ${positionClasses[position]} ${sizeClasses[size]}`}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5d67a" />
            <stop offset="30%" stopColor="#d4af37" />
            <stop offset="70%" stopColor="#c9a228" />
            <stop offset="100%" stopColor="#b8960c" />
          </linearGradient>
          <linearGradient id="maroonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a52a2a" />
            <stop offset="50%" stopColor="#8B0000" />
            <stop offset="100%" stopColor="#5a0000" />
          </linearGradient>
          <radialGradient id="flowerCenter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f5e6d3" />
            <stop offset="100%" stopColor="#d4af37" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background decorative arc */}
        <path 
          d="M0,0 L180,0 C140,10 130,20 110,40 C90,60 70,90 50,120 C30,150 15,165 0,180 Z"
          fill="url(#goldGradient)"
          opacity="0.15"
        />
        
        {/* Main decorative swirl */}
        <path 
          d="M5,5 Q60,5 100,30 Q140,55 155,100 Q130,80 95,70 Q60,60 30,80 Q10,95 5,130"
          fill="none" 
          stroke="url(#goldGradient)" 
          strokeWidth="2.5"
          filter="url(#glow)"
        />
        
        {/* Inner decorative swirl */}
        <path 
          d="M15,15 Q50,15 80,35 Q110,55 125,90 Q105,75 80,68 Q50,60 35,75 Q20,88 18,110"
          fill="none" 
          stroke="url(#goldGradient)" 
          strokeWidth="1.5"
          opacity="0.7"
        />
        
        {/* Large main flower (maroon/burgundy) */}
        <g transform="translate(35, 35)">
          {/* Outer petals */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <ellipse 
              key={i}
              cx="0" 
              cy="-20" 
              rx="12" 
              ry="20"
              fill="url(#maroonGradient)"
              transform={`rotate(${angle})`}
              opacity="0.9"
            />
          ))}
          {/* Middle layer petals */}
          {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => (
            <ellipse 
              key={i}
              cx="0" 
              cy="-14" 
              rx="8" 
              ry="14"
              fill="#a52a2a"
              transform={`rotate(${angle})`}
              opacity="0.85"
            />
          ))}
          <circle cx="0" cy="0" r="12" fill="#5a0000" />
          <circle cx="0" cy="0" r="7" fill="url(#flowerCenter)" />
          {/* Stamen dots */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <circle 
              key={i}
              cx={4 * Math.cos(angle * Math.PI / 180)} 
              cy={4 * Math.sin(angle * Math.PI / 180)} 
              r="1.5" 
              fill="#f5d67a"
            />
          ))}
        </g>
        
        {/* Medium flower 1 (cream/white) */}
        <g transform="translate(90, 25)">
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <ellipse 
              key={i}
              cx="0" 
              cy="-12" 
              rx="7" 
              ry="12"
              fill="#f5e6d3"
              transform={`rotate(${angle})`}
              opacity="0.95"
            />
          ))}
          <circle cx="0" cy="0" r="6" fill="#e8d5b5" />
          <circle cx="0" cy="0" r="3" fill="#d4af37" />
        </g>
        
        {/* Medium flower 2 (cream/white) */}
        <g transform="translate(25, 90)">
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <ellipse 
              key={i}
              cx="0" 
              cy="-12" 
              rx="7" 
              ry="12"
              fill="#f5e6d3"
              transform={`rotate(${angle})`}
              opacity="0.95"
            />
          ))}
          <circle cx="0" cy="0" r="6" fill="#e8d5b5" />
          <circle cx="0" cy="0" r="3" fill="#d4af37" />
        </g>
        
        {/* Small flower 1 (maroon) */}
        <g transform="translate(70, 55)">
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <ellipse 
              key={i}
              cx="0" 
              cy="-10" 
              rx="6" 
              ry="10"
              fill="url(#maroonGradient)"
              transform={`rotate(${angle})`}
            />
          ))}
          <circle cx="0" cy="0" r="5" fill="#5a0000" />
          <circle cx="0" cy="0" r="2.5" fill="#d4af37" />
        </g>
        
        {/* Small flower 2 (maroon) */}
        <g transform="translate(55, 70)">
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <ellipse 
              key={i}
              cx="0" 
              cy="-10" 
              rx="6" 
              ry="10"
              fill="url(#maroonGradient)"
              transform={`rotate(${angle})`}
            />
          ))}
          <circle cx="0" cy="0" r="5" fill="#5a0000" />
          <circle cx="0" cy="0" r="2.5" fill="#d4af37" />
        </g>
        
        {/* Tiny accent flowers */}
        <g transform="translate(120, 50)">
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <ellipse 
              key={i}
              cx="0" 
              cy="-6" 
              rx="4" 
              ry="6"
              fill="#f5e6d3"
              transform={`rotate(${angle})`}
            />
          ))}
          <circle cx="0" cy="0" r="3" fill="#d4af37" />
        </g>
        
        <g transform="translate(50, 120)">
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <ellipse 
              key={i}
              cx="0" 
              cy="-6" 
              rx="4" 
              ry="6"
              fill="#f5e6d3"
              transform={`rotate(${angle})`}
            />
          ))}
          <circle cx="0" cy="0" r="3" fill="#d4af37" />
        </g>
        
        {/* Gold leaf decorations */}
        <path 
          d="M140,30 Q155,45 145,65 Q160,55 165,35 Q155,25 140,30" 
          fill="url(#goldGradient)" 
          opacity="0.8"
        />
        <path 
          d="M30,140 Q45,155 65,145 Q55,160 35,165 Q25,155 30,140" 
          fill="url(#goldGradient)" 
          opacity="0.8"
        />
        
        {/* Additional decorative leaves */}
        <path 
          d="M100,60 Q115,50 130,55 Q115,65 100,60" 
          fill="url(#goldGradient)" 
          opacity="0.6"
        />
        <path 
          d="M60,100 Q50,115 55,130 Q65,115 60,100" 
          fill="url(#goldGradient)" 
          opacity="0.6"
        />
        
        {/* Small accent dots */}
        <circle cx="145" cy="75" r="4" fill="#f5e6d3" />
        <circle cx="75" cy="145" r="4" fill="#f5e6d3" />
        <circle cx="160" cy="95" r="3" fill="#d4af37" />
        <circle cx="95" cy="160" r="3" fill="#d4af37" />
        <circle cx="130" cy="110" r="2" fill="#f5d67a" />
        <circle cx="110" cy="130" r="2" fill="#f5d67a" />
      </svg>
    </div>
  )
}

// Side floral decorations for photo frames - more elaborate
export function FloralSide({ side }: { side: 'left' | 'right' }) {
  return (
    <div 
      className={`absolute top-1/2 -translate-y-1/2 w-40 h-80 md:w-52 md:h-[400px] pointer-events-none
        ${side === 'left' ? '-left-20 md:-left-28' : '-right-20 md:-right-28 -scale-x-100'}`}
    >
      <svg viewBox="0 0 120 320" className="w-full h-full">
        <defs>
          <linearGradient id="goldGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f5d67a" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#b8960c" />
          </linearGradient>
          <linearGradient id="maroonGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a52a2a" />
            <stop offset="100%" stopColor="#5a0000" />
          </linearGradient>
        </defs>
        
        {/* Curved vine stem */}
        <path 
          d="M60,20 Q80,80 60,120 Q40,160 60,200 Q80,240 60,280 Q50,310 60,320" 
          fill="none" 
          stroke="url(#goldGrad2)" 
          strokeWidth="3"
        />
        
        {/* Large maroon flower - top */}
        <g transform="translate(45, 50)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <ellipse 
              key={i}
              cx="0" 
              cy="-22" 
              rx="12" 
              ry="22"
              fill="url(#maroonGrad2)"
              transform={`rotate(${angle})`}
            />
          ))}
          <circle cx="0" cy="0" r="14" fill="#5a0000" />
          <circle cx="0" cy="0" r="8" fill="#d4af37" />
          <circle cx="0" cy="0" r="4" fill="#f5e6d3" />
        </g>
        
        {/* Large maroon flower - middle */}
        <g transform="translate(55, 160)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <ellipse 
              key={i}
              cx="0" 
              cy="-25" 
              rx="14" 
              ry="25"
              fill="url(#maroonGrad2)"
              transform={`rotate(${angle})`}
            />
          ))}
          <circle cx="0" cy="0" r="16" fill="#5a0000" />
          <circle cx="0" cy="0" r="10" fill="#d4af37" />
          <circle cx="0" cy="0" r="5" fill="#f5e6d3" />
        </g>
        
        {/* Large maroon flower - bottom */}
        <g transform="translate(45, 270)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <ellipse 
              key={i}
              cx="0" 
              cy="-22" 
              rx="12" 
              ry="22"
              fill="url(#maroonGrad2)"
              transform={`rotate(${angle})`}
            />
          ))}
          <circle cx="0" cy="0" r="14" fill="#5a0000" />
          <circle cx="0" cy="0" r="8" fill="#d4af37" />
          <circle cx="0" cy="0" r="4" fill="#f5e6d3" />
        </g>
        
        {/* Cream/white flowers */}
        <g transform="translate(80, 100)">
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <ellipse 
              key={i}
              cx="0" 
              cy="-14" 
              rx="8" 
              ry="14"
              fill="#f5e6d3"
              transform={`rotate(${angle})`}
            />
          ))}
          <circle cx="0" cy="0" r="8" fill="#e8d5b5" />
          <circle cx="0" cy="0" r="4" fill="#d4af37" />
        </g>
        
        <g transform="translate(75, 220)">
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <ellipse 
              key={i}
              cx="0" 
              cy="-14" 
              rx="8" 
              ry="14"
              fill="#f5e6d3"
              transform={`rotate(${angle})`}
            />
          ))}
          <circle cx="0" cy="0" r="8" fill="#e8d5b5" />
          <circle cx="0" cy="0" r="4" fill="#d4af37" />
        </g>
        
        {/* Small accent flowers */}
        <g transform="translate(90, 65)">
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <ellipse key={i} cx="0" cy="-8" rx="5" ry="8" fill="#f5e6d3" transform={`rotate(${angle})`} />
          ))}
          <circle cx="0" cy="0" r="4" fill="#d4af37" />
        </g>
        
        <g transform="translate(25, 120)">
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <ellipse key={i} cx="0" cy="-8" rx="5" ry="8" fill="url(#maroonGrad2)" transform={`rotate(${angle})`} />
          ))}
          <circle cx="0" cy="0" r="4" fill="#d4af37" />
        </g>
        
        <g transform="translate(90, 185)">
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <ellipse key={i} cx="0" cy="-8" rx="5" ry="8" fill="url(#maroonGrad2)" transform={`rotate(${angle})`} />
          ))}
          <circle cx="0" cy="0" r="4" fill="#d4af37" />
        </g>
        
        <g transform="translate(25, 240)">
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <ellipse key={i} cx="0" cy="-8" rx="5" ry="8" fill="#f5e6d3" transform={`rotate(${angle})`} />
          ))}
          <circle cx="0" cy="0" r="4" fill="#d4af37" />
        </g>
        
        {/* Gold leaves */}
        <path d="M70,30 Q90,20 100,35 Q85,45 70,30" fill="url(#goldGrad2)" opacity="0.8" />
        <path d="M30,80 Q10,70 15,55 Q30,65 30,80" fill="url(#goldGrad2)" opacity="0.8" />
        <path d="M85,140 Q105,130 110,145 Q95,155 85,140" fill="url(#goldGrad2)" opacity="0.8" />
        <path d="M20,180 Q0,170 5,155 Q20,165 20,180" fill="url(#goldGrad2)" opacity="0.8" />
        <path d="M80,250 Q100,240 105,255 Q90,265 80,250" fill="url(#goldGrad2)" opacity="0.8" />
        <path d="M25,300 Q5,290 10,275 Q25,285 25,300" fill="url(#goldGrad2)" opacity="0.8" />
      </svg>
    </div>
  )
}

// Ornate divider - more elaborate
export function OrnateDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`w-64 h-16 mx-auto ${className}`}>
      <svg viewBox="0 0 260 60" className="w-full h-full">
        <defs>
          <linearGradient id="dividerGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.2" />
            <stop offset="25%" stopColor="#f5d67a" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="75%" stopColor="#f5d67a" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        
        {/* Decorative curves */}
        <path 
          d="M10,30 Q65,5 130,30 Q195,55 250,30" 
          fill="none" 
          stroke="url(#dividerGold)" 
          strokeWidth="2"
        />
        <path 
          d="M10,30 Q65,55 130,30 Q195,5 250,30" 
          fill="none" 
          stroke="url(#dividerGold)" 
          strokeWidth="2"
        />
        
        {/* Center flower */}
        <g transform="translate(130, 30)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <ellipse 
              key={i}
              cx="0" 
              cy="-10" 
              rx="5" 
              ry="10"
              fill="#8B0000"
              transform={`rotate(${angle})`}
            />
          ))}
          <circle cx="0" cy="0" r="6" fill="#d4af37" />
          <circle cx="0" cy="0" r="3" fill="#f5e6d3" />
        </g>
        
        {/* Side flowers */}
        <g transform="translate(50, 30)">
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <ellipse key={i} cx="0" cy="-6" rx="4" ry="6" fill="#f5e6d3" transform={`rotate(${angle})`} />
          ))}
          <circle cx="0" cy="0" r="4" fill="#d4af37" />
        </g>
        
        <g transform="translate(210, 30)">
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <ellipse key={i} cx="0" cy="-6" rx="4" ry="6" fill="#f5e6d3" transform={`rotate(${angle})`} />
          ))}
          <circle cx="0" cy="0" r="4" fill="#d4af37" />
        </g>
        
        {/* Accent dots */}
        <circle cx="85" cy="22" r="3" fill="#8B0000" />
        <circle cx="175" cy="22" r="3" fill="#8B0000" />
        <circle cx="85" cy="38" r="3" fill="#8B0000" />
        <circle cx="175" cy="38" r="3" fill="#8B0000" />
        
        <circle cx="30" cy="30" r="2" fill="#f5e6d3" />
        <circle cx="230" cy="30" r="2" fill="#f5e6d3" />
      </svg>
    </div>
  )
}

// Full border frame for sections
export function FloralBorder({ children, className = '' }: FloralFrameProps) {
  return (
    <div className={`relative p-8 md:p-12 ${className}`}>
      {/* Corner decorations */}
      <FloralCorner position="top-left" />
      <FloralCorner position="top-right" />
      <FloralCorner position="bottom-left" />
      <FloralCorner position="bottom-right" />
      
      {/* Border lines */}
      <div className="absolute top-6 left-20 right-20 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
      <div className="absolute bottom-6 left-20 right-20 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
      <div className="absolute left-6 top-20 bottom-20 w-[2px] bg-gradient-to-b from-transparent via-[#d4af37] to-transparent" />
      <div className="absolute right-6 top-20 bottom-20 w-[2px] bg-gradient-to-b from-transparent via-[#d4af37] to-transparent" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
