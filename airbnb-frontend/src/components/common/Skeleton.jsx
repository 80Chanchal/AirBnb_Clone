export function Skeleton({ className = '', variant = 'rect' }) {
  const base = 'skeleton animate-shimmer'
  const variants = {
    rect:   `${base} h-4 w-full ${className}`,
    circle: `${base} rounded-full ${className}`,
    text:   `${base} h-3 w-3/4 ${className}`,
    card:   `${base} h-64 w-full rounded-2xl ${className}`,
    avatar: `${base} w-10 h-10 rounded-full ${className}`,
  }
  return <div className={variants[variant] || variants.rect} />
}

export function PropertyCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden">
      <Skeleton variant="card" className="h-60" />
      <div className="pt-3 space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton variant="text" className="w-1/2" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}

export function PropertyGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function BookingCardSkeleton() {
  return (
    <div className="card p-6 space-y-4">
      <div className="flex gap-4">
        <Skeleton className="h-24 w-32 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton variant="text" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  )
}
