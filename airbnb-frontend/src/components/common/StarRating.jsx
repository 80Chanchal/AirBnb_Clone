import { FiStar } from 'react-icons/fi'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'

export default function StarRating({ rating = 0, size = 'sm', showValue = true, count = null }) {
  const sizes = { xs: 'text-xs', sm: 'text-sm', md: 'text-base', lg: 'text-lg' }
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.25 && rating % 1 < 0.75
  const remainder = 5 - fullStars - (hasHalf ? 1 : 0)

  for (let i = 0; i < fullStars; i++) stars.push(<FaStar key={`full-${i}`} className="text-amber-400" />)
  if (hasHalf) stars.push(<FaStarHalfAlt key="half" className="text-amber-400" />)
  for (let i = 0; i < remainder; i++) stars.push(<FaRegStar key={`empty-${i}`} className="text-amber-400/40" />)

  return (
    <div className={`flex items-center gap-1 ${sizes[size]}`}>
      <div className="flex items-center gap-0.5">{stars}</div>
      {showValue && rating > 0 && (
        <span className="font-semibold text-brand-dark dark:text-white ml-1">{rating.toFixed(1)}</span>
      )}
      {count !== null && (
        <span className="text-brand-gray dark:text-dark-muted">({count})</span>
      )}
    </div>
  )
}

export function InteractiveStarRating({ value = 0, onChange, size = 'lg' }) {
  const sizes = { sm: 'text-lg', md: 'text-xl', lg: 'text-2xl' }

  return (
    <div className={`flex items-center gap-1 ${sizes[size]}`}>
      {[1, 2, 3, 4, 5].map(star => (
        <button key={star} type="button" onClick={() => onChange(star)}
          className="transition-transform hover:scale-110 active:scale-90"
        >
          {star <= value
            ? <FaStar className="text-amber-400" />
            : <FaRegStar className="text-amber-400/40 hover:text-amber-400/60" />}
        </button>
      ))}
    </div>
  )
}
