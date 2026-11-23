import 'dotenv/config'
import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import cors from 'cors'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
import { MongoClient } from 'mongodb'
import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))

// Serve static files from dist folder in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')))
}

// MongoDB setup
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wedding-invites'
let db: any = null
let useLocalStorage = false // Fallback to JSON file if MongoDB fails

async function connectDB() {
  try {
    const client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    })
    await client.connect()
    db = client.db('wedding-invites')
    console.log('✅ Connected to MongoDB')
    
    // Create indexes
    await db.collection('invitations').createIndex({ wedding_date: 1 })
    await db.collection('invitations').createIndex({ user_id: 1 })
    
    // Start cleanup job
    startCleanupJob()
  } catch (error) {
    console.error('⚠️ MongoDB connection failed, using local JSON storage:', error)
    useLocalStorage = true
    initLocalStorage()
  }
}

// Local JSON storage fallback
import fs from 'fs'
const DATA_FILE = path.join(__dirname, '../db.json')

interface LocalData {
  users: any[];
  invitations: any[];
  guestbook: any[];
}

let localData: LocalData = { users: [], invitations: [], guestbook: [] }

function initLocalStorage() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf8')
      localData = JSON.parse(content)
    }
  } catch (e) {
    console.log('Creating new local database')
  }
  saveLocalStorage()
}

function saveLocalStorage() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(localData, null, 2))
  } catch (e) {
    console.error('Error saving local storage:', e)
  }
}

// Mock MongoDB-like collection interface for local storage
function getLocalCollection(name: string) {
  const data = localData[name as keyof LocalData] || []
  return {
    find: (query: any = {}) => ({
      sort: () => ({
        toArray: async () => {
          let result = [...data]
          if (query.user_id) result = result.filter((item: any) => item.user_id === query.user_id)
          if (query.id) result = result.filter((item: any) => item.id === query.id)
          if (query.invitation_id) result = result.filter((item: any) => item.invitation_id === query.invitation_id)
          return result
        }
      }),
      toArray: async () => {
        let result = [...data]
        if (query.user_id) result = result.filter((item: any) => item.user_id === query.user_id)
        if (query.wedding_date?.$lt) result = result.filter((item: any) => item.wedding_date < query.wedding_date.$lt)
        return result
      }
    }),
    findOne: async (query: any) => {
      return data.find((item: any) => {
        if (query.id && query.user_id) return item.id === query.id && item.user_id === query.user_id
        if (query.id) return item.id === query.id
        if (query.email) return item.email === query.email
        return false
      })
    },
    insertOne: async (doc: any) => {
      data.push(doc)
      localData[name as keyof LocalData] = data
      saveLocalStorage()
      return { insertedId: doc.id }
    },
    updateOne: async (query: any, update: any) => {
      const index = data.findIndex((item: any) => item.id === query.id)
      if (index >= 0) {
        data[index] = { ...data[index], ...update.$set }
        localData[name as keyof LocalData] = data
        saveLocalStorage()
      }
      return { modifiedCount: index >= 0 ? 1 : 0 }
    },
    deleteOne: async (query: any) => {
      const index = data.findIndex((item: any) => item.id === query.id)
      if (index >= 0) {
        data.splice(index, 1)
        localData[name as keyof LocalData] = data
        saveLocalStorage()
      }
      return { deletedCount: index >= 0 ? 1 : 0 }
    },
    deleteMany: async (query: any) => {
      const before = data.length
      const filtered = data.filter((item: any) => item.invitation_id !== query.invitation_id)
      localData[name as keyof LocalData] = filtered
      saveLocalStorage()
      return { deletedCount: before - filtered.length }
    },
    createIndex: async () => {}
  }
}

function getCollection(name: string) {
  if (useLocalStorage) {
    return getLocalCollection(name)
  }
  return db.collection(name)
}

// Cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Multer for handling file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    if (extname && mimetype) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})

