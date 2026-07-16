import express from 'express'
import cors from 'cors'
import multer from 'multer'

const upload = multer()

const app = express()
const PORT = process.env.PORT || 8080

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

const ok = (message, data) => ({ success: true, message, data, timestamp: new Date().toISOString() })
const page = (content, pageNum = 0, size = 20) => ({
  content,
  page: pageNum,
  size,
  totalElements: content.length,
  totalPages: Math.max(1, Math.ceil(content.length / size)),
  last: true,
  first: pageNum === 0,
})

let userIdSeq = 4
let propertyIdSeq = 20
let bookingIdSeq = 1
let reviewIdSeq = 1

const users = [
  { id: 1, firstName: 'Admin', lastName: 'System', email: 'admin@airbnb.com', password: 'Password123', role: 'ADMIN', avatar: null, emailVerified: true, bio: '', phone: '' },
  { id: 2, firstName: 'Goa', lastName: 'Host', email: 'host@airbnb.com', password: 'Password123', role: 'HOST', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', emailVerified: true, bio: '', phone: '' },
]

const categories = [
  { id: 1, name: 'Homes', icon: '🏡', isActive: true },
  { id: 2, name: 'Beach', icon: '🏖️', isActive: true },
  { id: 3, name: 'Villas', icon: '🏰', isActive: true },
]

const seedProperties = [
  ['Villa in Baga', 'Beautiful villa in Baga, Goa.', 'VILLA', 8503, 4.98, 12, 'Baga Road', 'North Goa', 'Goa', 'photo-1582268611958-ebfd161ef9cf'],
  ['Villa in Vagator', 'Charming living room in Vagator.', 'VILLA', 5400, 4.92, 8, 'Vagator Beach Rd', 'North Goa', 'Goa', 'photo-1600210492486-724fe5c67fb0'],
  ['Home in Calangute', 'Lovely red exterior villa in Calangute.', 'HOUSE', 10073, 5.0, 15, 'Calangute-Mapusa Rd', 'North Goa', 'Goa', 'photo-1564013799919-ab600027ffc6'],
  ['Apartment in Goa', 'Clean bedroom with large windows.', 'APARTMENT', 2875, 4.96, 6, 'Candolim Rd', 'North Goa', 'Goa', 'photo-1598928506311-c55ded91a20c'],
  ['Flat in Anjuna', 'Modern living room in Anjuna.', 'APARTMENT', 4018, 4.92, 5, 'Anjuna Beach Rd', 'North Goa', 'Goa', 'photo-1600607687939-ce8a6c25118c'],
  ['Flat in Calangute', 'Unique interior design in Calangute.', 'APARTMENT', 5166, 4.87, 9, 'Calangute Main Rd', 'North Goa', 'Goa', 'photo-1600607687920-4e2a09cf159d'],
  ['Flat in Nerul', 'Elegant dining room in Nerul.', 'APARTMENT', 5706, 5.0, 10, 'Nerul Road', 'North Goa', 'Goa', 'photo-1600585154340-be6161a56a0c'],
  ['Home in Lonavala', 'Stunning modern structure with private pool.', 'HOUSE', 35000, 4.86, 20, 'Tungarli Road', 'Lonavala', 'Maharashtra', 'photo-1512917774080-9991f1c4c750'],
  ['Guest suite in Lonavala', 'Lush green outdoor terrace space.', 'APARTMENT', 7988, 5.0, 11, 'Gold Valley Road', 'Lonavala', 'Maharashtra', 'photo-1580587771525-78b9dba3b914'],
  ['Villa in Lonavala', 'Large luxury villa with private pool.', 'VILLA', 17317, 4.86, 12, 'Ryewoods Road', 'Lonavala', 'Maharashtra', 'photo-1613977257363-707ba9348227'],
  ['Sea view home in Worli', 'Premium sea view home in Mumbai.', 'HOUSE', 11400, 4.97, 18, 'Worli Sea Face', 'Mumbai', 'Maharashtra', 'photo-1600585152915-d208bec867a1'],
  ['Apartment in Bandra', 'Design-led city apartment.', 'APARTMENT', 7200, 4.91, 14, 'Bandra West', 'Mumbai', 'Maharashtra', 'photo-1522708323590-d24dbb6b0267'],
  ['Villa in Koregaon Park', 'Garden villa in Pune.', 'VILLA', 8200, 4.95, 16, 'Koregaon Park', 'Pune', 'Maharashtra', 'photo-1600210492486-724fe5c67fb0'],
  ['Flat in Viman Nagar', 'Cozy apartment with workspace.', 'APARTMENT', 5100, 4.87, 9, 'Viman Nagar', 'Pune', 'Maharashtra', 'photo-1600607687939-ce8a6c25118c'],
  ['Home in Hauz Khas', 'Heritage home in Delhi.', 'HOUSE', 9600, 4.96, 22, 'Hauz Khas', 'New Delhi', 'Delhi', 'photo-1600585154526-990dced4db0d'],
  ['Flat in Connaught Place', 'Central Delhi apartment.', 'APARTMENT', 7400, 4.9, 11, 'Connaught Place', 'New Delhi', 'Delhi', 'photo-1600566753086-00f18fb6b3ea'],
  ['Beach villa in Alibag', 'Beach villa with private pool.', 'VILLA', 14800, 4.99, 25, 'Nagaon Beach', 'Alibag', 'Maharashtra', 'photo-1499793983690-e29da59ef1c2'],
  ['Cottage near Kihim', 'Peaceful cottage near the beach.', 'COTTAGE', 9200, 4.93, 13, 'Kihim Beach', 'Alibag', 'Maharashtra', 'photo-1505693416388-ac5ce068fe85'],
  ['Home in Ballygunge', 'Comfortable home in Kolkata.', 'HOUSE', 7100, 4.9, 10, 'Ballygunge', 'Kolkata', 'West Bengal', 'photo-1600566753190-17f0baa2a6c3'],
]

const properties = seedProperties.map(([title, description, propertyType, pricePerNight, averageRating, reviewCount, address, city, state, imageId], index) => {
  const id = index + 1
  const imageUrl = `https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=900&q=85`
  return {
    id,
    title,
    description,
    propertyType,
    pricePerNight,
    cleaningFee: 500,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3,
    address,
    city,
    state,
    country: 'India',
    zipCode: '400001',
    latitude: 15.552 + index * 0.01,
    longitude: 73.751 + index * 0.01,
    amenities: ['Wifi', 'Kitchen', 'Free parking', 'Air conditioning', 'Dedicated workspace', 'Pool'],
    status: 'ACTIVE',
    averageRating,
    reviewCount,
    hostId: 2,
    host: { id: 2, firstName: 'Goa', lastName: 'Host' },
    categoryId: propertyType === 'VILLA' ? 3 : 1,
    primaryImageUrl: imageUrl,
    images: [{ id: 1, url: imageUrl }],
    createdAt: new Date().toISOString(),
  }
})

const wishlists = new Map()
const bookings = []
const reviews = []
const resetTokens = new Map()

const makeToken = (userId, type = 'access') => `mock_${type}_${userId}_${Date.now()}`
const parseToken = (token) => {
  if (!token?.startsWith('mock_')) return null
  const parts = token.split('_')
  return Number(parts[2]) || null
}

const jwtResponse = (user) => ({
  accessToken: makeToken(user.id, 'access'),
  refreshToken: makeToken(user.id, 'refresh'),
  tokenType: 'Bearer',
  userId: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
  avatar: user.avatar,
  emailVerified: user.emailVerified,
})

const auth = (req, res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  const userId = parseToken(token)
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' })
  const user = users.find(u => u.id === userId)
  if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' })
  req.user = user
  next()
}

const filterProperties = (query) => {
  let result = [...properties]
  if (query.city) {
    const city = query.city.toLowerCase()
    result = result.filter(p => p.city.toLowerCase().includes(city) || city.includes(p.city.toLowerCase()))
  }
  if (query.propertyType) result = result.filter(p => p.propertyType === query.propertyType)
  if (query.guests) result = result.filter(p => p.maxGuests >= Number(query.guests))
  if (query.minPrice) result = result.filter(p => p.pricePerNight >= Number(query.minPrice))
  if (query.maxPrice) result = result.filter(p => p.pricePerNight <= Number(query.maxPrice))
  if (query.bedrooms) result = result.filter(p => p.bedrooms >= Number(query.bedrooms))
  if (query.bathrooms) result = result.filter(p => p.bathrooms >= Number(query.bathrooms))
  if (query.categoryId) result = result.filter(p => p.categoryId === Number(query.categoryId))
  return result
}

// Auth
app.post('/api/v1/auth/register', (req, res) => {
  const { firstName, lastName, email, password, role } = req.body
  if (!firstName || !lastName || !email || !password) return res.status(400).json({ success: false, message: 'All fields are required' })
  if (password.length < 8) return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' })
  if (users.some(u => u.email === email)) return res.status(409).json({ success: false, message: `Email is already registered: ${email}` })
  const user = { id: userIdSeq++, firstName, lastName, email, password, role: role === 'HOST' ? 'HOST' : 'GUEST', avatar: null, emailVerified: false, bio: '', phone: '' }
  users.push(user)
  res.status(201).json(ok('Registration successful', jwtResponse(user)))
})

app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body
  const user = users.find(u => u.email === email && u.password === password)
  if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' })
  res.json(ok('Login successful', jwtResponse(user)))
})

