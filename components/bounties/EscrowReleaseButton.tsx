'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  bountyId: string
  disabled?: boolean
}

export function EscrowReleaseButton ({ bountyId, disabled }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  async function handleClick () {
    setIsLoading(true)
    setHasError('')

    try {
      const res = await fetch('/api/escrow/release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bountyId })
      })

      const json = await res.json()
      if (!json.ok) throw new Error(json.error)

      setIsSuccess(true)
    } catch (err: any) {
      setHasError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex flex-col items-start'>
      <Button onClick={handleClick} disabled={isLoading || disabled || isSuccess}>
        {isSuccess ? 'Released' : isLoading ? 'Releasing…' : 'Failsafe Release'}
      </Button>
      {hasError && <p className='text-red-500 text-sm mt-2'>{hasError}</p>}
    </div>
  )
} 