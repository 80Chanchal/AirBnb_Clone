import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../../services/authService'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authService.forgotPassword({ email })
      setSent(true)
      toast.success('Reset email sent!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email')
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
          <h2 className="text-2xl font-display font-bold">Reset Password</h2>
          <p className="text-sm text-brand-gray dark:text-dark-muted mt-1">
            {sent ? "Check your email for the reset link" : "Enter your email to request a reset link"}
          </p>
        </div>

        {sent ? (
          <div className="space-y-4 text-center">
            <div className="text-5xl">✉️</div>
            <p className="text-sm text-brand-gray">
              If an account matches <b>{email}</b>, we have sent instructions to reset your password.
            </p>
            <Link to="/login" className="btn-primary inline-block py-2.5 px-6">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-4"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="text-center mt-4">
              <Link to="/login" className="text-sm text-brand-pink hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  )
}
