'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { MenuIcon, BriefcaseIcon, Wallet as WalletIcon, User as UserIcon } from "lucide-react"
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs"

import WalletDisplay from '@/components/auth/wallet-display'
import { useWallet, WalletProvider } from '@/context/wallet-context'
import { useEffect, useState } from 'react'
import PasskeyCreationFlow from '../auth/passkey-creation-flow'

export function Navbar() {
  const { address, isConnected, isLoading, createPasskeyWallet, connectPasskeyWallet, userProfile, setUserProfile } = useWallet();
  const [generateWallet, setGenerateWallet] = useState(false)
  const { user } = useUser();
  const [isGeneratingWallet, setIsGeneratingWallet] = useState(false)

  const updateAddress = async () => {
    const response = await fetch('/api/wallet-binding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address }),
    })

    const data = await response.json()
  }

  useEffect(() => {
    if (address) {
      updateAddress()
    } else if (!isLoading && !isConnected && !address && user) {
      setGenerateWallet(true)
    }
  }, [address, isConnected, isLoading, user, generateWallet])

  const generateWalletUsingUsername = async (username: string) => {
    setIsGeneratingWallet(true)
    await createPasskeyWallet(username)
    await connectPasskeyWallet();
    setGenerateWallet(false)
    setIsGeneratingWallet(false)
  }

  useEffect(() => {
    if (generateWallet && user && user.username && !isLoading && !address) {
      generateWalletUsingUsername(user.username)
    }
  }, [generateWallet, user, user?.username, isLoading, address])

  const getUserProfile = async () => {
    const response = await fetch('/api/getuserprofile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    setUserProfile(data.user)
  }

  useEffect(() => {
    if (!userProfile) {
      getUserProfile()
    }
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Image src="/bounty-logo.png" alt="StarBounty Logo" width={32} height={32} className="h-8 w-8" />
            <span className="ml-2 text-2xl font-bold">StarBounty</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <SignedIn>
              <Link href="/bounties" className="text-zinc-600 hover:text-orange-500 transition-colors font-medium">
                Bounties
              </Link>
              <Link href="/profile" className="text-zinc-600 hover:text-orange-500 transition-colors font-medium">
                Profile
              </Link>
            </SignedIn>
          </div>
          <div className="flex items-center">
            {isGeneratingWallet ? (
              <Loader2Icon className="h-5 w-5 mr-1 inline-block animate-spin" />
            ) : (
              <div>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button asChild variant="outline" className="mr-2 hidden md:inline-flex">
                      <a>Sign In</a>
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button asChild className="gradient-bg text-white hidden md:inline-flex">
                      <a>Sign Up</a>
                    </Button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton afterSignOutUrl="/">
                    {/* Custom Wallet Page for the UserProfile Modal */}
                    <UserButton.UserProfilePage label="Wallet" url="wallet" labelIcon={<WalletIcon className="h-4 w-4" />}>
                      <WalletProvider>
                        <div className="p-4 flex justify-center w-full">
                          <WalletDisplay />
                        </div>
                      </WalletProvider>
                    </UserButton.UserProfilePage>
                  </UserButton>
                </SignedIn>
              </div>
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