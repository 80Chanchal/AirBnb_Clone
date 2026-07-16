import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { FiStar, FiMapPin, FiWifi, FiCheck, FiShare, FiHeart, FiAward, FiKey, FiShield, FiMessageSquare, FiTag, FiMap, FiSearch, FiX } from 'react-icons/fi'
import { propertyService } from '../services/propertyService'
import { reviewService } from '../services/services'
import { useAuth } from '../context/AuthContext'
import StarRating from '../components/common/StarRating'
import BookingWidget from '../components/booking/BookingWidget'

const demoProperty = (id) => {
  const place = Number(id) <= -600 ? ['Alibag', [18.6414, 72.8722]] : Number(id) <= -500 ? ['New Delhi', [28.6139, 77.2090]] : Number(id) <= -400 ? ['Pune', [18.5204, 73.8567]] : Number(id) <= -300 ? ['Mumbai', [19.0760, 72.8777]] : Number(id) <= -200 ? ['Lonavala', [18.7546, 73.4062]] : ['North Goa', [15.4909, 73.8278]]
  const [city, [latitude, longitude]] = place
  const images = [
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=85',
  ]
  return { id: Number(id), title: `Beautiful stay in ${city}`, city, country: 'India', address: `${city}, India`, latitude, longitude, primaryImageUrl: images[0], images: images.map((url, index) => ({ id: index + 1, url })), pricePerNight: 7500, averageRating: 4.92, reviewCount: 24, bedrooms: 2, bathrooms: 2, maxGuests: 4, amenities: ['Fast wifi', 'Kitchen', 'Free parking', 'Air conditioning', 'Dedicated workspace', 'Pool'], host: { firstName: 'Ananya', lastName: 'Sharma' }, description: `Relax in this thoughtfully designed home in ${city}. The stay has comfortable spaces for families and friends, a fully equipped kitchen, and a convenient location close to local attractions.` }
}

const ratingCategories = [
  { label: 'Cleanliness', icon: FiCheck }, { label: 'Accuracy', icon: FiAward },
  { label: 'Check-in', icon: FiKey }, { label: 'Communication', icon: FiMessageSquare },
  { label: 'Location', icon: FiMap }, { label: 'Value', icon: FiTag },
]
const reviewTopics = ['Hospitality', 'Outdoor spaces', 'View', 'Comfort']
const demoReviews = [
  { id: 'demo-1', rating: 5, guest: { firstName: 'Vasvi', lastName: '' }, createdAt: '2026-07-13', comment: 'A wonderful stay with a welcoming host and a beautiful place for friends and family. It was private, peaceful, and check-in was effortless.', topic: 'Hospitality' },
  { id: 'demo-2', rating: 5, guest: { firstName: 'Sidhartha', lastName: '' }, createdAt: '2026-07-08', comment: 'The property feels secluded while still being convenient for local markets. The outdoor spaces and views make this a memorable weekend stay.', topic: 'Outdoor spaces' },
  { id: 'demo-3', rating: 5, guest: { firstName: 'Vedika', lastName: '' }, createdAt: '2026-07-07', comment: 'We had a lovely stay. The home is comfortable, very clean, and surrounded by a peaceful atmosphere that made our time feel special.', topic: 'Comfort' },
  { id: 'demo-4', rating: 5, guest: { firstName: 'Naseemunissa', lastName: '' }, createdAt: '2026-06-01', comment: 'There are places you visit and enjoy, and then there are places that stay with you even after you leave. This was definitely one of those places.', topic: 'View' },
]

