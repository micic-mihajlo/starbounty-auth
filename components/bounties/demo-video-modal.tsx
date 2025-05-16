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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'

interface DemoVideoModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (url: string) => void
  isLoading?: boolean
}

export function DemoVideoModal ({ isOpen, onClose, onSubmit, isLoading = false }: DemoVideoModalProps) {
  const [url, setUrl] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleSubmit = () => {
    if (!isValidUrl(url)) {
      setValidationError('Please enter a valid URL (YouTube, Loom, etc.)')
      return
    }
    setValidationError(null)
    onSubmit(url.trim())
    setUrl('')
  }

  const handleClose = () => {
    setUrl('')
    setValidationError(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className='sm:max-w-[480px] bg-card border-border shadow-xl rounded-lg'>
        <DialogHeader className='pt-6 px-6'>
          <DialogTitle className='text-2xl font-semibold text-foreground'>Add Demo Video Link</DialogTitle>
          <DialogDescription className='text-muted-foreground mt-1'>
            Optional but recommended – share a short demo to help the poster review your work.
          </DialogDescription>
        </DialogHeader>
        <div className='p-6 space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='demo-url' className='text-sm font-medium text-foreground'>Video URL</Label>
            <Input id='demo-url' placeholder='https://loom.com/share/...' value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          {validationError && (
            <div className='flex items-center text-sm text-destructive'>
              <AlertCircle className='h-4 w-4 mr-2 flex-shrink-0' />
              {validationError}
            </div>
          )}
          <p className='text-xs text-muted-foreground'>Accepted: YouTube, Loom, Vimeo, etc.</p>
        </div>
        <DialogFooter className='px-6 pb-6 pt-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2'>
          <Button type='button' variant='outline' onClick={handleClose} disabled={isLoading} className='w-full sm:w-auto border-border hover:bg-muted'>
            Cancel
          </Button>
          <Button type='button' onClick={handleSubmit} disabled={isLoading || !url.trim()} className='w-full sm:w-auto gradient-bg hover:opacity-90 text-white'>
            {isLoading ? 'Saving...' : 'Save Demo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function isValidUrl (value: string) {
  try {
    const parsed = new URL(value)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
} 