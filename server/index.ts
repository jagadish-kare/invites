import express from 'express'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

// Serve static files from dist folder in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')))
}

// Create uploads directory
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true })
}

// Simple JSON file database
const DB_FILE = 'db.json'

interface User {
  id: string;
  email: string;
  name: string;
  password: string; // hashed
  createdAt: string;
}

interface Database {
  users: User[];
  invitations: any[];
  guestbook: any[];
}

function readDB(): Database {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'))
    }
  } catch (e) {
    console.error('Error reading DB:', e)
  }
  return { users: [], invitations: [], guestbook: [] }
}

function writeDB(data: Database) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
}

// Initialize DB
if (!fs.existsSync(DB_FILE)) {
  writeDB({ users: [], invitations: [], guestbook: [] })
}

// Simple password hashing
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

// Simple token generation (in production, use JWT)
function generateToken(userId: string): string {
  const payload = { userId, timestamp: Date.now() }
  return Buffer.from(JSON.stringify(payload)).toString('base64')
}

function verifyToken(token: string): string | null {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString())
    // Token expires in 7 days
    if (Date.now() - payload.timestamp > 7 * 24 * 60 * 60 * 1000) {
      return null
    }
    return payload.userId
  } catch {
    return null
  }
}

// Auth middleware
function authMiddleware(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  const token = authHeader.split(' ')[1]
  const userId = verifyToken(token)
  
  if (!userId) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
  
  const db = readDB()
  const user = db.users.find(u => u.id === userId)
  
  if (!user) {
    return res.status(401).json({ error: 'User not found' })
  }
  
  req.user = { id: user.id, email: user.email, name: user.name }
  next()
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const invitationId = req.params.id || 'temp'
    const dir = `uploads/${invitationId}`
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`
    cb(null, uniqueName)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
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

// ============ AUTH ROUTES ============

// Signup
app.post('/api/auth/signup', (req, res) => {
  try {
    const { name, email, password } = req.body
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' })
    }
    
    const db = readDB()
    
    // Check if email exists
    if (db.users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ error: 'Email already registered' })
    }
    
    const user: User = {
      id: uuidv4(),
      email: email.toLowerCase(),
      name,
      password: hashPassword(password),
      createdAt: new Date().toISOString()
    }
    
    db.users.push(user)
    writeDB(db)
    
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

// Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }
    
    const db = readDB()
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase())
    
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

// Get current user
app.get('/api/auth/me', authMiddleware, (req: any, res) => {
  res.json(req.user)
})

// ============ USER ROUTES ============

// Get user's invitations
app.get('/api/user/invitations', authMiddleware, (req: any, res) => {
  try {
    const db = readDB()
    const userInvitations = db.invitations
      .filter(inv => inv.user_id === req.user.id)
      .map(inv => ({
        id: inv.id,
        groom_name: inv.groom_name,
        bride_name: inv.bride_name,
        wedding_date: inv.wedding_date,
        created_at: inv.created_at
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    
    res.json(userInvitations)
  } catch (error: any) {
    console.error('Error fetching user invitations:', error)
    res.status(500).json({ error: error.message })
  }
})

// ============ INVITATION ROUTES ============

// Create invitation (protected)
app.post('/api/invitation', authMiddleware, (req: any, res) => {
  try {
    const id = uuidv4()
    const data = req.body

    const invitation = {
      id,
      user_id: req.user.id, // Associate with user
      template_id: 'royal-maroon',
      groom_name: data.groomName,
      bride_name: data.brideName,
      groom_father_name: data.groomFatherName,
      groom_mother_name: data.groomMotherName,
      bride_father_name: data.brideFatherName,
      bride_mother_name: data.brideMotherName,
      groom_address: data.groomAddress,
      bride_address: data.brideAddress,
      wedding_date: data.weddingDate,
      wedding_time: data.weddingTime,
      wedding_venue: data.weddingVenue,
      wedding_venue_address: data.weddingVenueAddress,
      haladi_date: data.haladiDate,
      haladi_time: data.haladiTime,
      haladi_venue: data.haladiVenue,
      reception_date: data.receptionDate,
      reception_time: data.receptionTime,
      reception_venue: data.receptionVenue,
      google_maps_link: data.googleMapsLink,
      main_photo: data.mainPhoto || '',
      qr_code_image: data.qrCodeImage || '',
      qr_label: data.qrLabel || 'Gift',
      schedule: data.schedule || [],
      gallery_photos: data.galleryPhotos || [],
      created_at: new Date().toISOString()
    }

    const db = readDB()
    db.invitations.push(invitation)
    writeDB(db)

    // Create folder
    const dir = `uploads/${id}`
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    res.json({ success: true, id, url: `/invitation/${id}` })
  } catch (error: any) {
    console.error('Error creating invitation:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get invitation (public - for viewing)
app.get('/api/invitation/:id', (req, res) => {
  try {
    const { id } = req.params
    const db = readDB()
    const invitation = db.invitations.find(inv => inv.id === id)

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' })
    }

    res.json(invitation)
  } catch (error: any) {
    console.error('Error fetching invitation:', error)
    res.status(500).json({ error: error.message })
  }
})

// Upload image (protected)
app.post('/api/upload/:id', authMiddleware, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const filePath = `/${req.file.path.replace(/\\/g, '/')}`
    res.json({ success: true, path: filePath })
  } catch (error: any) {
    console.error('Error uploading file:', error)
    res.status(500).json({ error: error.message })
  }
})

// ============ GUESTBOOK ROUTES ============

// Add guestbook entry (public)
app.post('/api/guestbook/:invitationId', (req, res) => {
  try {
    const { invitationId } = req.params
    const { guestName, wishes } = req.body

    const entry = {
      id: Date.now(),
      invitation_id: invitationId,
      guest_name: guestName,
      wishes,
      created_at: new Date().toISOString()
    }

    const db = readDB()
    db.guestbook.push(entry)
    writeDB(db)

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

// Get guestbook entries (public)
app.get('/api/guestbook/:invitationId', (req, res) => {
  try {
    const { invitationId } = req.params
    const db = readDB()

    const entries = db.guestbook
      .filter(entry => entry.invitation_id === invitationId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    res.json(entries)
  } catch (error: any) {
    console.error('Error fetching guestbook:', error)
    res.status(500).json({ error: error.message })
  }
})

// SPA fallback - serve index.html for all other routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`🎊 Wedding Invitation Server running at http://localhost:${PORT}`)
})