export default function PropertyDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [reviewsPage, setReviewsPage] = useState(0)
  const [selectedTopic, setSelectedTopic] = useState('')
  const [expandedReviews, setExpandedReviews] = useState([])
  const [photosOpen, setPhotosOpen] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [id])

  const { data: property, isLoading: propertyLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => Number(id) < 0 ? Promise.resolve(demoProperty(id)) : propertyService.getById(id),
  })

  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['property-reviews', id, reviewsPage],
    queryFn: () => reviewService.getPropertyReviews(id, { page: reviewsPage, size: 5 }),
    enabled: Number(id) > 0,
  })

  if (propertyLoading) {
    return (
      <div className="section py-12 space-y-8">
        <div className="skeleton h-8 w-1/3 rounded-lg" />
        <div className="grid grid-cols-4 gap-4 h-96">
          <div className="col-span-2 skeleton rounded-2xl h-full" />
          <div className="skeleton rounded-2xl h-full" />
          <div className="skeleton rounded-2xl h-full" />
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="section py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Property not found</h2>
        <Link to="/properties" className="btn-primary">Back to Listings</Link>
      </div>
    )
  }

  const mainImage = property.primaryImageUrl || (property.images?.length > 0 ? property.images[0].url : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200')
  const galleryImages = property.images?.length ? property.images : [{ id: 'primary', url: mainImage }]
  const gallerySlots = [...galleryImages, ...Array.from({ length: Math.max(0, 5 - galleryImages.length) }, (_, index) => ({ id: `fallback-${index}`, url: mainImage }))].slice(0, 5)
  const coordinates = [property.latitude || 40.7128, property.longitude || -74.0060]
  const allReviews = Number(id) < 0 ? demoReviews : (reviewsData?.content || []).map((review, index) => ({ ...review, topic: reviewTopics[index % reviewTopics.length] }))
  const visibleReviews = selectedTopic ? allReviews.filter(review => review.topic === selectedTopic) : allReviews
  const rating = property.averageRating?.toFixed(1) || 'New'
  const toggleReview = reviewId => setExpandedReviews(current => current.includes(reviewId) ? current.filter(id => id !== reviewId) : [...current, reviewId])

  return (
    <div className="bg-white text-brand-dark">
    <div className="section py-6 sm:py-8">
      {/* Title Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div><h1 className="text-2xl sm:text-3xl font-display font-bold mb-2">{property.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-brand-gray">
          {property.averageRating > 0 && (
            <div className="flex items-center gap-1">
              <FiStar className="text-amber-400 fill-amber-400" />
              <span className="font-semibold text-brand-dark">{property.averageRating.toFixed(1)}</span>
              <span>· {property.reviewCount} reviews</span>
            </div>
          )}
          <span className="flex items-center gap-1">
            <FiMapPin /> {property.address}, {property.city}, {property.country}
          </span>
        </div></div>
        <div className="hidden shrink-0 items-center gap-4 sm:flex"><button type="button" onClick={() => navigator.clipboard?.writeText(window.location.href)} className="flex items-center gap-2 text-sm font-semibold underline"><FiShare /> Share</button><button type="button" onClick={() => setSaved(value => !value)} className="flex items-center gap-2 text-sm font-semibold underline"><FiHeart className={saved ? 'fill-brand-pink text-brand-pink' : ''} /> {saved ? 'Saved' : 'Save'}</button></div>
      </div>

      {/* Grid Image Gallery */}
      <div className="grid h-[280px] grid-cols-1 gap-2 overflow-hidden rounded-2xl sm:h-[380px] sm:gap-3 md:h-[500px] md:grid-cols-4 md:grid-rows-2 mb-8">
        <div className="h-full overflow-hidden md:col-span-2 md:row-span-2">
          <img src={mainImage} alt={property.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        </div>
        {gallerySlots.slice(1, 5).map((img, idx) => (
          <div key={img.id} className="relative hidden h-full overflow-hidden md:block">
            <img src={img.url} alt={property.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            {idx === 3 && <button type="button" onClick={() => setPhotosOpen(true)} className="absolute bottom-4 right-4 rounded-lg bg-white px-4 py-2 text-sm font-semibold shadow-card">Show all photos</button>}
          </div>
        ))}
      </div>

      {/* Grid details and Booking widget */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(320px,0.8fr)] gap-8 lg:gap-16">
        {/* Info Column */}
        <div className="space-y-8">
          <div className="flex items-center justify-between pb-6 border-b border-brand-border">
            <div>
              <h2 className="text-xl font-bold">Entire home in {property.city}, {property.country}</h2>
              <p className="text-sm text-brand-gray">
                {property.maxGuests} guests · {property.bedrooms} bedrooms · {property.bathrooms} bathrooms
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-brand flex items-center justify-center overflow-hidden text-white font-bold text-lg">
              {property.host?.avatar ? (
                <img src={property.host.avatar} alt="host" className="w-full h-full object-cover" />
              ) : (
                property.host?.firstName?.[0]?.toUpperCase()
              )}
            </div>
          </div>

          <div className="space-y-5 border-b border-brand-border pb-8">
            {[{ icon: FiAward, title: 'Guest favourite', text: 'One of the most loved homes on Airbnb, according to guests.' }, { icon: FiKey, title: 'Self check-in', text: 'Check yourself in with the smart lock.' }, { icon: FiShield, title: 'Free cancellation for 48 hours', text: 'Get a full refund if you change your plans.' }].map(item => <div key={item.title} className="flex gap-4"><item.icon className="mt-1 shrink-0 text-2xl" /><div><h3 className="font-semibold">{item.title}</h3><p className="text-sm text-brand-gray">{item.text}</p></div></div>)}
          </div>

          {/* Description */}
          <div className="pb-8 border-b border-brand-border">
            <h3 className="font-display font-bold text-lg mb-3">About this space</h3>
            <p className="text-brand-gray leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          <div className="pb-8 border-b border-brand-border">
            <h3 className="font-display font-bold text-lg mb-4">What this place offers</h3>
            <div className="grid grid-cols-2 gap-4">
              {property.amenities?.map(amenity => (
                <div key={amenity} className="flex items-center gap-3 text-sm">
                  <FiCheck className="text-green-500 text-lg" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location Map */}
          <div className="pb-8 border-b border-brand-border">
            <h3 className="font-display font-bold text-lg mb-4">Where you'll be</h3>
            <div className="h-64 md:h-80 rounded-2xl overflow-hidden border border-brand-border">
              <MapContainer center={coordinates} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <CircleMarker center={coordinates} radius={12} pathOptions={{ color: '#ffffff', fillColor: '#FF385C', fillOpacity: 1, weight: 4 }}>
                  <Popup>{property.title}</Popup>
                </CircleMarker>
              </MapContainer>
            </div>
          </div>

          {/* Guest favourite ratings */}
          <section className="border-t border-brand-border pt-10">
            <div className="mx-auto max-w-2xl text-center">
              <div className="flex items-center justify-center gap-5"><FiAward className="h-11 w-11" /><span className="text-6xl font-bold tracking-tight">{rating}</span><FiAward className="h-11 w-11" /></div>
              <h3 className="mt-5 text-2xl font-semibold">Guest favourite</h3>
              <p className="mx-auto mt-2 max-w-md text-brand-gray">This home is a guest favourite based on ratings, reviews and reliability.</p>
            </div>
            <div className="mt-10 grid grid-cols-2 border-y border-brand-border sm:grid-cols-4 lg:grid-cols-7">
              <div className="border-b border-brand-border p-4 sm:col-span-2 sm:border-b-0 lg:col-span-1 lg:border-r"><p className="text-sm font-semibold">Overall rating</p><p className="mt-1 text-xl font-semibold">{rating}</p><div className="mt-2 space-y-1">{[5, 4, 3, 2, 1].map(value => <div key={value} className="flex items-center gap-2 text-[10px]"><span>{value}</span><span className="h-1 flex-1 rounded-full bg-brand-dark" style={{ opacity: value === 5 ? 1 : 0.15 }} /></div>)}</div></div>
              {ratingCategories.map(({ label, icon: Icon }) => <div key={label} className="border-b border-brand-border p-4 even:border-l sm:border-b-0 lg:border-l"><p className="text-sm font-semibold">{label}</p><p className="mt-1 text-xl font-semibold">{rating}</p><Icon className="mt-5 h-7 w-7" /></div>)}
            </div>
            <div className="mt-7 flex flex-wrap gap-2">{reviewTopics.map((topic, index) => <button type="button" key={topic} onClick={() => setSelectedTopic(current => current === topic ? '' : topic)} className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${selectedTopic === topic ? 'border-brand-dark bg-brand-dark text-white' : 'border-brand-border bg-white hover:border-brand-dark'}`}>{['🎁', '🌄', '🖼️', '🛋️'][index]} {topic} <span className="opacity-70">{allReviews.filter(review => review.topic === topic).length}</span></button>)}</div>
          </section>

          {/* Reviews section */}
          <div className="border-t border-brand-border pt-10">
            <h3 className="font-display font-bold text-2xl mb-6 flex items-center gap-2">
              <FiStar className="text-amber-400 fill-amber-400" />
              <span>{property.averageRating ? property.averageRating.toFixed(1) : 'No reviews'} · {property.reviewCount} reviews</span>
            </h3>
            {reviewsLoading ? (
              <div className="space-y-4">
                <div className="skeleton h-16 w-full" />
                <div className="skeleton h-16 w-full" />
              </div>
            ) : visibleReviews.length === 0 ? (
              <p className="text-brand-gray">No reviews match this topic yet.</p>
            ) : (
              <div className="grid gap-x-16 gap-y-10 sm:grid-cols-2">
                {visibleReviews.map(review => (
                  <div key={review.id} className="space-y-2 pb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-light dark:bg-dark-surface flex items-center justify-center font-bold">
                          {review.guest?.avatar ? <img src={review.guest.avatar} className="w-full h-full rounded-full object-cover" /> : review.guest?.firstName?.[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{review.guest?.firstName} {review.guest?.lastName}</p>
                          <p className="text-xs text-brand-gray">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <StarRating rating={review.rating} showValue={false} />
                    </div>
                    <p className="text-sm text-brand-gray leading-relaxed">{expandedReviews.includes(review.id) || review.comment?.length <= 180 ? review.comment : `${review.comment.slice(0, 180)}…`}</p>
                    {review.comment?.length > 180 && <button type="button" onClick={() => toggleReview(review.id)} className="text-sm font-semibold underline">{expandedReviews.includes(review.id) ? 'Show less' : 'Show more'}</button>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Booking Widget column */}
        <div>
          <BookingWidget property={property} />
        </div>
      </div>
    {photosOpen && <div className="fixed inset-0 z-[100] overflow-y-auto bg-white p-5 sm:p-10"><div className="mx-auto max-w-5xl"><div className="sticky top-0 z-10 mb-6 flex items-center justify-between bg-white py-3"><h2 className="text-xl font-semibold">{property.title} photos</h2><button type="button" onClick={() => setPhotosOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-brand-border"><FiX /></button></div><div className="grid gap-4 sm:grid-cols-2">{gallerySlots.map(image => <img key={image.id} src={image.url} alt={property.title} className="w-full rounded-xl object-cover" />)}</div></div></div>}
    </div>
    </div>
  )
}
