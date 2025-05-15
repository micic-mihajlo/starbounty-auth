'use client'

import { Button } from "@/components/ui/button"
import { StarIcon, MenuIcon } from "lucide-react"

interface NavbarProps {
  onAuthClick: () => void
}

export function Navbar({ onAuthClick }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <StarIcon className="h-8 w-8 text-orange-500" />
            <span className="ml-2 text-2xl font-bold gradient-text">StarBounty</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-zinc-600 hover:text-orange-500 transition-colors">Playground</a>
            <a href="#" className="text-zinc-600 hover:text-orange-500 transition-colors">Templates</a>
            <a href="#" className="text-zinc-600 hover:text-orange-500 transition-colors">Docs</a>
            <a href="#" className="text-zinc-600 hover:text-orange-500 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center">
            <Button onClick={onAuthClick} variant="outline" className="mr-2 hidden md:inline-flex">
              Sign In
            </Button>
            <Button onClick={onAuthClick} className="gradient-bg text-white hidden md:inline-flex">
              Sign Up
            </Button>
            {/* Mobile menu button - functionality to be added */}
            <Button variant="ghost" className="md:hidden">
              <MenuIcon className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
} 