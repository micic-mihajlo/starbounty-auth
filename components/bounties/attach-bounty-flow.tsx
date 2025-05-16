'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { GithubIcon, PlusIcon, AlertCircle } from 'lucide-react'
import { RewardModal } from './reward-modal'

// Duplicating Bounty and BountyFormData for now
interface Bounty {
  id: string
  title: string
  repository: string
  issueNumber: number
  description: string
  keywords: string[]
  githubLink: string
  requirements: string[]
  reward: string
  status: 'open' | 'in progress' | 'closed'
}

interface BountyFormData {
  title: string
  repository: string
  issueNumber: string
  description: string
  keywords: string
  githubLink: string
  requirements: string
  reward: string
}

// This interface represents data from the main form, excluding reward
interface BountyDetailsFormData {
  title: string
  repository: string
  issueNumber: string
  description: string
  keywords: string
  githubLink: string
  requirements: string
}

// This interface represents the data for final submission, including reward
export interface FullBountyData extends BountyDetailsFormData {
  reward: string
}

const initialFormData: BountyDetailsFormData = {
  title: '',
  repository: '',
  issueNumber: '',
  description: '',
  keywords: '',
  githubLink: '',
  requirements: ''
}

interface AttachBountyFlowProps {
  onBountySubmit: (formData: FullBountyData) => void // Expects full data with reward
  onCancel: () => void
}

