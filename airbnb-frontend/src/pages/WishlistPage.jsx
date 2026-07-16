import { useQuery } from '@tanstack/react-query'
import { wishlistService } from '../services/services'
import PropertyCard from '../components/property/PropertyCard'
import { PropertyGridSkeleton } from '../components/common/Skeleton'
import { Link } from 'react-router-dom'

export default function WishlistPage() {
  const { data: wishlistData, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishlistService.getAll({ page: 0, size: 50 }),
  })

  return (
    <div className="section py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-display font-bold">Saved Stays</h1>
        <p className="text-sm text-brand-gray dark:text-dark-muted mt-1">Stays you've saved to your wishlist</p>
      </div>

      {isLoading ? (
        <PropertyGridSkeleton count={4} />
      ) : wishlistData?.content?.length === 0 ? (
        <div className="text-center py-20 bg-brand-light dark:bg-dark-surface rounded-3xl p-6">
          <div className="text-4xl mb-4">❤️</div>
          <h3 className="text-lg font-semibold mb-2">No saved stays</h3>
          <p className="text-brand-gray dark:text-dark-muted max-w-sm mx-auto mb-6">
            Click the heart icon on any property card to save it here for later.
          </p>
          <Link to="/properties" className="btn-primary py-2 px-6">Explore homes</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistData?.content?.map((property, idx) => (
            <PropertyCard key={property.id} property={property} index={idx} />
          ))}
        </div>
      )}
    </div>
  )
}
