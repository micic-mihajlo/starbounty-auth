'use client'

import { useState, useMemo, useEffect } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BountyCardItem } from '@/components/bounties/bounty-card-item' // Reusing for display
import { BriefcaseIcon, CheckCircleIcon, HourglassIcon } from 'lucide-react'

// Assuming Bounty type is similar to the one in bounties/page.tsx
// Ideally, this would be a shared type
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
  status: 'open' | 'in progress' | 'closed' | 'applied' // Added 'applied' for developer context
  creatorUsername?: string
  // Developer-specific status for the dashboard might be needed
  developerStatus?: 'applied' | 'working' | 'submitted' | 'completed'
}

// Mock data - simulating bounties associated with the current user
// In a real app, this would be fetched based on the logged-in user
const mockUserBounties_DATA: Bounty[] = [
  {
    id: '3',
    title: 'Refactor Frontend State Management to Zustand',
    repository: 'starbounty/frontend',
    issueNumber: 103,
    description: 'Migrate the existing frontend state management from Context API to Zustand for better scalability and developer experience.',
    keywords: ['frontend', 'react', 'zustand', 'refactor', 'state management'],
    githubLink: 'https://github.com/example/project/issues/103',
    requirements: ['...'],
    reward: '350 USDC',
    status: 'in progress', // Overall status
    developerStatus: 'working', // Developer's engagement status
    creatorUsername: 'projectlead'
  },
  {
    id: 'bounty-applied-1',
    title: 'New Feature: Dark Mode Toggle',
    repository: 'starbounty/frontend',
    issueNumber: 105,
    description: 'Implement a dark mode toggle for the application.',
    keywords: ['ui', 'dark mode', 'theme'],
    githubLink: 'https://github.com/example/project/issues/105',
    requirements: ['Accessible', 'Persists preference'],
    reward: '100 XLM',
    status: 'open', // Bounty is still open for others
    developerStatus: 'applied', // Developer has applied
    creatorUsername: 'starbountyadmin'
  },
  {
    id: 'bounty-completed-1',
    title: 'Fix Login Button Styling on Mobile',
    repository: 'starbounty/frontend',
    issueNumber: 98,
    description: 'The login button has alignment issues on small screens.',
    keywords: ['bug', 'css', 'mobile', 'ui'],
    githubLink: 'https://github.com/example/project/issues/98',
    requirements: ['Test on multiple devices'],
    reward: '50 USDC',
    status: 'closed', // Bounty is closed
    developerStatus: 'completed', // Developer completed this
    creatorUsername: 'janedev'
  },
]

export default function DeveloperDashboardPage() {
  const [userBounties, setUserBounties] = useState<Bounty[]>(mockUserBounties_DATA)

  // Memoize filtered lists
  const activeBounties = useMemo(() => {
    return userBounties.filter(b => b.developerStatus === 'working' || b.developerStatus === 'applied')
  }, [userBounties])

  const completedBounties = useMemo(() => {
    return userBounties.filter(b => b.developerStatus === 'completed')
  }, [userBounties])

  // Dummy function for when a bounty card is clicked.
  // In the future, this might navigate to a detailed view or a submission flow.
  const handleViewBountyDetails = (bounty: Bounty) => {
    console.log('Viewing details for bounty:', bounty.title)
    // Potentially route to /bounties/[id] or a specific work submission page
  }

  const getBountiesOfUser = async () => {
    const result = await fetch('/api/getuserbounties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    const data = await result.json()
    console.log(data)
    if (data.bounties.length > 0) {
      setUserBounties(data.bounties)
    }
  }

  useEffect(() => {
    getBountiesOfUser()
  }, [])

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 pt-12 md:pt-16">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text">
            Developer Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Track your bounties, manage your work, and view your contributions.
          </p>
        </header>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-2 mb-6 max-w-md mx-auto md:mx-0">
            <TabsTrigger value="active">
              <HourglassIcon className="h-4 w-4 mr-2" /> Active Bounties
            </TabsTrigger>
            <TabsTrigger value="completed">
              <CheckCircleIcon className="h-4 w-4 mr-2" /> Completed Bounties
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {activeBounties.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeBounties.map((bounty) => (
                  <BountyCardItem
                    key={bounty.id}
                    bounty={bounty}
                    // onViewDetails will likely need to be adapted for the dashboard context
                    onViewDetails={() => handleViewBountyDetails(bounty)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card border border-dashed rounded-lg">
                <BriefcaseIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Active Bounties</h3>
                <p className="text-muted-foreground">
                  You haven\'t applied for or started working on any bounties yet.
                </p>
                {/* Optional: Add a button to browse bounties */}
                {/* <Button asChild className="mt-4 gradient-bg text-white">
                  <Link href="/bounties">Browse Bounties</Link>
                </Button> */}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completedBounties.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {completedBounties.map((bounty) => (
                  <BountyCardItem
                    key={bounty.id}
                    bounty={bounty}
                    onViewDetails={() => handleViewBountyDetails(bounty)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card border border-dashed rounded-lg">
                <CheckCircleIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Completed Bounties</h3>
                <p className="text-muted-foreground">You haven\'t completed any bounties yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
} 