app.post('/api/v1/auth/refresh', (req, res) => {
  const userId = parseToken(req.body.refreshToken)
  const user = users.find(u => u.id === userId)
  if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired refresh token' })
  res.json(ok('Token refreshed', jwtResponse(user)))
})

app.post('/api/v1/auth/forgot-password', (req, res) => {
  const user = users.find(u => u.email === req.body.email)
  if (user) resetTokens.set(user.email, 'reset-token-' + Date.now())
  res.json(ok('If the email exists, a reset link has been sent'))
})

app.post('/api/v1/auth/reset-password', (req, res) => {
  const { token, newPassword } = req.body
  if (!token || !newPassword) return res.status(400).json({ success: false, message: 'Invalid request' })
  const entry = [...resetTokens.entries()].find(([, t]) => t === token)
  if (!entry) return res.status(400).json({ success: false, message: 'Invalid or expired reset token' })
  const user = users.find(u => u.email === entry[0])
  if (user) user.password = newPassword
  resetTokens.delete(entry[0])
  res.json(ok('Password reset successful'))
})

app.get('/api/v1/auth/verify-email', (req, res) => res.json(ok('Email verified')))

// Properties
app.get('/api/v1/properties', (req, res) => {
  const filtered = filterProperties(req.query)
  const pageNum = Number(req.query.page || 0)
  const size = Number(req.query.size || 20)
  const start = pageNum * size
  res.json(ok('Success', page(filtered.slice(start, start + size), pageNum, size)))
})

