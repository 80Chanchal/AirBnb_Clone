import api from './api'

export const authService = {
  register:              (data)    => api.post('/auth/register', data).then(r => r.data.data),
  login:                 (data)    => api.post('/auth/login', data).then(r => r.data.data),
  refreshToken:          (data)    => api.post('/auth/refresh', data).then(r => r.data.data),
  verifyEmail:           (token)   => api.get('/auth/verify-email', { params: { token } }).then(r => r.data),
  forgotPassword:        (data)    => api.post('/auth/forgot-password', data).then(r => r.data),
  resetPassword:         (data)    => api.post('/auth/reset-password', data).then(r => r.data),
  resendVerification:    (email)   => api.post('/auth/resend-verification', null, { params: { email } }).then(r => r.data),
}
