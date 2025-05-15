'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { StarIcon, MenuIcon, UserCircleIcon, BriefcaseIcon } from "lucide-react"
import { useAuth } from '@/context/AuthContext'
import { useWallet } from '@/context/wallet-context'

interface NavbarProps {
  onAuthClick?: () => void
}

export function Navbar({ onAuthClick }: NavbarProps) {
  const { user } = useAuth()
  const { isConnected } = useWallet()

  const isAuthenticated = user || isConnected

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <StarIcon className="h-8 w-8 text-orange-500" />
            <span className="ml-2 text-2xl font-bold gradient-text">StarBounty</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated && (
              <Link href="/bounties" className="text-zinc-600 hover:text-orange-500 transition-colors font-medium">
                <BriefcaseIcon className="h-5 w-5 mr-1 inline-block" />
                Bounties
              </Link>
            )}
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <Link href="/profile">
                <Button variant="ghost" className="text-zinc-700 hover:text-orange-600">
                  <UserCircleIcon className="h-6 w-6 mr-2" />
                  Profile
                </Button>
              </Link>
            ) : (
              <>
                {onAuthClick && (
                  <>
                    <Button onClick={onAuthClick} variant="outline" className="mr-2 hidden md:inline-flex">
                      Sign In
                    </Button>
                    <Button onClick={onAuthClick} className="gradient-bg text-white hidden md:inline-flex">
                      Sign Up
                    </Button>
                  </>
                )}
              </>
            )}
            <Button variant="ghost" className="md:hidden">
              <MenuIcon className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
} 