import { useState, useEffect } from 'react'

export function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch { return initialValue }
  })

  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) }
    catch (e) { console.error('localStorage write error', e) }
  }, [key, value])

  return [value, setValue]
}

export function useInfiniteScroll(callback, hasMore) {
  useEffect(() => {
    if (!hasMore) return
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting && hasMore) callback() },
      { threshold: 0.1 }
    )
    const sentinel = document.getElementById('scroll-sentinel')
    if (sentinel) observer.observe(sentinel)
    return () => { if (sentinel) observer.unobserve(sentinel) }
  }, [callback, hasMore])
}
