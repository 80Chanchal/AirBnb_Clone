import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authService } from '../../services/authService'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
      toast.error('Password must be at least 8 characters and include uppercase, lowercase, and a number')
      return
    }

    setLoading(true)
    try {
      await authService.resetPassword({
        token,
        newPassword: password,
        confirmPassword
      })
      toast.success('Password updated successfully!')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password')
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
          <h2 className="text-2xl font-display font-bold">New Password</h2>
          <p className="text-sm text-brand-gray dark:text-dark-muted mt-1">
            Choose a strong new password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="input-label">New Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
              pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*"
              title="Use at least 8 characters with uppercase, lowercase, and a number"
              placeholder="Min. 8 characters"
              className="input-field"
            />
          </div>
          <div>
            <label className="input-label">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm password"
              className="input-field"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 mt-4"
          >
            {loading ? 'Updating Password...' : 'Reset Password'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
