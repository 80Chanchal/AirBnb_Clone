import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { bookingService } from '../../services/bookingService'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import toast from 'react-hot-toast'
import { FiUsers, FiCalendar, FiArrowRight } from 'react-icons/fi'

export default function BookingWidget({ property }) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [checkIn, setCheckIn] = useState(null)
  const [checkOut, setCheckOut] = useState(null)
  const [guests, setGuests] = useState(1)
  const [priceData, setPriceData] = useState(null)
  const [bookedDates, setBookedDates] = useState([])

  // Load booked dates
  useEffect(() => {
    bookingService.getBookedDates(property.id)
      .then(ranges => {
        const dates = []
        ranges.forEach(range => {
          let start = new Date(range[0])
          let end = new Date(range[1])
          while (start <= end) {
            dates.push(new Date(start))
            start.setDate(start.getDate() + 1)
          }
        })
        setBookedDates(dates)
      })
      .catch(() => {})
  }, [property.id])

  // Recalculate price when dates change
  useEffect(() => {
    if (checkIn && checkOut && checkOut > checkIn) {
      const checkInStr = checkIn.toISOString().split('T')[0]
      const checkOutStr = checkOut.toISOString().split('T')[0]
      bookingService.calculatePrice(property.id, checkInStr, checkOutStr)
        .then(res => setPriceData(res))
        .catch(() => setPriceData(null))
    } else {
      setPriceData(null)
    }
  }, [checkIn, checkOut, property.id])

  const localPrice = useMemo(() => {
    if (!checkIn || !checkOut || checkOut <= checkIn) return null
    const numberOfNights = Math.round((checkOut - checkIn) / 86400000)
    const subtotal = property.pricePerNight * numberOfNights
    const serviceFee = Math.round(subtotal * 0.1)
    return { numberOfNights, subtotal, serviceFee, total: subtotal + serviceFee }
  }, [checkIn, checkOut, property.pricePerNight])
  const pricing = priceData || localPrice

  const handleBook = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book properties')
      navigate('/login')
      return
    }

    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates')
      return
    }

    if (Number(property.id) < 0) {
      toast.success('Demo reservation confirmed!')
      return
    }

    try {
      const payload = {
        propertyId: property.id,
        checkIn: checkIn.toISOString().split('T')[0],
        checkOut: checkOut.toISOString().split('T')[0],
        guests
      }
      const booking = await bookingService.create(payload)
      toast.success('Booking confirmed!')
      navigate(`/bookings/${booking.id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete booking')
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 border border-brand-border sticky top-6 shadow-card text-brand-dark">
      <div className="flex justify-between items-baseline mb-6">
        <div>
          <span className="text-2xl font-bold font-display">₹{property.pricePerNight.toLocaleString('en-IN')}</span>
          <span className="text-brand-gray"> / night</span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {/* Date Inputs */}
        <div className="grid grid-cols-2 gap-2 border border-brand-border rounded-xl p-2 bg-white">
          <div>
            <label className="block text-[10px] font-bold text-brand-dark uppercase tracking-wider mb-1">Check In</label>
            <DatePicker
              selected={checkIn}
              onChange={date => { setCheckIn(date); setCheckOut(null) }}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={new Date()}
              excludeDates={bookedDates}
              placeholderText="Select date"
              className="bg-transparent text-sm w-full outline-none"
            />
          </div>
          <div className="border-l border-brand-border pl-2">
            <label className="block text-[10px] font-bold text-brand-dark uppercase tracking-wider mb-1">Check Out</label>
            <DatePicker
              selected={checkOut}
              onChange={date => setCheckOut(date)}
              selectsEnd
              startDate={checkIn}
              endDate={checkOut}
              minDate={checkIn ? new Date(checkIn.getTime() + 86400000) : new Date()}
              excludeDates={bookedDates}
              placeholderText="Select date"
              className="bg-transparent text-sm w-full outline-none"
            />
          </div>
        </div>

        {/* Guests Input */}
        <div className="border border-brand-border rounded-xl p-3 bg-white">
          <label className="block text-[10px] font-bold text-brand-dark uppercase tracking-wider mb-1">Guests</label>
          <div className="flex justify-between items-center">
            <span className="text-sm">Number of Guests</span>
            <input
              type="number"
              min="1"
              max={property.maxGuests}
              value={guests}
              onChange={e => setGuests(parseInt(e.target.value))}
              className="w-16 bg-white border border-brand-border rounded px-2 py-1 text-center text-sm"
            />
          </div>
        </div>
      </div>

      {pricing && (
        <div className="space-y-3 mb-6 text-sm text-brand-gray border-t border-brand-border pt-4">
          <div className="flex justify-between">
            <span>₹{property.pricePerNight.toLocaleString('en-IN')} x {pricing.numberOfNights} nights</span>
            <span>₹{pricing.subtotal.toLocaleString('en-IN')}</span>
          </div>
          {(priceData?.cleaningFee > 0 || pricing.serviceFee > 0) && (
            <div className="flex justify-between">
              <span>{priceData?.cleaningFee ? 'Cleaning fee' : 'Service fee'}</span>
              <span>₹{(priceData?.cleaningFee || pricing.serviceFee).toLocaleString('en-IN')}</span>
            </div>
          )}
          {priceData?.taxes > 0 && <div className="flex justify-between"><span>Taxes</span><span>₹{priceData.taxes.toLocaleString('en-IN')}</span></div>}
          <div className="flex justify-between font-bold text-brand-dark text-base border-t border-brand-border pt-3">
            <span>Total</span>
            <span>₹{pricing.total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}

      <button onClick={handleBook} className="btn-primary w-full flex items-center justify-center gap-2 py-3 rounded-xl shadow-brand hover:shadow-hover">
        <span>Reserve Stay</span>
        <FiArrowRight />
      </button>
      <p className="mt-4 text-center text-sm text-brand-gray">You won’t be charged yet</p>
    </div>
  )
}
