import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { authService } from '../../services/authService'
import { motion } from 'framer-motion'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [state, setState] = useState('loading')
  const [message, setMessage] = useState('Verifying your email address…')

  useEffect(() => {
    if (!token) {
      setState('error')
      setMessage('This verification link is missing its token.')
      return
    }

    authService.verifyEmail(token)
      .then((response) => {
        setState('success')
        setMessage(response.message || 'Your email address has been verified.')
      })
      .catch((error) => {
        setState('error')
        setMessage(error.response?.data?.message || 'This verification link is invalid or has expired.')
      })
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light dark:bg-dark-bg px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-2xl p-8 shadow-card text-center"
      >
        <h2 className="text-2xl font-display font-bold">
          {state === 'success' ? 'Email verified' : state === 'error' ? 'Verification failed' : 'Verifying email'}
        </h2>
        <p className="text-sm text-brand-gray dark:text-dark-muted mt-3">{message}</p>
        {state !== 'loading' && (
          <Link to="/" className="btn-primary inline-block py-2.5 px-6 mt-6">
            Continue to StayVista
          </Link>
        )}
      </motion.div>
    </div>
  )
}
