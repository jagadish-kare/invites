import { motion } from 'framer-motion'

interface MapEmbedProps {
  googleMapsLink: string;
  venueName?: string;
  venueAddress?: string;
  className?: string;
}

export default function MapEmbed({ 
  googleMapsLink, 
  venueName,
  venueAddress,
  className = '' 
}: MapEmbedProps) {
  // Convert Google Maps link to embed URL
  const getEmbedUrl = (url: string) => {
    // If already an embed URL, return as is
    if (url.includes('/embed')) return url
    
    // Try to extract place info from URL
    const placeMatch = url.match(/place\/([^\/]+)/)
    if (placeMatch) {
      const place = encodeURIComponent(placeMatch[1].replace(/\+/g, ' '))
      return `https://maps.google.com/maps?q=${place}&output=embed`
    }
    
    // Try to extract coordinates
    const coordMatch = url.match(/@([-\d.]+),([-\d.]+)/)
    if (coordMatch) {
      return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&output=embed`
    }
    
    // Fallback: use the whole URL as a search query
    return `https://maps.google.com/maps?q=${encodeURIComponent(url)}&output=embed`
  }

  const embedUrl = getEmbedUrl(googleMapsLink)
  const destinationQuery = venueAddress || venueName || googleMapsLink

  return (
    <motion.div 
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Map container - clickable to open Google Maps */}
      <a 
        href={googleMapsLink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block group"
      >
        <div 
          className="relative max-w-xl mx-auto rounded-2xl overflow-hidden transition-all duration-300 group-hover:shadow-2xl"
          style={{
            boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset 0 0 60px rgba(212,175,55,0.05)'
          }}
        >
          {/* Golden border frame */}
          <div className="absolute inset-0 border-4 border-[#d4af37]/40 rounded-2xl pointer-events-none z-10 group-hover:border-[#d4af37]/70 transition-all" />
          <div className="absolute inset-2 border border-[#d4af37]/20 rounded-xl pointer-events-none z-10" />
          
          {/* Map iframe */}
          <iframe
            src={embedUrl}
            width="100%"
            height="320"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="pointer-events-none"
          />

          {/* Click overlay hint */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
            <motion.div 
              className="bg-[#d4af37]/90 text-[#1a0a0a] px-6 py-2 rounded-full font-serif opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.05 }}
            >
              🗺️ Click to open in Google Maps
            </motion.div>
          </div>
        </div>
      </a>

      {/* Get Directions button */}
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <motion.a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destinationQuery)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 py-3 px-8 bg-gradient-to-r from-[#8B0000] via-[#a52a2a] to-[#8B0000] 
            rounded-full text-white font-serif text-lg shadow-lg"
          whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(139,0,0,0.4)' }}
          whileTap={{ scale: 0.95 }}
        >
          📍 Get Directions
        </motion.a>
        
        <motion.a
          href={googleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 py-3 px-8 border-2 border-[#d4af37] 
            rounded-full text-[#d4af37] font-serif text-lg hover:bg-[#d4af37]/10 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🗺️ View on Map
        </motion.a>
      </div>
    </motion.div>
  )
}
