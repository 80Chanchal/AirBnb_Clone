import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { propertyService } from '../services/propertyService'
import { bookingService } from '../services/bookingService'
import { FiPlus, FiEdit, FiTrash, FiCalendar, FiUsers, FiDollarSign } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Modal from '../components/common/Modal'

export default function HostDashboardPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editListing, setEditListing] = useState(null)
  
  // Create Property Form State
  const [formData, setFormData] = useState({
    title: '', description: '', propertyType: 'APARTMENT',
    pricePerNight: '', cleaningFee: '', maxGuests: 1,
    bedrooms: 1, bathrooms: 1, address: '', city: '',
    state: '', country: '', zipCode: '', latitude: 40.7128, longitude: -74.0060
  })
  const [selectedImages, setSelectedImages] = useState([])

  const { data: listings, isLoading: listingsLoading } = useQuery({
    queryKey: ['host-listings'],
    queryFn: () => propertyService.getMyListings({ page: 0, size: 50 }).then(res => res.content),
  })

  const { data: reservations, isLoading: reservationsLoading } = useQuery({
    queryKey: ['host-reservations'],
    queryFn: () => bookingService.getReservations({ page: 0, size: 50 }).then(res => res.content),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => propertyService.delete(id),
    onSuccess: () => {
      toast.success('Listing deleted')
      queryClient.invalidateQueries({ queryKey: ['host-listings'] })
    },
    onError: () => toast.error('Failed to delete listing')
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setSelectedImages(Array.from(e.target.files))
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    const loadingToast = toast.loading('Creating listing...')
    try {
      const dataPayload = {
        ...formData,
        pricePerNight: Number(formData.pricePerNight),
        cleaningFee: Number(formData.cleaningFee || 0),
        maxGuests: Number(formData.maxGuests),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        amenities: ['Wifi', 'Kitchen', 'Air conditioning'] // default list
      }
      
      const multipartForm = new FormData()
      multipartForm.append('data', new Blob([JSON.stringify(dataPayload)], { type: 'application/json' }))
      selectedImages.forEach(img => multipartForm.append('images', img))

      await propertyService.create(multipartForm)
      toast.dismiss(loadingToast)
      toast.success('Listing created successfully!')
      setIsModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['host-listings'] })
    } catch (err) {
      toast.dismiss(loadingToast)
      toast.error('Failed to create property listing')
    }
  }

  return (
    <div className="section py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold">Host Dashboard</h1>
          <p className="text-sm text-brand-gray dark:text-dark-muted mt-1">Manage listings and monitor reservation activities</p>
        </div>
        <button
          onClick={() => { setEditListing(null); setIsModalOpen(true) }}
          className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2"
        >
          <FiPlus /> Add New Listing
        </button>
      </div>

      {/* Analytics stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card p-6 border border-brand-border dark:border-dark-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-brand-pink text-xl"><FiDollarSign /></div>
          <div>
            <h3 className="text-2xl font-bold font-display">${listings?.reduce((sum, item) => sum + item.pricePerNight, 0) || 0}</h3>
            <p className="text-xs text-brand-gray">Est. Portfolio Value</p>
          </div>
        </div>
        <div className="card p-6 border border-brand-border dark:border-dark-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500 text-xl"><FiPlus /></div>
          <div>
            <h3 className="text-2xl font-bold font-display">{listings?.length || 0}</h3>
            <p className="text-xs text-brand-gray">Total Properties</p>
          </div>
        </div>
        <div className="card p-6 border border-brand-border dark:border-dark-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 text-xl"><FiCalendar /></div>
          <div>
            <h3 className="text-2xl font-bold font-display">{reservations?.length || 0}</h3>
            <p className="text-xs text-brand-gray">Bookings / Reservations</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Listings column */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold font-display mb-4">Your Listings</h2>
          {listingsLoading ? (
            <p>Loading listings...</p>
          ) : listings?.length === 0 ? (
            <p className="text-brand-gray">No listings added yet.</p>
          ) : (
            <div className="space-y-4">
              {listings.map(property => (
                <div key={property.id} className="card p-4 border border-brand-border dark:border-dark-border flex gap-4 items-center">
                  <img src={property.primaryImageUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200'} className="w-20 h-20 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{property.title}</h3>
                    <p className="text-xs text-brand-gray">{property.city}, {property.country}</p>
                    <p className="text-xs font-bold mt-1">${property.pricePerNight} / night</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { if(confirm('Delete listing?')) deleteMutation.mutate(property.id) }}
                      className="p-2 border border-brand-border hover:border-red-500 dark:border-dark-border rounded-lg text-brand-gray hover:text-red-500 transition-colors"
                    >
                      <FiTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reservations column */}
        <div>
          <h2 className="text-xl font-bold font-display mb-4">Incoming Reservations</h2>
          {reservationsLoading ? (
            <p>Loading reservations...</p>
          ) : reservations?.length === 0 ? (
            <p className="text-brand-gray">No bookings received yet.</p>
          ) : (
            <div className="space-y-4">
              {reservations.map(res => (
                <div key={res.id} className="card p-4 border border-brand-border dark:border-dark-border space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-xs truncate max-w-[150px]">{res.property?.title}</h4>
                      <p className="text-[10px] text-brand-gray">Guest: {res.guest?.firstName} {res.guest?.lastName}</p>
                    </div>
                    <span className="badge-success text-[10px] py-0.5 px-2">{res.status}</span>
                  </div>
                  <div className="text-[10px] text-brand-gray flex justify-between pt-1 border-t border-brand-border dark:border-dark-border">
                    <span>{new Date(res.checkIn).toLocaleDateString()} - {new Date(res.checkOut).toLocaleDateString()}</span>
                    <span><b>Total:</b> ${res.totalPrice}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal listing editor */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Listing"
        size="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="input-field py-2" />
            </div>
            <div>
              <label className="input-label">Property Type</label>
              <select name="propertyType" value={formData.propertyType} onChange={handleInputChange} className="input-field py-2">
                <option value="APARTMENT">APARTMENT</option>
                <option value="HOUSE">HOUSE</option>
                <option value="VILLA">VILLA</option>
                <option value="CABIN">CABIN</option>
              </select>
            </div>
          </div>

          <div>
            <label className="input-label">Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" required className="input-field" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="input-label">Price per night</label>
              <input type="number" name="pricePerNight" value={formData.pricePerNight} onChange={handleInputChange} required className="input-field py-2" />
            </div>
            <div>
              <label className="input-label">Cleaning fee</label>
              <input type="number" name="cleaningFee" value={formData.cleaningFee} onChange={handleInputChange} className="input-field py-2" />
            </div>
            <div>
              <label className="input-label">Max guests</label>
              <input type="number" name="maxGuests" value={formData.maxGuests} onChange={handleInputChange} required className="input-field py-2" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="input-label">Bedrooms</label>
              <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} required className="input-field py-2" />
            </div>
            <div>
              <label className="input-label">Bathrooms</label>
              <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} required className="input-field py-2" />
            </div>
            <div>
              <label className="input-label">Zip code</label>
              <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="input-field py-2" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="input-label">City</label>
              <input type="text" name="city" value={formData.city} onChange={handleInputChange} required className="input-field py-2" />
            </div>
            <div>
              <label className="input-label">State</label>
              <input type="text" name="state" value={formData.state} onChange={handleInputChange} required className="input-field py-2" />
            </div>
            <div>
              <label className="input-label">Country</label>
              <input type="text" name="country" value={formData.country} onChange={handleInputChange} required className="input-field py-2" />
            </div>
          </div>

          <div>
            <label className="input-label">Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleInputChange} required className="input-field py-2" />
          </div>

          <div>
            <label className="input-label">Property Images</label>
            <input type="file" onChange={handleFileChange} multiple required className="input-field py-2" accept="image/*" />
          </div>

          <button type="submit" className="btn-primary w-full py-2.5">
            Submit Listing
          </button>
        </form>
      </Modal>
    </div>
  )
}
