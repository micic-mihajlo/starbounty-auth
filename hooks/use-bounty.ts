import { useEffect, useState } from 'react'

interface UseBountyResult<T = any> {
  bounty: T | null
  isLoading: boolean
  error: string | null
}

export function useBounty<T = any> (id: string | null): UseBountyResult<T> {
  const [bounty, setBounty] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    let isCancelled = false
    const fetchBounty = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/bounties/${id}`)
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to fetch bounty')
        }
        const { bounty: data } = await res.json()
        if (!isCancelled) setBounty(data)
      } catch (err: any) {
        if (!isCancelled) setError(err.message || 'Unknown error')
      } finally {
        if (!isCancelled) setIsLoading(false)
      }
    }
    fetchBounty()
    return () => { isCancelled = true }
  }, [id])

  return { bounty, isLoading, error }
} 