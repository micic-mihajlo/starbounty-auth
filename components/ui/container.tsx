'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div className={cn('container mx-auto px-4 py-8 relative z-10 font-geist', className)} {...props}>
      {children}
    </div>
  )
}

export function PageHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col items-center text-center space-y-2 py-12', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function PageHeaderHeading({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        'text-3xl font-bold tracking-tight text-gradient font-geist sm:text-4xl md:text-5xl lg:text-6xl',
        className
      )}
      {...props}
    />
  )
}

export function PageHeaderDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        'max-w-[700px] text-zinc-400 md:text-xl dark:text-zinc-400 font-geist',
        className
      )}
      {...props}
    />
  )
} 