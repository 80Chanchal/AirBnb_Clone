import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('airbnb_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { localStorage.removeItem('airbnb_user') }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials)
    localStorage.setItem('airbnb_access_token',  data.accessToken)
    localStorage.setItem('airbnb_refresh_token', data.refreshToken)
    const userData = {
      id: data.userId, email: data.email,
      firstName: data.firstName, lastName: data.lastName,
      role: data.role, avatar: data.avatar, emailVerified: data.emailVerified,
    }
    localStorage.setItem('airbnb_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }, [])

  const register = useCallback(async (credentials) => {
    const data = await authService.register(credentials)
    localStorage.setItem('airbnb_access_token',  data.accessToken)
    localStorage.setItem('airbnb_refresh_token', data.refreshToken)
    const userData = {
      id: data.userId, email: data.email,
      firstName: data.firstName, lastName: data.lastName,
      role: data.role, avatar: data.avatar, emailVerified: data.emailVerified,
    }
    localStorage.setItem('airbnb_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('airbnb_access_token')
    localStorage.removeItem('airbnb_refresh_token')
    localStorage.removeItem('airbnb_user')
    setUser(null)
    toast.success('Logged out successfully')
  }, [])

  const updateUser = useCallback((updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates }
      localStorage.setItem('airbnb_user', JSON.stringify(updated))
      return updated
    })
  }, [])

  const isAuthenticated = !!user
  const isHost  = user?.role === 'HOST'  || user?.role === 'ADMIN'
  const isAdmin = user?.role === 'ADMIN'
  const isGuest = user?.role === 'GUEST'

  return (
    <AuthContext.Provider value={{
      user, loading, isAuthenticated,
      isHost, isAdmin, isGuest,
      login, register, logout, updateUser,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