app.get('/api/v1/properties/featured', (req, res) => res.json(ok('Success', properties.slice(0, 8))))
app.get('/api/v1/properties/top-cities', (req, res) => res.json(ok('Success', ['North Goa', 'Lonavala', 'Mumbai', 'Pune', 'New Delhi', 'Alibag', 'Kolkata'])))

app.get('/api/v1/properties/host/my-listings', auth, (req, res) => {
  const mine = properties.filter(p => p.hostId === req.user.id)
  res.json(ok('Success', page(mine)))
})

app.get('/api/v1/properties/:id', (req, res) => {
  const property = properties.find(p => p.id === Number(req.params.id))
  if (!property) return res.status(404).json({ success: false, message: 'Property not found' })
  res.json(ok('Success', property))
})

app.post('/api/v1/properties', auth, upload.any(), (req, res) => {
  const data = req.body?.data ? JSON.parse(req.body.data) : req.body
  const property = { id: propertyIdSeq++, ...data, hostId: req.user.id, host: { id: req.user.id, firstName: req.user.firstName, lastName: req.user.lastName }, status: 'ACTIVE', averageRating: 0, reviewCount: 0, primaryImageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600', images: [], createdAt: new Date().toISOString() }
  properties.push(property)
  res.status(201).json(ok('Property created', property))
})

app.put('/api/v1/properties/:id', auth, (req, res) => {
  const idx = properties.findIndex(p => p.id === Number(req.params.id) && p.hostId === req.user.id)
  if (idx === -1) return res.status(404).json({ success: false, message: 'Property not found' })
  properties[idx] = { ...properties[idx], ...req.body }
  res.json(ok('Property updated', properties[idx]))
})

app.delete('/api/v1/properties/:id', auth, (req, res) => {
  const idx = properties.findIndex(p => p.id === Number(req.params.id) && p.hostId === req.user.id)
  if (idx === -1) return res.status(404).json({ success: false, message: 'Property not found' })
  properties.splice(idx, 1)
  res.json(ok('Property deleted'))
})

// Categories
app.get('/api/v1/categories', (req, res) => res.json(ok('Success', categories)))

// Bookings
app.post('/api/v1/bookings', auth, (req, res) => {
  const { propertyId, checkIn, checkOut, guests } = req.body
  const property = properties.find(p => p.id === Number(propertyId))
  if (!property) return res.status(404).json({ success: false, message: 'Property not found' })
  const nights = Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000))
  const subtotal = property.pricePerNight * nights
  const serviceFee = Math.round(subtotal * 0.1)
  const booking = { id: bookingIdSeq++, propertyId: property.id, property, guestId: req.user.id, guest: req.user, checkIn, checkOut, guests, numberOfNights: nights, subtotal, serviceFee, cleaningFee: property.cleaningFee, taxes: 0, total: subtotal + serviceFee + property.cleaningFee, status: 'CONFIRMED', createdAt: new Date().toISOString() }
  bookings.push(booking)
  res.status(201).json(ok('Booking created', booking))
})

