'use client'

import Link from 'next/link'
import { MenuIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button' // Assuming you have a Button component
import { Navbar } from '@/components/layout/navbar' // Import existing Navbar

interface NavLinkProps {
  href: string
  children: React.ReactNode
  onClick?: () => void
}

function NavLink({ href, children, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className='text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium'
    >
      {children}
    </Link>
  )
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className='min-h-screen flex flex-col bg-background text-foreground'>
      <Navbar /> {/* Use existing Navbar */}
      <main className='flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 md:pt-20'>
        {children}
      </main>
      <footer className='border-t border-border/40 py-6 text-center text-xs text-muted-foreground bg-background'>
        © {new Date().getFullYear()} StarBounty. All rights reserved.
      </footer>
    </div>
  )
} 