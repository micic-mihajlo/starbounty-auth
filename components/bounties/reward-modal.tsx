'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { RewardInput } from './reward-input' // Using the existing styled RewardInput
import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'

interface RewardModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (rewardAmount: string) => void
  isLoading?: boolean // Optional loading state for submission
  currentBountyTitle?: string // To display context in the modal
}

export function RewardModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  currentBountyTitle = 'this bounty'
}: RewardModalProps) {
  const [reward, setReward] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleRewardSubmit = () => {
    const numericReward = parseFloat(reward)
    if (!reward.trim() || isNaN(numericReward) || numericReward <= 0) {
      setValidationError('Please enter a valid positive reward amount.')
      return
    }
    setValidationError(null)
    onSubmit(reward)
    setReward('') // Reset reward input after submission
  }

  const handleModalClose = () => {
    setReward('') // Reset reward input on close
    setValidationError(null)
    onClose()
  }

  // Prevent closing modal on overlay click or escape key if needed (Radix default is to close)
  // For now, default behavior is fine.

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleModalClose()}>
      <DialogContent className='sm:max-w-[480px] bg-card border-border shadow-xl rounded-lg'>
        <DialogHeader className='pt-6 px-6'>
          <DialogTitle className='text-2xl font-semibold text-foreground'>
            Set Reward Amount (XLM)
          </DialogTitle>
          <DialogDescription className='text-muted-foreground mt-1'>
            Enter the amount of XLM you want to offer for completing `'${currentBountyTitle}'`.
            This amount will be held in escrow.
          </DialogDescription>
        </DialogHeader>
        <div className='p-6 space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='reward-amount' className='text-sm font-medium text-foreground'>
              Reward Amount in XLM
            </Label>
            <RewardInput
              value={reward}
              onChange={setReward}
              placeholder='e.g., 1000'
              className='w-full' // Ensure it takes full width within modal content
            />
          </div>
          {validationError && (
            <div className='flex items-center text-sm text-destructive'>
              <AlertCircle className='h-4 w-4 mr-2 flex-shrink-0' />
              {validationError}
            </div>
          )}
          <p className='text-xs text-muted-foreground'>
            The specified XLM amount will be transferred to an escrow account upon bounty creation.
            Ensure you have sufficient funds.
          </p>
        </div>
        <DialogFooter className='px-6 pb-6 pt-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2'>
          <Button
            type='button'
            variant='outline'
            onClick={handleModalClose}
            disabled={isLoading}
            className='w-full sm:w-auto border-border hover:bg-muted'
          >
            Cancel
          </Button>
          <Button
            type='button'
            onClick={handleRewardSubmit}
            disabled={isLoading || !reward.trim()}
            className='w-full sm:w-auto gradient-bg hover:opacity-90 text-white'
          >
            {isLoading ? 'Processing...' : 'Confirm & Attach Bounty'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 