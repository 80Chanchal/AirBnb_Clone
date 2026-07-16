import api from './api'

export const bookingService = {
  create:          (data)                    => api.post('/bookings', data).then(r => r.data.data),
  calculatePrice:  (propertyId, checkIn, checkOut) =>
                     api.get('/bookings/calculate-price', { params: { propertyId, checkIn, checkOut } }).then(r => r.data.data),
  getBookedDates:  (propertyId)              => api.get(`/bookings/booked-dates/${propertyId}`).then(r => r.data.data),
  getMyBookings:   (params)                  => api.get('/bookings/my-bookings', { params }).then(r => r.data.data),
  getReservations: (params)                  => api.get('/bookings/host/reservations', { params }).then(r => r.data.data),
  getById:         (id)                      => api.get(`/bookings/${id}`).then(r => r.data.data),
  cancel:          (id, reason)              => api.post(`/bookings/${id}/cancel`, { reason }).then(r => r.data.data),
}
