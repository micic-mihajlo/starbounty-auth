'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SearchIcon } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'

// New Component Imports
import { BountyCardItem } from '@/components/bounties/bounty-card-item'
import { SelectedBountyDetails } from '@/components/bounties/selected-bounty-details'
import { AttachBountyFlow } from '@/components/bounties/attach-bounty-flow'

// Shared types (assuming these would be moved to a shared file eventually)
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

// Mock Data - Keep it in the page for now, or move to a service/API call
const mockBounties_DATA: Bounty[] = [
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

export default function BountiesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null)
  const [activeTab, setActiveTab] = useState('browse')
  // mockBounties state allows adding new bounties for demo purposes
  const [mockBounties, setMockBounties] = useState<Bounty[]>(mockBounties_DATA)

  const filteredBounties = useMemo(() => {
    return mockBounties.filter(bounty =>
      bounty.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bounty.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bounty.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase())) ||
      bounty.repository.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, mockBounties])

  const handleBountySubmitFromFlow = (formData: BountyFormData) => {
    const newBounty: Bounty = {
      id: Date.now().toString(),
      title: formData.title,
      repository: formData.repository,
      issueNumber: parseInt(formData.issueNumber) || 0,
      description: formData.description,
      keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean),
      githubLink: formData.githubLink,
      requirements: formData.requirements.split('\n').map(r => r.trim()).filter(Boolean),
      reward: formData.reward,
      status: 'open'
    }
    setMockBounties(prev => [newBounty, ...prev])
    setSelectedBounty(newBounty) 
    setActiveTab('browse')
  }

  const handleCancelAttach = () => {
    setActiveTab('browse')
  }

  if (selectedBounty) {
    return (
      <MainLayout>
        <SelectedBountyDetails bounty={selectedBounty} onClose={() => setSelectedBounty(null)} />
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="pt-12 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-white via-orange-50/50 to-transparent">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-2">Bounties</h1>
          <p className="text-muted-foreground">Find existing bounties or create your own by linking a GitHub issue.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="browse">Browse Bounties</TabsTrigger>
            <TabsTrigger value="attach">Attach Bounty</TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <div className="relative mb-6">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by title, description, keywords, repository..."
                className="pl-10 py-3 text-base border-border focus:ring-orange-500 focus:border-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {filteredBounties.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                {filteredBounties.map((bounty) => (
                  <BountyCardItem key={bounty.id} bounty={bounty} onViewDetails={setSelectedBounty} />
                ))}
              </div>
            ) : (
              <p className='text-center text-muted-foreground py-8'>No bounties match your search.</p>
            )}
          </TabsContent>

          <TabsContent value="attach">
            <AttachBountyFlow 
              onBountySubmit={handleBountySubmitFromFlow} 
              onCancel={handleCancelAttach} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
} 