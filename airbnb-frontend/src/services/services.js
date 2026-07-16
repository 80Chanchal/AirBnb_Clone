import api from './api'

export const reviewService = {
  create:              (data)   => api.post('/reviews', data).then(r => r.data.data),
  update:              (id, d)  => api.put(`/reviews/${id}`, d).then(r => r.data.data),
  delete:              (id)     => api.delete(`/reviews/${id}`).then(r => r.data),
  getPropertyReviews:  (propertyId, params) => api.get(`/reviews/property/${propertyId}`, { params }).then(r => r.data.data),
}

export const wishlistService = {
  toggle:     (propertyId) => api.post(`/wishlist/${propertyId}/toggle`).then(r => r.data.data),
  getAll:     (params)     => api.get('/wishlist', { params }).then(r => r.data.data),
  getStatus:  (propertyId) => api.get(`/wishlist/${propertyId}/status`).then(r => r.data.data),
}

export const userService = {
  getMe:           ()       => api.get('/users/me').then(r => r.data.data),
  getById:         (id)     => api.get(`/users/${id}`).then(r => r.data.data),
  updateProfile:   (data)   => api.put('/users/me', data).then(r => r.data.data),
  uploadAvatar:    (fd)     => api.post('/users/me/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data.data),
  changePassword:  (data)   => api.post('/users/me/change-password', data).then(r => r.data),
}

export const categoryService = {
  getAll: () => api.get('/categories').then(r => r.data.data),
}

export const notificationService = {
  getAll:         (params)  => api.get('/notifications', { params }).then(r => r.data.data),
  getUnreadCount: ()        => api.get('/notifications/unread-count').then(r => r.data.data),
  markAllRead:    ()        => api.post('/notifications/mark-all-read').then(r => r.data),
  markRead:       (id)      => api.post(`/notifications/${id}/read`).then(r => r.data),
}

export const adminService = {
  getStats:            ()              => api.get('/admin/dashboard/stats').then(r => r.data.data),
  getUsers:            (params)        => api.get('/admin/users', { params }).then(r => r.data.data),
  banUser:             (id)            => api.post(`/admin/users/${id}/ban`).then(r => r.data),
  unbanUser:           (id)            => api.post(`/admin/users/${id}/unban`).then(r => r.data),
  updatePropertyStatus:(id, status)    => api.patch(`/admin/properties/${id}/status`, { status }).then(r => r.data),
}