app.get('/api/v1/bookings/calculate-price', (req, res) => {
  const property = properties.find(p => p.id === Number(req.query.propertyId))
  if (!property) return res.status(404).json({ success: false, message: 'Property not found' })
  const nights = Math.max(1, Math.round((new Date(req.query.checkOut) - new Date(req.query.checkIn)) / 86400000))
  const subtotal = property.pricePerNight * nights
  const serviceFee = Math.round(subtotal * 0.1)
  res.json(ok('Success', { numberOfNights: nights, subtotal, serviceFee, cleaningFee: property.cleaningFee, taxes: 0, total: subtotal + serviceFee + property.cleaningFee }))
})

app.get('/api/v1/bookings/booked-dates/:propertyId', (req, res) => {
  const ranges = bookings.filter(b => b.propertyId === Number(req.params.propertyId) && b.status !== 'CANCELLED').map(b => [b.checkIn, b.checkOut])
  res.json(ok('Success', ranges))
})

app.get('/api/v1/bookings/my-bookings', auth, (req, res) => {
  const mine = bookings.filter(b => b.guestId === req.user.id)
  res.json(ok('Success', page(mine)))
})

app.get('/api/v1/bookings/host/reservations', auth, (req, res) => {
  const hostPropertyIds = properties.filter(p => p.hostId === req.user.id).map(p => p.id)
  const mine = bookings.filter(b => hostPropertyIds.includes(b.propertyId))
  res.json(ok('Success', page(mine)))
})

app.get('/api/v1/bookings/:id', auth, (req, res) => {
  const booking = bookings.find(b => b.id === Number(req.params.id))
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' })
  res.json(ok('Success', booking))
})

app.post('/api/v1/bookings/:id/cancel', auth, (req, res) => {
  const booking = bookings.find(b => b.id === Number(req.params.id) && b.guestId === req.user.id)
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' })
  booking.status = 'CANCELLED'
  res.json(ok('Booking cancelled', booking))
})

// Wishlist
app.post('/api/v1/wishlist/:propertyId/toggle', auth, (req, res) => {
  const propertyId = Number(req.params.propertyId)
  const key = req.user.id
  const list = wishlists.get(key) || new Set()
  const wishlisted = list.has(propertyId)
  if (wishlisted) list.delete(propertyId)
  else list.add(propertyId)
  wishlists.set(key, list)
  res.json(ok('Success', { wishlisted: !wishlisted }))
})

app.get('/api/v1/wishlist', auth, (req, res) => {
  const list = wishlists.get(req.user.id) || new Set()
  const content = properties.filter(p => list.has(p.id))
  res.json(ok('Success', page(content)))
})

app.get('/api/v1/wishlist/:propertyId/status', auth, (req, res) => {
  const list = wishlists.get(req.user.id) || new Set()
  res.json(ok('Success', { wishlisted: list.has(Number(req.params.propertyId)) }))
})

// Users
app.get('/api/v1/users/me', auth, (req, res) => {
  const { password, ...user } = req.user
  res.json(ok('Success', user))
})

app.put('/api/v1/users/me', auth, (req, res) => {
  Object.assign(req.user, req.body)
  const { password, ...user } = req.user
  res.json(ok('Profile updated', user))
})

app.post('/api/v1/users/me/avatar', auth, (req, res) => {
  req.user.avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
  const { password, ...user } = req.user
  res.json(ok('Avatar uploaded', user))
})

app.post('/api/v1/users/me/change-password', auth, (req, res) => {
  if (req.body.currentPassword !== req.user.password) return res.status(400).json({ success: false, message: 'Current password is incorrect' })
  req.user.password = req.body.newPassword
  res.json(ok('Password changed'))
})

// Reviews
app.get('/api/v1/reviews/property/:propertyId', (req, res) => {
  const content = reviews.filter(r => r.propertyId === Number(req.params.propertyId))
  res.json(ok('Success', page(content)))
})

app.post('/api/v1/reviews', auth, (req, res) => {
  const review = { id: reviewIdSeq++, ...req.body, guest: { firstName: req.user.firstName, lastName: req.user.lastName }, createdAt: new Date().toISOString() }
  reviews.push(review)
  res.status(201).json(ok('Review created', review))
})

// Admin
app.get('/api/v1/admin/dashboard/stats', auth, (req, res) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ success: false, message: 'Forbidden' })
  res.json(ok('Success', { totalUsers: users.length, totalProperties: properties.length, totalBookings: bookings.length, totalRevenue: bookings.reduce((s, b) => s + b.total, 0) }))
})

app.get('/api/v1/admin/users', auth, (req, res) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ success: false, message: 'Forbidden' })
  res.json(ok('Success', page(users.map(({ password, ...u }) => u))))
})

app.listen(PORT, () => {
  console.log(`Airbnb mock API running at http://localhost:${PORT}`)
  console.log('Test accounts: admin@airbnb.com / host@airbnb.com — Password123')
})
