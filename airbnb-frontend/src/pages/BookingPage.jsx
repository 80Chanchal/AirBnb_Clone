import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookingService } from '../services/bookingService'
import { reviewService } from '../services/services'
import { FiCheckCircle, FiCalendar, FiClock, FiAlertCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'
import StarRating, { InteractiveStarRating } from '../components/common/StarRating'

export default function BookingPage() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [reviewLoading, setReviewLoading] = useState(false)

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingService.getById(id),
  })

  const cancelMutation = useMutation({
    mutationFn: () => bookingService.cancel(id, 'User cancelled stay'),
    onSuccess: () => {
      toast.success('Reservation cancelled')
      queryClient.invalidateQueries({ queryKey: ['booking', id] })
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Cancellation failed')
    }
  })

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    setReviewLoading(true)
    try {
      await reviewService.create({
        bookingId: booking.id,
        rating,
        comment,
        cleanlinessRating: rating,
        accuracyRating: rating,
        communicationRating: rating,
        locationRating: rating,
        valueRating: rating
      })
      toast.success('Thank you for your review!')
      queryClient.invalidateQueries({ queryKey: ['booking', id] })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setReviewLoading(false)
    }
  }

  if (isLoading) return <div className="section py-20 text-center"><p>Loading booking details...</p></div>
  if (!booking) return <div className="section py-20 text-center"><h2 className="text-xl font-bold">Booking not found</h2></div>

  const isConfirmed = booking.status === 'CONFIRMED'
  const isCancelled = booking.status === 'CANCELLED'

  return (
    <div className="section py-12 max-w-4xl">
      <div className="card p-8 border border-brand-border dark:border-dark-border">
        {/* Header Status */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-brand-border dark:border-dark-border mb-8">
          <div>
            <span className="text-brand-gray dark:text-dark-muted text-sm">Booking ID: #{booking.id}</span>
            <h1 className="text-2xl font-bold font-display mt-1">Stay at {booking.property?.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {isConfirmed && (
              <span className="badge-success text-sm py-1.5 px-3 flex items-center gap-1">
                <FiCheckCircle /> Confirmed Stay
              </span>
            )}
            {isCancelled && (
              <span className="badge-danger text-sm py-1.5 px-3 flex items-center gap-1">
                <FiAlertCircle /> Cancelled
              </span>
            )}
          </div>
        </div>

        {/* Stay Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Trip Details</h3>
            <div className="flex items-center gap-3 text-sm">
              <FiCalendar className="text-brand-pink text-lg" />
              <div>
                <p className="font-semibold">Check-in</p>
                <p className="text-brand-gray">{new Date(booking.checkIn).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FiCalendar className="text-brand-pink text-lg" />
              <div>
                <p className="font-semibold">Check-out</p>
                <p className="text-brand-gray">{new Date(booking.checkOut).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="pt-2">
              <p className="text-sm font-semibold">Guests</p>
              <p className="text-sm text-brand-gray">{booking.guests} guest{booking.guests !== 1 ? 's' : ''}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg">Billing Breakdown</h3>
            <div className="space-y-2 text-sm text-brand-gray">
              <div className="flex justify-between">
                <span>Nightly rate</span>
                <span>${booking.nightlyRate}</span>
              </div>
              <div className="flex justify-between">
                <span>Nights</span>
                <span>{booking.numberOfNights}</span>
              </div>
              <div className="flex justify-between">
                <span>Cleaning Fee</span>
                <span>${booking.cleaningFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes (12%)</span>
                <span>${booking.taxes}</span>
              </div>
              <div className="flex justify-between font-bold text-brand-dark dark:text-white text-base border-t border-brand-border dark:border-dark-border pt-2 mt-2">
                <span>Total Paid</span>
                <span>${booking.totalPrice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions section */}
        <div className="border-t border-brand-border dark:border-dark-border pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <Link to={`/properties/${booking.property?.id}`} className="btn-secondary py-2.5 px-5 text-sm inline-block">
              View Property Listing
            </Link>
          </div>
          {isConfirmed && (
            <button
              onClick={() => { if(confirm('Cancel reservation?')) cancelMutation.mutate() }}
              className="text-red-500 hover:text-red-700 text-sm font-semibold hover:underline"
            >
              Cancel Reservation
            </button>
          )}
        </div>

        {/* Submit Review section */}
        {booking.status === 'CONFIRMED' && !booking.hasReview && (
          <div className="border-t border-brand-border dark:border-dark-border pt-8 mt-8">
            <h3 className="font-bold text-lg mb-4">Leave a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="input-label">Rating</label>
                <InteractiveStarRating value={rating} onChange={setRating} />
              </div>
              <div>
                <label className="input-label">Comments</label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  rows="4"
                  placeholder="Share your stay experience..."
                  required
                  className="input-field"
                />
              </div>
              <button type="submit" disabled={reviewLoading} className="btn-primary py-2 px-6 text-sm">
                {reviewLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        {/* Display existing review if any */}
        {booking.hasReview && (
          <div className="border-t border-brand-border dark:border-dark-border pt-8 mt-8 space-y-3">
            <h3 className="font-bold text-lg">Your Submitted Review</h3>
            <div className="flex items-center justify-between">
              <StarRating rating={rating} showValue={false} />
            </div>
            <p className="text-sm text-brand-gray">{comment || "Review submitted successfully"}</p>
          </div>
        )}
      </div>
    </div>
  )
}
