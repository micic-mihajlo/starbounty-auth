'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ExternalLinkIcon, SearchIcon, XIcon } from 'lucide-react' // Assuming lucide-react for icons

// Data Structure
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

// Mock Data
const mockBounties: Bounty[] = [
  {
    id: '1',
    title: 'Implement User Authentication Flow',
    repository: 'starbounty/frontend',
    issueNumber: 101,
    description: 'Create a complete user authentication flow using email/password and social logins. Must be robust and secure.',
    keywords: ['auth', 'react', 'nextjs', 'security', 'passkeys'],
    githubLink: 'https://github.com/example/project/issues/101',
    requirements: [
      'Email/password signup and login.',
      'Google OAuth integration.',
      'Passkey support for login.',
      'Password reset functionality.',
      'Secure session management.'
    ],
    reward: '500 USDC',
    status: 'open',
  },
  {
    id: '2',
    title: 'Develop API for Bounty Management',
    repository: 'starbounty/backend',
    issueNumber: 102,
    description: 'Build RESTful API endpoints for creating, updating, and listing bounties. Ensure proper documentation.',
    keywords: ['api', 'nodejs', 'express', 'database', 'soroban'],
    githubLink: 'https://github.com/example/project/issues/102',
    requirements: [
      'CRUD operations for bounties.',
      'Input validation and error handling.',
      'Authentication and authorization for endpoints.',
      'Integration with Soroban smart contract for payouts.',
      'Swagger/OpenAPI documentation.'
    ],
    reward: '800 XLM',
    status: 'open',
  },
  {
    id: '3',
    title: 'Refactor Frontend State Management to Zustand',
    repository: 'starbounty/frontend',
    issueNumber: 103,
    description: 'Migrate the existing frontend state management from Context API to Zustand for better scalability and developer experience.',
    keywords: ['frontend', 'react', 'zustand', 'refactor', 'state management'],
    githubLink: 'https://github.com/example/project/issues/103',
    requirements: [
      'Analyze current Context API setup.',
      'Create Zustand stores for global and feature-specific state.',
      'Replace Context API usage in all relevant components.',
      'Ensure no regressions in functionality and improve performance.'
    ],
    reward: '350 USDC',
    status: 'in progress',
  },
  {
    id: '4',
    title: 'Setup CI/CD Pipeline for Deployment',
    repository: 'starbounty/platform-ops',
    issueNumber: 104,
    description: 'Configure a continuous integration and deployment pipeline using GitHub Actions for automated builds, tests, and deployments.',
    keywords: ['ci/cd', 'github actions', 'deployment', 'devops', 'automation'],
    githubLink: 'https://github.com/example/project/issues/104',
    requirements: [
      'Automated builds on push to main and develop branches.',
      'Execution of unit and integration tests.',
      'Deployment to staging and production environments with manual approval for production.',
      'Notifications for build and deployment status.'
    ],
    reward: '450 XLM',
    status: 'open',
  },
  {
    id: '5',
    title: 'UI/UX Design for Bounty Details Page',
    repository: 'starbounty/design',
    issueNumber: 25,
    description: 'Create a modern and user-friendly design for the bounty details page, focusing on clarity and ease of information access.',
    keywords: ['ui/ux', 'figma', 'design', 'visuals', 'user experience'],
    githubLink: 'https://github.com/example/project/issues/25',
    requirements: [
      'Wireframes for key sections.',
      'High-fidelity mockups for desktop and mobile.',
      'Interactive prototype showcasing user flow.',
      'Style guide for new components introduced.'
    ],
    reward: '600 USDC',
    status: 'open',
  }
]

// Helper to get status badge color
function getStatusColor(status: Bounty['status']): string {
  switch (status) {
    case 'open':
      return 'bg-green-500 hover:bg-green-600'
    case 'in progress':
      return 'bg-yellow-500 hover:bg-yellow-600'
    case 'closed':
      return 'bg-red-500 hover:bg-red-600'
    default:
      return 'bg-gray-500 hover:bg-gray-600'
  }
}

export default function BountiesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null)

  const filteredBounties = useMemo(() => {
    return mockBounties.filter(bounty =>
      bounty.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bounty.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bounty.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase())) ||
      bounty.repository.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  if (selectedBounty) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
        <Button onClick={() => setSelectedBounty(null)} variant="outline" className="mb-6">
          <XIcon className="h-4 w-4 mr-2" /> Back to List
        </Button>
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-bold gradient-text">{selectedBounty.title}</CardTitle>
                <CardDescription className="text-lg text-zinc-600">
                  {selectedBounty.repository} #{selectedBounty.issueNumber}
                </CardDescription>
              </div>
              <Badge className={`text-sm text-white ${getStatusColor(selectedBounty.status)}`}>{selectedBounty.status.toUpperCase()}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-800">Description</h3>
              <p className="text-zinc-700 leading-relaxed whitespace-pre-wrap">{selectedBounty.description}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-800">Reward</h3>
              <p className="text-zinc-700 font-semibold text-lg">{selectedBounty.reward}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-800">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {selectedBounty.keywords.map(keyword => (
                  <Badge key={keyword} variant="secondary" className="text-sm">{keyword}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-800">Requirements</h3>
              <ul className="list-disc list-inside space-y-1 text-zinc-700 pl-2">
                {selectedBounty.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Link href={selectedBounty.githubLink} target="_blank" rel="noopener noreferrer">
              <Button className="gradient-bg text-white">
                View on GitHub <ExternalLinkIcon className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-bold tracking-tight gradient-text">Available Bounties</h1>
        <p className="text-xl text-zinc-600 mt-2">Find exciting tasks and contribute to StarBounty!</p>
      </header>

      <div className="mb-8 max-w-xl mx-auto">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search bounties by title, keyword, repository..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-base rounded-lg border-zinc-300 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
          />
        </div>
      </div>

      {filteredBounties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBounties.map(bounty => (
            <Card key={bounty.id} className="flex flex-col hover:shadow-xl transition-shadow duration-300 cursor-pointer rounded-lg overflow-hidden border border-zinc-200">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-semibold text-zinc-800 hover:text-orange-600 transition-colors">
                    {bounty.title}
                  </CardTitle>
                  <Badge className={`text-xs text-white ${getStatusColor(bounty.status)}`}>{bounty.status.toUpperCase()}</Badge>
                </div>
                <CardDescription className="text-sm text-zinc-500">
                  {bounty.repository} #{bounty.issueNumber}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pb-4">
                <p className="text-sm text-zinc-600 line-clamp-3 mb-3 leading-relaxed">{bounty.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {bounty.keywords.slice(0, 3).map(keyword => (
                    <Badge key={keyword} variant="outline" className="text-xs px-2 py-0.5">{keyword}</Badge>
                  ))}
                  {bounty.keywords.length > 3 && <Badge variant="outline" className="text-xs">+{bounty.keywords.length - 3}</Badge>}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-2 pb-4 px-6 bg-zinc-50">
                <span className="text-lg font-semibold text-orange-600">{bounty.reward}</span>
                <Button size="sm" variant="ghost" onClick={() => setSelectedBounty(bounty)} className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <SearchIcon className="h-16 w-16 text-zinc-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-zinc-700 mb-2">No Bounties Found</h2>
          <p className="text-zinc-500">Try adjusting your search terms or check back later!</p>
        </div>
      )}
    </div>
  )
} 