export function AttachBountyFlow({ onBountySubmit, onCancel }: AttachBountyFlowProps) {
  const [formData, setFormData] = useState<BountyDetailsFormData>(initialFormData)
  const [githubIssueUrlInput, setGithubIssueUrlInput] = useState('')
  const [isIssueDetailsFetched, setIsIssueDetailsFetched] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isFetching, setIsFetching] = useState(false)
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false) // New state for modal
  const [isSubmittingBounty, setIsSubmittingBounty] = useState(false); // For modal loading state

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFetchIssue = async () => {
    setFetchError(null)
    setIsFetching(true)
    setFormData(initialFormData) // Reset form data before fetching new issue
    setIsIssueDetailsFetched(false)

    const githubIssueRegex = /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/issues\/(\d+)(\/.*)?$/
    const match = githubIssueUrlInput.match(githubIssueRegex)

    if (!match) {
      setFetchError('Invalid GitHub issue URL. Format: https://github.com/owner/repo/issues/number')
      setIsFetching(false)
      return
    }

    const [, owner, repoName, issueNum] = match
    const apiUrl = `https://api.github.com/repos/${owner}/${repoName}/issues/${issueNum}`
    const repoApiUrl = `https://api.github.com/repos/${owner}/${repoName}`

    try {
      // First, check if the repository is public
      const repoResponse = await fetch(repoApiUrl)
      if (!repoResponse.ok) {
        if (repoResponse.status === 404) {
          setFetchError('Repository not found. Please check the URL or ensure it is public.')
        } else {
          setFetchError(`Error fetching repository details: ${repoResponse.statusText}`)
        }
        setIsFetching(false)
        return
      }
      const repoData = await repoResponse.json()
      if (repoData.private) {
        setFetchError('The repository is private. Please use a public repository.')
        setIsFetching(false)
        return
      }

      // If repository is public, fetch the issue details
      const issueResponse = await fetch(apiUrl)
      if (!issueResponse.ok) {
        setFetchError(`Error fetching issue details: ${issueResponse.statusText}`)
        setIsFetching(false)
        return
      }

      const issueData = await issueResponse.json()

      setFormData({
        title: issueData.title || `Issue: ${repoName} #${issueNum}`,
        repository: `${owner}/${repoName}`,
        issueNumber: issueNum,
        description: issueData.body || `No description provided. Original issue link: ${githubIssueUrlInput}`,
        githubLink: issueData.html_url || githubIssueUrlInput,
        keywords: repoName, // Default keyword to repo name, can be edited by user
        requirements: '' // Keep requirements empty for user input
      })
      setIsIssueDetailsFetched(true)
    } catch (error) {
      console.error('Failed to fetch GitHub issue:', error)
      setFetchError('Failed to fetch issue details. Check the console for more information or try again.')
    } finally {
      setIsFetching(false)
    }
  }

  // This now opens the modal instead of direct submission
  const handleOpenRewardModal = (e: React.FormEvent) => {
    e.preventDefault()
    // Potentially add form validation here before opening modal
    setIsRewardModalOpen(true)
  }
  
  // This will be called by the RewardModal
  const handleFinalBountySubmit = async (rewardAmount: string) => {
    setIsSubmittingBounty(true); // Start loading
    const fullBountyData: FullBountyData = {
      ...formData,
      reward: rewardAmount
    }
    try {
      await onBountySubmit(fullBountyData) // Assuming onBountySubmit might be async
      // Reset form and state after successful submission through modal
      setGithubIssueUrlInput('')
      setFormData(initialFormData)
      setIsIssueDetailsFetched(false)
      setFetchError(null)
    } catch (error) {
      console.error("Error submitting bounty:", error);
      // Handle submission error (e.g., show a toast notification)
      // For now, just logging and keeping modal open or re-opening with error
      // Or, the parent component (onBountySubmit) should handle error display
    } finally {
      setIsSubmittingBounty(false); // Stop loading
      setIsRewardModalOpen(false); // Close modal regardless of success/failure for now
    }
  }

  const handleResetAndCancel = () => {
    setGithubIssueUrlInput('')
    setFormData(initialFormData)
    setIsIssueDetailsFetched(false)
    setFetchError(null)
    onCancel() // Call the original cancel prop to switch tab
  }

  return (
    <Card className="p-4 md:p-6 shadow-sm dark:bg-card">
      {!isIssueDetailsFetched ? (
        <div className="space-y-4">
          <CardHeader className="p-0 mb-2">
            <CardTitle className='text-xl font-semibold'>Link GitHub Issue</CardTitle>
            <CardDescription className='text-muted-foreground'>
              Paste the full URL of the GitHub issue to create a bounty.
            </CardDescription>
            <p className='text-sm text-muted-foreground mt-1'>
              <AlertCircle className="h-3 w-3 mr-1.5 inline-block relative -top-px" />
              Important: Make sure your repository is set to "Public".
            </p>
          </CardHeader>
          <div className="space-y-1">
            <label className="text-sm font-medium leading-none sr-only" htmlFor="githubIssueUrlInput">
              GitHub Issue URL
            </label>
            <Input
              id="githubIssueUrlInput"
              name="githubIssueUrlInput"
              type="url"
              placeholder="https://github.com/owner/repo/issues/123"
              value={githubIssueUrlInput}
              onChange={(e) => setGithubIssueUrlInput(e.target.value)}
              className="border-border focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
          {fetchError && (
            <div className="flex items-center text-sm text-destructive">
              <AlertCircle className="h-4 w-4 mr-2" />
              {fetchError}
            </div>
          )}
          <Button 
            onClick={handleFetchIssue} 
            disabled={!githubIssueUrlInput || isFetching}
            className="w-full gradient-bg hover:opacity-90 text-white"
          >
            <GithubIcon className="h-4 w-4 mr-2" />
            {isFetching ? 'Fetching...' : 'Fetch Issue Details'}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleOpenRewardModal}>
          <CardHeader className="p-0 mb-4">
            <CardTitle className='text-xl font-semibold'>Confirm & Add Bounty Details</CardTitle>
            <CardDescription className='text-muted-foreground'>
              Review the fetched details and add remaining information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium leading-none" htmlFor="title">Bounty Title</label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required className="border-border focus:ring-orange-500 focus:border-orange-500"/>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium leading-none" htmlFor="keywords">Keywords (comma-separated)</label>
                <Input id="keywords" name="keywords" placeholder="e.g., react, bug, documentation" value={formData.keywords} onChange={handleInputChange} className="border-border focus:ring-orange-500 focus:border-orange-500"/>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium leading-none" htmlFor="repository">Repository</label>
                <Input id="repository" name="repository" value={formData.repository} onChange={handleInputChange} required readOnly className="border-border bg-muted/50 focus:ring-orange-500 focus:border-orange-500"/>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium leading-none" htmlFor="issueNumber">Issue Number</label>
                <Input id="issueNumber" name="issueNumber" type="number" value={formData.issueNumber} onChange={handleInputChange} required readOnly className="border-border bg-muted/50 focus:ring-orange-500 focus:border-orange-500"/>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium leading-none" htmlFor="githubLink">GitHub Issue URL</label>
              <Input id="githubLink" name="githubLink" type="url" value={formData.githubLink} onChange={handleInputChange} required readOnly className="border-border bg-muted/50 focus:ring-orange-500 focus:border-orange-500"/>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium leading-none" htmlFor="description">Description</label>
              <Textarea id="description" name="description" rows={4} value={formData.description} onChange={handleInputChange} required className="border-border focus:ring-orange-500 focus:border-orange-500"/>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium leading-none" htmlFor="requirements">Requirements (one per line)</label>
              <Textarea id="requirements" name="requirements" placeholder="- Detailed requirement 1...\n- Detailed requirement 2..." rows={3} value={formData.requirements} onChange={handleInputChange} className="border-border focus:ring-orange-500 focus:border-orange-500"/>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 pt-4 p-0 mt-6">
            <Button type="button" variant="outline" onClick={handleResetAndCancel} className="border-border hover:bg-muted">
              Cancel & Start Over
            </Button>
            <Button type="submit" className="gradient-bg hover:opacity-90 text-white">
              <PlusIcon className="h-4 w-4 mr-2" />
              Attach Bounty
            </Button>
          </CardFooter>
          <RewardModal 
            isOpen={isRewardModalOpen} 
            onClose={() => setIsRewardModalOpen(false)} 
            onSubmit={handleFinalBountySubmit}
            isLoading={isSubmittingBounty}
            currentBountyTitle={formData.title}
          />
        </form>
      )}
    </Card>
  )
} 