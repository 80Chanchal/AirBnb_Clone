import api from './api'

export const propertyService = {
  search:           (params)            => api.get('/properties', { params }).then(r => r.data.data),
  getById:          (id)                => api.get(`/properties/${id}`).then(r => r.data.data),
  getFeatured:      ()                  => api.get('/properties/featured').then(r => r.data.data),
  getTopCities:     ()                  => api.get('/properties/top-cities').then(r => r.data.data),
  getMyListings:    (params)            => api.get('/properties/host/my-listings', { params }).then(r => r.data.data),
  create:           (formData)          => api.post('/properties', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data.data),
  update:           (id, data)          => api.put(`/properties/${id}`, data).then(r => r.data.data),
  delete:           (id)                => api.delete(`/properties/${id}`).then(r => r.data),
  addImages:        (id, formData)      => api.post(`/properties/${id}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data),
  deleteImage:      (propertyId, imgId) => api.delete(`/properties/${propertyId}/images/${imgId}`).then(r => r.data),
}
