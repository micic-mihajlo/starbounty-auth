'use client'

import { Suspense } from 'react'
import AuthenticationSection from "@/components/auth/authentication-section"
import { WalletProvider } from "@/context/wallet-context"
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from "@/components/layout/navbar" // Assuming Navbar might be needed here or in a layout
import Link from 'next/link'

export default function AuthPage() {
  return (
    <WalletProvider> {/* WalletProvider might be needed here for auth components */}
      {/* 
        A more robust layout strategy would be to have a RootLayout in app/layout.tsx 
        that includes Navbar for all pages, and then specific layouts for sub-routes if needed.
        For now, including Navbar here to maintain similar visual structure.
        Alternatively, if Navbar should always navigate away from /auth, it might not be rendered here.
      */}
      {/* <Navbar onAuthClick={() => {}} /> */}
      {/* Simple Navbar for auth page that links back to home, or omit if global navbar handles it */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              {/* You'll need StarIcon imported if you use it here */}
              {/* <StarIcon className="h-8 w-8 text-orange-500" /> */}
              <span className="ml-2 text-2xl font-bold gradient-text">StarBounty</span>
            </Link>
            <div>
              <Link href="/" className="text-zinc-600 hover:text-orange-500 transition-colors">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container relative mx-auto px-4 py-20 flex-grow flex flex-col items-center justify-center mt-16">
        <Suspense
          fallback={
            <div className="h-64 w-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          }
        >
          <AuthenticationSection />
        </Suspense>
      </main>
      <Toaster />
      {/* Basic Footer - consider a global footer in RootLayout */}
      <footer className="py-8 border-t border-zinc-200 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-zinc-500">
          &copy; {new Date().getFullYear()} StarBounty. All rights reserved.
        </div>
      </footer>
    </WalletProvider>
  )
} 