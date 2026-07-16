import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { bookingService } from '../services/bookingService'
import { FiCalendar, FiMapPin, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi'
import { BookingCardSkeleton } from '../components/common/Skeleton'

export default function BookingHistoryPage() {
  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => bookingService.getMyBookings({ page: 0, size: 50 }),
  })

  return (
    <div className="section py-12 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold">Your Trips</h1>
          <p className="text-sm text-brand-gray dark:text-dark-muted mt-1">Manage your active and completed reservations</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <BookingCardSkeleton />
          <BookingCardSkeleton />
        </div>
      ) : bookingsData?.content?.length === 0 ? (
        <div className="text-center py-20 bg-brand-light dark:bg-dark-surface rounded-3xl p-6">
          <div className="text-4xl mb-4">🧳</div>
          <h3 className="text-lg font-semibold mb-2">No trips booked yet</h3>
          <p className="text-brand-gray dark:text-dark-muted max-w-sm mx-auto mb-6">
            When you're ready to start planning your next getaway, we're here to help.
          </p>
          <Link to="/properties" className="btn-primary py-2 px-6">Explore homes</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookingsData?.content?.map(booking => {
            const isConfirmed = booking.status === 'CONFIRMED'
            const isCancelled = booking.status === 'CANCELLED'

            return (
              <div key={booking.id} className="card p-6 border border-brand-border dark:border-dark-border hover:shadow-card transition-all">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Property Image */}
                  <div className="w-full md:w-44 h-32 rounded-xl overflow-hidden shrink-0">
                    <img
                      src={booking.property?.primaryImageUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'}
                      alt={booking.property?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Booking details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="font-semibold text-lg font-display">{booking.property?.title}</h2>
                        <p className="text-xs text-brand-gray dark:text-dark-muted flex items-center gap-1">
                          <FiMapPin /> {booking.property?.city}, {booking.property?.country}
                        </p>
                      </div>
                      <div className="shrink-0">
                        {isConfirmed && <span className="badge-success text-xs py-1 px-2.5 flex items-center gap-1"><FiCheckCircle /> Confirmed</span>}
                        {isCancelled && <span className="badge-danger text-xs py-1 px-2.5 flex items-center gap-1"><FiAlertCircle /> Cancelled</span>}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-brand-gray border-t border-brand-border dark:border-dark-border pt-3 mt-2">
                      <div className="flex items-center gap-1">
                        <FiCalendar /> {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                      </div>
                      <div>
                        <b>Total:</b> ${booking.totalPrice}
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center justify-end shrink-0">
                    <Link to={`/bookings/${booking.id}`} className="btn-secondary py-2 px-4 text-xs w-full md:w-auto text-center">
                      View details
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
