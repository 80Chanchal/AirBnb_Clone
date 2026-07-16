import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiMapPin, FiCalendar, FiUsers } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

export default function SearchBar({ className = '' }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState({ location: '', checkIn: '', checkOut: '', guests: '' })

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.location) params.set('city', query.location)
    if (query.guests)   params.set('guests', query.guests)
    navigate(`/properties?${params.toString()}`)
  }

  return (
    <motion.form
      onSubmit={handleSearch}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className={`bg-white dark:bg-dark-card rounded-2xl shadow-card border border-brand-border dark:border-dark-border p-2 flex flex-col md:flex-row items-stretch gap-2 ${className}`}
    >
      {/* Location */}
      <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-brand-light dark:hover:bg-dark-surface transition-colors cursor-pointer">
        <FiMapPin className="text-brand-pink text-lg shrink-0" />
        <div className="flex-1">
          <label className="block text-[11px] font-bold text-brand-dark dark:text-white uppercase tracking-wider">Where</label>
          <input
            type="text"
            placeholder="Search destinations"
            value={query.location}
            onChange={e => setQuery(q => ({ ...q, location: e.target.value }))}
            className="w-full bg-transparent text-sm text-brand-dark dark:text-white placeholder-brand-gray dark:placeholder-dark-muted outline-none"
          />
        </div>
      </div>

      <div className="hidden md:block w-px bg-brand-border dark:bg-dark-border self-stretch my-2" />

      {/* Check-in */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-brand-light dark:hover:bg-dark-surface transition-colors cursor-pointer">
        <FiCalendar className="text-brand-pink text-lg shrink-0" />
        <div>
          <label className="block text-[11px] font-bold text-brand-dark dark:text-white uppercase tracking-wider">Check in</label>
          <input
            type="date"
            value={query.checkIn}
            onChange={e => setQuery(q => ({ ...q, checkIn: e.target.value }))}
            className="bg-transparent text-sm text-brand-dark dark:text-white outline-none"
          />
        </div>
      </div>

      <div className="hidden md:block w-px bg-brand-border dark:bg-dark-border self-stretch my-2" />

      {/* Check-out */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-brand-light dark:hover:bg-dark-surface transition-colors cursor-pointer">
        <FiCalendar className="text-brand-pink text-lg shrink-0" />
        <div>
          <label className="block text-[11px] font-bold text-brand-dark dark:text-white uppercase tracking-wider">Check out</label>
          <input
            type="date"
            value={query.checkOut}
            onChange={e => setQuery(q => ({ ...q, checkOut: e.target.value }))}
            className="bg-transparent text-sm text-brand-dark dark:text-white outline-none"
          />
        </div>
      </div>

      <div className="hidden md:block w-px bg-brand-border dark:bg-dark-border self-stretch my-2" />

      {/* Guests */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-brand-light dark:hover:bg-dark-surface transition-colors">
        <FiUsers className="text-brand-pink text-lg shrink-0" />
        <div>
          <label className="block text-[11px] font-bold text-brand-dark dark:text-white uppercase tracking-wider">Guests</label>
          <input
            type="number"
            min="1"
            placeholder="Add guests"
            value={query.guests}
            onChange={e => setQuery(q => ({ ...q, guests: e.target.value }))}
            className="w-20 bg-transparent text-sm text-brand-dark dark:text-white placeholder-brand-gray dark:placeholder-dark-muted outline-none"
          />
        </div>
      </div>

      {/* Search button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="btn-primary flex items-center gap-2 justify-center px-6 rounded-xl"
      >
        <FiSearch className="text-lg" />
        <span className="hidden sm:inline">Search</span>
      </motion.button>
    </motion.form>
  )
}