// Auto-cleanup job - runs every hour
function startCleanupJob() {
  const CLEANUP_DAYS = 7 // Days after wedding to keep data
  
  const cleanup = async () => {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - CLEANUP_DAYS)
      
      // Find expired invitations
      const expiredInvitations = await getCollection('invitations').find({
        wedding_date: { $lt: cutoffDate.toISOString().split('T')[0] }
      }).toArray()
      
      for (const inv of expiredInvitations) {
        // Delete images from Cloudinary
        if (inv.cloudinary_folder && !useLocalStorage) {
          try {
            await cloudinary.api.delete_resources_by_prefix(inv.cloudinary_folder)
            await cloudinary.api.delete_folder(inv.cloudinary_folder)
          } catch (e) {
            console.log('Cloudinary cleanup error:', e)
          }
        }
        
        // Delete guestbook entries
        await getCollection('guestbook').deleteMany({ invitation_id: inv.id })
        
        // Delete invitation
        await getCollection('invitations').deleteOne({ id: inv.id })
        
        console.log(`🗑️ Cleaned up expired invitation: ${inv.id}`)
      }
    } catch (error) {
      console.error('Cleanup error:', error)
    }
  }
  
  // Run cleanup every hour
  setInterval(cleanup, 60 * 60 * 1000)
  // Also run on startup after 1 minute
  setTimeout(cleanup, 60 * 1000)
}

// Simple password hashing
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

// Simple token generation
function generateToken(userId: string): string {
  const payload = { userId, timestamp: Date.now() }
  return Buffer.from(JSON.stringify(payload)).toString('base64')
}

function verifyToken(token: string): string | null {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString())
    if (Date.now() - payload.timestamp > 7 * 24 * 60 * 60 * 1000) {
      return null
    }
    return payload.userId
  } catch {
    return null
  }
}

// Auth middleware
async function authMiddleware(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  const token = authHeader.split(' ')[1]
  const userId = verifyToken(token)
  
  if (!userId) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
  
  const user = await getCollection('users').findOne({ id: userId })
  
  if (!user) {
    return res.status(401).json({ error: 'User not found' })
  }
  
  req.user = { id: user.id, email: user.email, name: user.name }
  next()
}

// Upload to Cloudinary helper
async function uploadToCloudinary(buffer: Buffer, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) reject(error)
        else resolve(result?.secure_url || '')
      }
    )
    uploadStream.end(buffer)
  })
}

