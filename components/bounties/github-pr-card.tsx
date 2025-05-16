import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLinkIcon } from 'lucide-react'
import { PrStatusBadge, PrStatus } from './pr-status-badge'

export interface GithubPrCardProps {
  number: number
  title: string
  repo: string
  status: PrStatus
  htmlUrl: string
  demoUrl?: string | null
}

export function GithubPrCard ({ number, title, repo, status, htmlUrl, demoUrl }: GithubPrCardProps) {
  return (
    <Card className='border-border shadow-sm'>
      <CardHeader className='bg-muted/30 p-4 flex flex-row items-start justify-between gap-4'>
        <div>
          <CardTitle className='text-base font-semibold text-foreground'>#{number} – {title}</CardTitle>
          <p className='text-sm text-muted-foreground mt-0.5'>{repo}</p>
        </div>
        <PrStatusBadge status={status} />
      </CardHeader>
      <CardContent className='p-4 space-y-2'>
        {demoUrl && (
          <p className='text-sm'><span className='font-medium'>Demo:</span> <Link href={demoUrl} target='_blank' className='underline text-primary'>{demoUrl}</Link></p>
        )}
      </CardContent>
      <CardFooter className='p-4 pt-0'>
        <Link href={htmlUrl} target='_blank' className='inline-flex items-center text-sm underline'>
          <ExternalLinkIcon className='h-4 w-4 mr-1' /> View on GitHub
        </Link>
      </CardFooter>
    </Card>
  )
} 