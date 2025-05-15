'use client'

import { cn } from '@/lib/utils'

interface BackgroundProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Background({ className, ...props }: BackgroundProps) {
  return (
    <div className={cn('fixed inset-0 -z-10 overflow-hidden bg-[#030014]', className)} {...props}>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      <div
        className="absolute left-[calc(50%-4rem)] top-10 aspect-[1155/678] w-[36.125rem] -translate-x-1/2 
          bg-gradient-to-tr from-[#3b82f6] to-[#4B0082] opacity-30 sm:left-[calc(50%-18rem)] sm:w-[72.1875rem]"
        style={{
          clipPath:
            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
        }}
      />
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] 
            bg-gradient-to-tr from-[#3b82f6] to-[#4B0082] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-20%,#3b82f6,transparent)] opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_80%_60%,#4B0082,transparent)] opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_400px_at_50%_50%,rgba(255,255,255,0.1),transparent)] opacity-30" />
    </div>
  )
} 