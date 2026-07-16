import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './router/ProtectedRoute'
import GuestRoute from './router/GuestRoute'
import MainLayout from './components/layout/MainLayout'
import PageLoader from './components/common/PageLoader'

// Lazy loaded pages
const HomePage          = lazy(() => import('./pages/HomePage'))
const PropertyListPage  = lazy(() => import('./pages/PropertyListPage'))
const PropertyDetailPage = lazy(() => import('./pages/PropertyDetailPage'))
const LoginPage         = lazy(() => import('./pages/auth/LoginPage'))
const RegisterPage      = lazy(() => import('./pages/auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'))
const ResetPasswordPage  = lazy(() => import('./pages/auth/ResetPasswordPage'))
const VerifyEmailPage    = lazy(() => import('./pages/auth/VerifyEmailPage'))
const BookingPage        = lazy(() => import('./pages/BookingPage'))
const BookingHistoryPage = lazy(() => import('./pages/BookingHistoryPage'))
const WishlistPage       = lazy(() => import('./pages/WishlistPage'))
const ProfilePage        = lazy(() => import('./pages/ProfilePage'))
const HostDashboardPage  = lazy(() => import('./pages/HostDashboardPage'))
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'))
const NotFoundPage       = lazy(() => import('./pages/NotFoundPage'))

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="properties" element={<PropertyListPage />} />
          <Route path="properties/:id" element={<PropertyDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Guest only routes (redirect if logged in) */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Protected routes (any authenticated user) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route path="bookings" element={<BookingHistoryPage />} />
            <Route path="bookings/:id" element={<BookingPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Host routes */}
        <Route element={<ProtectedRoute roles={['HOST', 'ADMIN']} />}>
          <Route path="/" element={<MainLayout />}>
            <Route path="host" element={<HostDashboardPage />} />
          </Route>
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute roles={['ADMIN']} />}>
          <Route path="/" element={<MainLayout />}>
            <Route path="admin" element={<AdminDashboardPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}
