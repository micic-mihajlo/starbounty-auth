'use client'

import { UserProfile } from '@clerk/nextjs'
import WalletDisplay from '@/components/auth/wallet-display'
import { WalletProvider } from '@/context/wallet-context'
import { Wallet as WalletIcon } from 'lucide-react'

export default function AccountPage() {
  return (
    <WalletProvider>
      <div className="container mx-auto px-4 py-8 pt-24"> {/* Added pt-24 for navbar offset */}
        <UserProfile path="/account" routing="path">
          {/* Default Clerk pages will render here (Profile, Security) */}
          
          {/* Custom Wallet Page */}
          <UserProfile.Page label="Wallet" url="wallet" labelIcon={<WalletIcon className="h-4 w-4" />}>
            <div className="w-full lg:max-w-md mt-0">
              {/* <h2 className="text-2xl font-semibold mb-4 text-zinc-900">Wallet Details</h2> */}
              {/* The UserProfile.Page will provide its own title/heading structure */}
              <WalletDisplay />
            </div>
          </UserProfile.Page>
          
          {/* You can re-add default pages if you want to control order or customize them, e.g.: */}
          {/* <UserProfile.Page label="account" url="" /> */}
          {/* <UserProfile.Page label="security" url="security" /> */}
        </UserProfile>
      </div>
    </WalletProvider>
  )
} 