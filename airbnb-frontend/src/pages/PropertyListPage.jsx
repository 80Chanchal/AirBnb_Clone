import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { FiFilter, FiSliders, FiX, FiCheck } from 'react-icons/fi'
import { propertyService } from '../services/propertyService'
import { categoryService } from '../services/services'
import PropertyCard from '../components/property/PropertyCard'
import SearchBar from '../components/property/SearchBar'
import { PropertyGridSkeleton } from '../components/common/Skeleton'
import { getDemoListings } from '../data/demoListings'

const AMENITIES_LIST = [
  'Wifi', 'Kitchen', 'Free parking', 'Air conditioning', 'Dedicated workspace',
  'Pool', 'Hot tub', 'Gym', 'Washing machine', 'Dryer', 'TV', 'Crib', 'Pet friendly'
]

const PROPERTY_TYPES = [
  'APARTMENT', 'HOUSE', 'VILLA', 'CABIN', 'COTTAGE', 'CONDO', 'TOWNHOUSE'
]

export default function PropertyListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Filters State from Search Params
  const city = searchParams.get('city') || ''
  const categoryId = searchParams.get('categoryId') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const guests = searchParams.get('guests') || ''
  const bedrooms = searchParams.get('bedrooms') || ''
  const bathrooms = searchParams.get('bathrooms') || ''
  const propertyType = searchParams.get('propertyType') || ''
  const selectedAmenities = searchParams.getAll('amenities')

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  })

  // Build API query parameters
  const apiParams = {
    city,
    categoryId: categoryId || undefined,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
    guests: guests || undefined,
    bedrooms: bedrooms || undefined,
    bathrooms: bathrooms || undefined,
    propertyType: propertyType || undefined,
    amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
    page: 0,
    size: 20
  }

  const { data: propertiesData, isLoading } = useQuery({
    queryKey: ['properties-list', apiParams],
    queryFn: () => propertyService.search(apiParams),
  })
  const displayedProperties = propertiesData?.content?.length ? propertiesData.content : getDemoListings(propertyType)

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams)
    if (value === undefined || value === null || value === '') {
      newParams.delete(key)
    } else {
      newParams.set(key, value)
    }
    setSearchParams(newParams)
  }

  const toggleAmenity = (amenity) => {
    const newParams = new URLSearchParams(searchParams)
    const current = newParams.getAll('amenities')
    if (current.includes(amenity)) {
      // Remove specific values by re-adding others
      newParams.delete('amenities')
      current.filter(a => a !== amenity).forEach(a => newParams.append('amenities', a))
    } else {
      newParams.append('amenities', amenity)
    }
    setSearchParams(newParams)
  }

  const clearFilters = () => {
    setSearchParams(new URLSearchParams())
  }

  const filtersContent = (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h4 className="font-semibold text-brand-dark dark:text-white mb-3">Price Range</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={e => updateParam('minPrice', e.target.value)}
            className="input-field py-2"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={e => updateParam('maxPrice', e.target.value)}
            className="input-field py-2"
          />
        </div>
      </div>

      {/* Rooms and Beds */}
      <div>
        <h4 className="font-semibold text-brand-dark dark:text-white mb-3">Rooms and Beds</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Guests</span>
            <input
              type="number"
              min="1"
              value={guests}
              onChange={e => updateParam('guests', e.target.value)}
              className="input-field py-1 px-3 w-20 text-center"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Bedrooms</span>
            <input
              type="number"
              min="1"
              value={bedrooms}
              onChange={e => updateParam('bedrooms', e.target.value)}
              className="input-field py-1 px-3 w-20 text-center"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Bathrooms</span>
            <input
              type="number"
              min="1"
              value={bathrooms}
              onChange={e => updateParam('bathrooms', e.target.value)}
              className="input-field py-1 px-3 w-20 text-center"
            />
          </div>
        </div>
      </div>

      {/* Property Type */}
      <div>
        <h4 className="font-semibold text-brand-dark dark:text-white mb-3">Property Type</h4>
        <select
          value={propertyType}
          onChange={e => updateParam('propertyType', e.target.value)}
          className="input-field"
        >
          <option value="">Any Type</option>
          {PROPERTY_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Amenities */}
      <div>
        <h4 className="font-semibold text-brand-dark dark:text-white mb-3">Amenities</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {AMENITIES_LIST.map(amenity => {
            const checked = selectedAmenities.includes(amenity)
            return (
              <label key={amenity} className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleAmenity(amenity)}
                  className="hidden"
                />
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-brand-pink border-brand-pink text-white' : 'border-brand-border dark:border-dark-border'}`}>
                  {checked && <FiCheck className="text-[10px]" />}
                </div>
                <span>{amenity}</span>
              </label>
            )
          })}
        </div>
      </div>

      <button onClick={clearFilters} className="btn-secondary w-full py-2">
        Clear All Filters
      </button>
    </div>
  )

  return (
    <div className="section py-8">
      {/* Category selector */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-brand-border dark:border-dark-border no-scrollbar">
        <button
          onClick={() => updateParam('categoryId', '')}
          className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all whitespace-nowrap ${!categoryId ? 'bg-brand-pink border-brand-pink text-white shadow-brand' : 'border-brand-border hover:border-brand-pink dark:border-dark-border'}`}
        >
          All Homes
        </button>
        {categories?.map(cat => (
          <button
            key={cat.id}
            onClick={() => updateParam('categoryId', cat.id)}
            className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all whitespace-nowrap ${Number(categoryId) === cat.id ? 'bg-brand-pink border-brand-pink text-white shadow-brand' : 'border-brand-border hover:border-brand-pink dark:border-dark-border'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="card p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-border dark:border-dark-border">
              <span className="font-display font-bold text-lg flex items-center gap-2"><FiFilter /> Filters</span>
            </div>
            {filtersContent}
          </div>
        </aside>

        {/* Main listings area */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold">
              {displayedProperties.length} properties found
            </h2>
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden btn-secondary flex items-center gap-2 px-4 py-2 text-sm"
            >
              <FiSliders /> Filters
            </button>
          </div>

          {isLoading ? (
            <PropertyGridSkeleton count={6} />
          ) : displayedProperties.length === 0 ? (
            <div className="text-center py-20 bg-brand-light dark:bg-dark-surface rounded-3xl p-6">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-lg font-semibold mb-2">No listings found</h3>
              <p className="text-brand-gray dark:text-dark-muted max-w-sm mx-auto mb-4">
                We couldn't find any homes matching your criteria. Try adjusting your filters or location search.
              </p>
              <button onClick={clearFilters} className="btn-primary py-2 px-4 text-sm">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayedProperties.map((property, idx) => (
                <PropertyCard key={property.id} property={property} index={idx} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-dark-card shadow-modal overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-border dark:border-dark-border">
                <span className="font-display font-bold text-lg">Filters</span>
                <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-brand-light dark:hover:bg-dark-surface rounded-full">
                  <FiX />
                </button>
              </div>
              {filtersContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