// ============ AUTH ROUTES ============

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' })
    }
    
    const existingUser = await getCollection('users').findOne({ 
      email: email.toLowerCase() 
    })
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' })
    }
    
    const user = {
      id: uuidv4(),
      email: email.toLowerCase(),
      name,
      password: hashPassword(password),
      createdAt: new Date().toISOString()
    }
    
    await getCollection('users').insertOne(user)
    const token = generateToken(user.id)
    
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name }
    })
  } catch (error: any) {
    console.error('Signup error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }
    
    const user = await getCollection('users').findOne({ 
      email: email.toLowerCase() 
    })
    
    if (!user || user.password !== hashPassword(password)) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    
    const token = generateToken(user.id)
    
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name }
    })
  } catch (error: any) {
    console.error('Login error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/auth/me', authMiddleware, (req: any, res) => {
  res.json(req.user)
})

// ============ USER ROUTES ============

app.get('/api/user/invitations', authMiddleware, async (req: any, res) => {
  try {
    const invitations = await getCollection('invitations')
      .find({ user_id: req.user.id })
      .sort({ created_at: -1 })
      .toArray()
    
    res.json(invitations.map((inv: any) => ({
      id: inv.id,
      groom_name: inv.groom_name,
      bride_name: inv.bride_name,
      wedding_date: inv.wedding_date,
      event_type: inv.event_type || 'wedding',
      event_title: inv.event_title || 'Wedding Invitation',
      created_at: inv.created_at
    })))
  } catch (error: any) {
    console.error('Error fetching user invitations:', error)
    res.status(500).json({ error: error.message })
  }
})

// ============ INVITATION ROUTES ============

// Create new invitation
app.post('/api/invitation', authMiddleware, async (req: any, res) => {
  try {
    const id = uuidv4()
    const data = req.body
    const cloudinaryFolder = `invitations/${id}`

    const invitation = {
      id,
      user_id: req.user.id,
      cloudinary_folder: cloudinaryFolder,
      template_id: 'royal-maroon',
      
      // Event type and labels
      event_type: data.eventType || 'wedding',
      event_title: data.eventTitle || 'Wedding Invitation',
      main_ceremony_label: data.mainCeremonyLabel || 'WEDDING CEREMONY',
      secondary_ceremony_label: data.secondaryCeremonyLabel || 'HALADI CEREMONY',
      reception_label: data.receptionLabel || 'RECEPTION',
      
      // Names
      groom_name: data.groomName,
      bride_name: data.brideName,
      
      // Family
      groom_father_name: data.groomFatherName,
      groom_mother_name: data.groomMotherName,
      bride_father_name: data.brideFatherName,
      bride_mother_name: data.brideMotherName,
      groom_address: data.groomAddress,
      bride_address: data.brideAddress,
      
      // Main ceremony
      wedding_date: data.weddingDate,
      wedding_time: data.weddingTime,
      wedding_venue: data.weddingVenue,
      wedding_venue_address: data.weddingVenueAddress,
      
      // Secondary ceremony
      haladi_date: data.haladiDate,
      haladi_time: data.haladiTime,
      haladi_venue: data.haladiVenue,
      
      // Reception
      reception_date: data.receptionDate,
      reception_time: data.receptionTime,
      reception_venue: data.receptionVenue,
      
      // Other
      google_maps_link: data.googleMapsLink,
      main_photo: data.mainPhoto || '',
      qr_code_image: data.qrCodeImage || '',
      qr_label: data.qrLabel || 'Gift',
      schedule: data.schedule || [],
      gallery_photos: data.galleryPhotos || [],
      
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    await getCollection('invitations').insertOne(invitation)
    res.json({ success: true, id, url: `/invitation/${id}` })
  } catch (error: any) {
    console.error('Error creating invitation:', error)
    res.status(500).json({ error: error.message })
  }
})

// Update existing invitation
app.put('/api/invitation/:id', authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params
    const data = req.body
    
    // Check ownership
    const existing = await getCollection('invitations').findOne({ id, user_id: req.user.id })
    if (!existing) {
      return res.status(404).json({ error: 'Invitation not found or you do not have permission to edit it' })
    }

    const updateData = {
      // Event type and labels
      event_type: data.eventType || existing.event_type,
      event_title: data.eventTitle || existing.event_title,
      main_ceremony_label: data.mainCeremonyLabel || existing.main_ceremony_label,
      secondary_ceremony_label: data.secondaryCeremonyLabel || existing.secondary_ceremony_label,
      reception_label: data.receptionLabel || existing.reception_label,
      
      // Names
      groom_name: data.groomName,
      bride_name: data.brideName,
      
      // Family
      groom_father_name: data.groomFatherName,
      groom_mother_name: data.groomMotherName,
      bride_father_name: data.brideFatherName,
      bride_mother_name: data.brideMotherName,
      groom_address: data.groomAddress,
      bride_address: data.brideAddress,
      
      // Main ceremony
      wedding_date: data.weddingDate,
      wedding_time: data.weddingTime,
      wedding_venue: data.weddingVenue,
      wedding_venue_address: data.weddingVenueAddress,
      
      // Secondary ceremony
      haladi_date: data.haladiDate,
      haladi_time: data.haladiTime,
      haladi_venue: data.haladiVenue,
      
      // Reception
      reception_date: data.receptionDate,
      reception_time: data.receptionTime,
      reception_venue: data.receptionVenue,
      
      // Other
      google_maps_link: data.googleMapsLink,
      main_photo: data.mainPhoto || existing.main_photo,
      qr_code_image: data.qrCodeImage || existing.qr_code_image,
      qr_label: data.qrLabel || existing.qr_label,
      schedule: data.schedule || existing.schedule,
      gallery_photos: data.galleryPhotos || existing.gallery_photos,
      
      updated_at: new Date().toISOString()
    }

    await getCollection('invitations').updateOne(
      { id },
      { $set: updateData }
    )
    
    res.json({ success: true, id, url: `/invitation/${id}` })
  } catch (error: any) {
    console.error('Error updating invitation:', error)
    res.status(500).json({ error: error.message })
  }
})

