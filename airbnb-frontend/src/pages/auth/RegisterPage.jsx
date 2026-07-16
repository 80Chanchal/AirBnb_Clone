import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialRole = searchParams.get('role') === 'host' ? 'HOST' : 'GUEST'

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: initialRole
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.password)) {
      toast.error('Password must be at least 8 characters and include uppercase, lowercase, and a number')
      return
    }
    setLoading(true)
    try {
      await register(formData)
      toast.success('Registration successful!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light dark:bg-dark-bg px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-2xl p-8 shadow-card"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-display font-bold">Create an account</h2>
          <p className="text-sm text-brand-gray dark:text-dark-muted mt-1">
            Sign up to book stays or start hosting
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="input-label">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label className="input-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
          <div>
            <label className="input-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*"
              title="Use at least 8 characters with uppercase, lowercase, and a number"
              placeholder="Min. 8 characters"
              className="input-field"
            />
          </div>
          <div>
            <label className="input-label">I want to</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-field font-semibold"
            >
              <option value="GUEST">Book Stays (Guest)</option>
              <option value="HOST">List My Space (Host)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 mt-4"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-brand-gray dark:text-dark-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-pink font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
