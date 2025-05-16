'use client'

// import { WalletProvider } from "@/context/wallet-context" // Removed WalletProvider
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from "@/components/layout/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { useRouter } from 'next/navigation'
import {
  SignedIn,
  SignedOut,
} from '@clerk/nextjs'

export default function Home() {
  const router = useRouter()

  const handleAuthNavigation = () => {
    router.push('/auth')
  }

  return (
    // <WalletProvider> // Removed WalletProvider wrapper
    <div className="min-h-screen text-zinc-900 flex flex-col bg-white">
      <Navbar onAuthClick={handleAuthNavigation} />
      <main className="flex-grow">
        <div className="flex flex-col mt-10">
          <SignedOut>
            {/* SignInButton and SignUpButton were here, but are handled by Navbar */}
          </SignedOut>
          <SignedIn>
            {/* UserButton was here, but is handled by Navbar */}
          </SignedIn>
        </div>

        <HeroSection onStartClick={handleAuthNavigation} />
      </main>
      <Toaster />
      <footer className="py-8 border-t border-zinc-200 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-zinc-500">
          &copy; {new Date().getFullYear()} StarBounty. All rights reserved.
        </div>
      </footer>
    </div>
    // </WalletProvider> // Removed WalletProvider wrapper
  )
}