// Delete invitation
app.delete('/api/invitation/:id', authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params
    
    // Check ownership
    const existing = await getCollection('invitations').findOne({ id, user_id: req.user.id })
    if (!existing) {
      return res.status(404).json({ error: 'Invitation not found or you do not have permission to delete it' })
    }

    // Delete images from Cloudinary
    if (existing.cloudinary_folder && !useLocalStorage) {
      try {
        await cloudinary.api.delete_resources_by_prefix(existing.cloudinary_folder)
        await cloudinary.api.delete_folder(existing.cloudinary_folder)
      } catch (e) {
        console.log('Cloudinary cleanup error:', e)
      }
    }
    
    // Delete guestbook entries
    await getCollection('guestbook').deleteMany({ invitation_id: id })
    
    // Delete invitation
    await getCollection('invitations').deleteOne({ id })
    
    res.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting invitation:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get full invitation data for editing (requires auth)
app.get('/api/invitation/:id/full', authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params
    const invitation = await getCollection('invitations').findOne({ id, user_id: req.user.id })

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found or you do not have permission' })
    }

    res.json(invitation)
  } catch (error: any) {
    console.error('Error fetching invitation for edit:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get public invitation (no auth required)
app.get('/api/invitation/:id', async (req, res) => {
  try {
    const { id } = req.params
    const invitation = await getCollection('invitations').findOne({ id })

    if (!invitation) {
      // Check if it was an expired invitation
      return res.status(404).json({ 
        error: 'Invitation not found',
        expired: true,
        message: 'This celebration has concluded. Thank you for your interest!'
      })
    }

    // Check if event has passed (show special message)
    const weddingDate = new Date(invitation.wedding_date)
    const now = new Date()
    const daysPassed = Math.floor((now.getTime() - weddingDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysPassed > 7) {
      return res.status(410).json({
        error: 'Event completed',
        expired: true,
        groom_name: invitation.groom_name,
        bride_name: invitation.bride_name,
        event_type: invitation.event_type,
        event_title: invitation.event_title,
        message: 'The celebration has concluded. Thank you for being part of our special day!'
      })
    }

    res.json(invitation)
  } catch (error: any) {
    console.error('Error fetching invitation:', error)
    res.status(500).json({ error: error.message })
  }
})

// Upload image to Cloudinary
app.post('/api/upload/:id', authMiddleware, upload.single('image'), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const folder = `invitations/${req.params.id}`
    const url = await uploadToCloudinary(req.file.buffer, folder)
    
    res.json({ success: true, path: url })
  } catch (error: any) {
    console.error('Error uploading file:', error)
    res.status(500).json({ error: error.message })
  }
})

// ============ GUESTBOOK ROUTES ============

app.post('/api/guestbook/:invitationId', async (req, res) => {
  try {
    const { invitationId } = req.params
    const { guestName, wishes } = req.body

    const entry = {
      id: uuidv4(),
      invitation_id: invitationId,
      guest_name: guestName,
      wishes,
      created_at: new Date().toISOString()
    }

    await getCollection('guestbook').insertOne(entry)

    res.json({
      success: true,
      id: entry.id,
      createdAt: entry.created_at
    })
  } catch (error: any) {
    console.error('Error adding guestbook entry:', error)
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/guestbook/:invitationId', async (req, res) => {
  try {
    const { invitationId } = req.params
    
    const entries = await getCollection('guestbook')
      .find({ invitation_id: invitationId })
      .sort({ created_at: -1 })
      .toArray()

    res.json(entries)
  } catch (error: any) {
    console.error('Error fetching guestbook:', error)
    res.status(500).json({ error: error.message })
  }
})

// SPA fallback
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  })
}

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🎊 Wedding Invitation Server running at http://localhost:${PORT}`)
  })
})
