'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { XIcon, ExternalLinkIcon } from 'lucide-react'

// Duplicating Bounty and getStatusColor for now, ideally these would be imported from a shared types/utils file
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

function getStatusColor(status: Bounty['status']): string {
  switch (status) {
    case 'open': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'in progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'closed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

interface SelectedBountyDetailsProps {
  bounty: Bounty
  onClose: () => void
}

export function SelectedBountyDetails({ bounty, onClose }: SelectedBountyDetailsProps) {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <Button onClick={onClose} variant="outline" className="mb-6">
        <XIcon className="h-4 w-4 mr-2" /> Back to List
      </Button>
      <Card className="shadow-md dark:bg-card">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl md:text-3xl font-semibold text-foreground">{bounty.title}</CardTitle>
              <CardDescription className="text-md text-muted-foreground">
                {bounty.repository} #{bounty.issueNumber}
              </CardDescription>
            </div>
            <Badge className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(bounty.status)}`}>{bounty.status.toUpperCase()}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-1 text-foreground/90">Description</h3>
            <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{bounty.description}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-1 text-foreground/90">Reward</h3>
            <p className="text-foreground/80 font-semibold">{bounty.reward}</p>
          </div>
          {bounty.keywords.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-1 text-foreground/90">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {bounty.keywords.map(keyword => (
                  <Badge key={keyword} variant="secondary" className="text-xs">{keyword}</Badge>
                ))}
              </div>
            </div>
          )}
          {bounty.requirements.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-1 text-foreground/90">Requirements</h3>
              <ul className="list-disc list-inside space-y-1 text-foreground/80 pl-2">
                {bounty.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button asChild className="gradient-bg hover:opacity-90 text-white">
            <Link href={bounty.githubLink} target="_blank" rel="noopener noreferrer">
              View on GitHub <ExternalLinkIcon className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 