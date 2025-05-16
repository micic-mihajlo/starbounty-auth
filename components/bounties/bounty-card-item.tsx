'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GithubIcon } from 'lucide-react'

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
  status: 'OPEN' | 'IN_PROGRESS' | 'PR_SUBMITTED' | 'MERGED' | 'PAID' | 'CLOSED'
}

function getStatusColor(status: Bounty['status']): string {
  switch (status) {
    case 'OPEN': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'PR_SUBMITTED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'MERGED': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    case 'PAID': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'CLOSED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

interface BountyCardItemProps {
  bounty: Bounty
  onViewDetails: (bounty: Bounty) => void
}

export function BountyCardItem({ bounty, onViewDetails }: BountyCardItemProps) {
  return (
    <Card key={bounty.id} className="h-full flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200 dark:bg-card">
      <CardHeader className='pb-3'>
        <div className="flex justify-between items-start mb-1">
          <CardTitle className="text-lg font-semibold text-foreground leading-tight line-clamp-2">{bounty.title}</CardTitle>
          <Badge className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${getStatusColor(bounty.status)}`}>
            {bounty.status.toUpperCase()}
          </Badge>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          {bounty.repository} #{bounty.issueNumber}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow py-2">
        <p className="text-sm text-foreground/80 line-clamp-2 mb-2">{bounty.description}</p>
        {bounty.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {bounty.keywords.slice(0, 3).map((keyword) => (
              <Badge key={keyword} variant="secondary" className="text-xs px-1.5 py-0.5">{keyword}</Badge>
            ))}
            {bounty.keywords.length > 3 && <Badge variant="secondary" className="text-xs px-1.5 py-0.5">...</Badge>}
          </div>
        )}
        <p className="text-sm font-medium text-foreground">Reward: {bounty.reward}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-3">
        <Button variant="outline" size="sm" asChild className="text-xs">
          <Link href={bounty.githubLink} target="_blank" rel="noopener noreferrer">
            <GithubIcon className="h-3.5 w-3.5 mr-1.5" />
            View Issue
          </Link>
        </Button>
        <Button onClick={() => onViewDetails(bounty)} size="sm" className="text-xs gradient-bg hover:opacity-90 text-white">
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
} 