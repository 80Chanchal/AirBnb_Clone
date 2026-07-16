import { FiLoader } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-dark-bg z-50">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-10 h-10 rounded-full border-3 border-brand-border border-t-brand-pink"
        style={{ borderWidth: 3 }}
      />
    </div>
  )
}
