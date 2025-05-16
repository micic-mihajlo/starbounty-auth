'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { XIcon, ExternalLinkIcon, RocketIcon, UserIcon, Text } from 'lucide-react'

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
  creatorUsername?: string
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

interface SelectedBountyDetailsProps {
  bounty: Bounty
  onClose: () => void
}

export function SelectedBountyDetails({ bounty, onClose }: SelectedBountyDetailsProps) {
  const handleApplyClick = () => {
    console.log(`Applying for bounty: ${bounty.title} (ID: ${bounty.id})`);
    // Future: Implement application logic (e.g., open a modal, call an API)
  };

  const handleCheckProgressClick = async () => {
    console.log(bounty);
    console.log(`Checking progress for bounty: ${bounty.title} (ID: ${bounty.id})`);
    // call the api to check the progress

    const response = await fetch(`/api/bounties/${bounty.id}/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: bounty.id }),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <Button onClick={onClose} variant="outline" className="mb-6">
        <XIcon className="h-4 w-4 mr-2" /> Back to List
      </Button>
      <Card className="shadow-lg dark:bg-card border-border overflow-hidden">
        <CardHeader className="bg-muted/30 p-6">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-grow">
              <CardTitle className="text-2xl md:text-3xl font-bold text-foreground leading-tight">{bounty.title}</CardTitle>
              <CardDescription className="text-md text-muted-foreground mt-1">
                From repository: {bounty.repository} / Issue #{bounty.issueNumber}
              </CardDescription>
              {bounty.creatorUsername && (
                <div className="mt-2 text-sm text-muted-foreground flex items-center">
                  <UserIcon className="h-4 w-4 mr-1.5" />
                  Posted by: <span className="font-medium text-foreground/90 ml-1">{bounty.creatorUsername}</span>
                </div>
              )}
            </div>
            <Badge className={`text-xs px-3 py-1.5 rounded-md font-semibold whitespace-nowrap self-start ${getStatusColor(bounty.status)}`}>
              {bounty.status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Bounty Details</h3>
            <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{bounty.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-foreground/90">Reward</h3>
              <p className="text-xl font-bold gradient-text">{bounty.reward}</p>
            </div>
            {bounty.keywords.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground/90">Tech Stack / Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {bounty.keywords.map(keyword => (
                    <Badge key={keyword} variant="secondary" className="text-sm">{keyword}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {bounty.requirements.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2 text-foreground/90">Requirements</h3>
              <ul className="list-disc list-inside space-y-1.5 text-foreground/80 pl-2 bg-muted/30 p-4 rounded-md">
                {bounty.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-muted/30 p-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href={bounty.githubLink} target="_blank" rel="noopener noreferrer">
              <ExternalLinkIcon className="h-4 w-4 mr-2" />
              View Issue on GitHub
            </Link>
          </Button>
          {bounty.status === 'OPEN' && (
            <Button onClick={handleApplyClick} className="gradient-bg hover:opacity-90 text-white w-full sm:w-auto">
              <RocketIcon className="h-4 w-4 mr-2" />
              Apply for Bounty
            </Button>
          )}
          {/* check progress of the issue */}
          {/* {bounty.status === 'in progress' && ( */}
          <Button onClick={handleCheckProgressClick} className="gradient-bg hover:opacity-90 text-white w-full sm:w-auto">
            {/* add a progress icon */}
            <Text className="h-4 w-4 mr-2" />
            Check Progress
          </Button>
          {/* )} */}
        </CardFooter>
      </Card>
    </div>
  )
} 