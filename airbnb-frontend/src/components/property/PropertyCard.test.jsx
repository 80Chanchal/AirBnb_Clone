import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import PropertyCard from './PropertyCard'

// Mock useAuth context
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: false,
  }),
}))

const mockProperty = {
  id: 1,
  title: 'Luxury Beachfront Villa',
  city: 'Miami',
  country: 'USA',
  pricePerNight: 350,
  bedrooms: 3,
  bathrooms: 2.5,
  maxGuests: 6,
  averageRating: 4.9,
  isWishlisted: false,
  images: [{ url: 'http://example.com/image.jpg' }]
}

describe('PropertyCard Component', () => {
  it('should render property details correctly', () => {
    render(
      <BrowserRouter>
        <PropertyCard property={mockProperty} />
      </BrowserRouter>
    )

    expect(screen.getByText('Luxury Beachfront Villa')).toBeInTheDocument()
    expect(screen.getByText('Miami, USA')).toBeInTheDocument()
    expect(screen.getByText('$350')).toBeInTheDocument()
    expect(screen.getByText(/3 beds · 2.5 baths · 6 guests/i)).toBeInTheDocument()
  })
})
