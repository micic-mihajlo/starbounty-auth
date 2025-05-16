import { Badge } from '@/components/ui/badge'

export type PrStatus = 'SUBMITTED' | 'MERGED' | 'CLOSED'

export function PrStatusBadge ({ status }: { status: PrStatus }) {
  const { text, classes } = getBadgeConfig(status)
  return (
    <Badge className={`text-xs px-3 py-1.5 rounded-md font-semibold whitespace-nowrap ${classes}`}>{text}</Badge>
  )
}

function getBadgeConfig (status: PrStatus) {
  switch (status) {
    case 'SUBMITTED':
      return { text: 'PR Submitted', classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' }
    case 'MERGED':
      return { text: 'PR Merged', classes: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' }
    case 'CLOSED':
      return { text: 'PR Closed', classes: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' }
    default:
      return { text: status, classes: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' }
  }
} 