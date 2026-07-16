import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-9xl mb-6">🏜️</div>
      <h1 className="text-4xl font-display font-bold mb-2">Page Not Found</h1>
      <p className="text-brand-gray dark:text-dark-muted max-w-md mb-8">
        We can't seem to find the page you're looking for. It might have been moved or deleted.
      </p>
      <Link to="/" className="btn-primary py-3 px-8">
        Go Back Home
      </Link>
    </div>
  )
}
