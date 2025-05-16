'use client'

import { useAuth } from '@/context/AuthContext' // Assuming AuthContext holds user info
import { useWallet } from '@/context/wallet-context' // Assuming WalletContext holds wallet info
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { GithubIcon, WalletIcon, UserIcon, LogOutIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'

export default function ProfilePage() {
  const { user, logout } = useAuth() // Replace with your actual auth context/hook
  const { address, balance, disconnectWallet, userProfile, setUserProfile  } = useWallet() // Replace with your actual wallet context/hook
  const router = useRouter()

  // Mock GitHub data for now
  const githubUser = !user ? {
    backup_code_enabled: false,
    banned: false,
    create_organization_enabled: true,
    created_at: 1747342933586,
    delete_self_enabled: true,
    email_addresses: [[Object]],
    enterprise_accounts: [],
    external_accounts: [[Object]],
    external_id: null,
    first_name: 'Satyam',
    has_image: true,
    id: 'user_2x9GZrT9kKG7ffuvQ1PIrj6xGug',
    image_url: 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ2l0aHViL2ltZ18yeDlHWm16b015Uk1RODZ4QUxUdjA4TkdrTGgifQ',
    last_active_at: 1747342933585,
    last_name: null,
    last_sign_in_at: null,
    legal_accepted_at: null,
    locked: false,
    lockout_expires_in_seconds: null,
    mfa_disabled_at: null,
    mfa_enabled_at: null,
    object: 'user',
    passkeys: [],
    password_enabled: false,
    phone_numbers: [],
    primary_email_address_id: 'idn_2x9GZohKl2tTunmP1b1Ha1q5Ffb',
    primary_phone_number_id: null,
    primary_web3_wallet_id: null,
    private_metadata: {},
    profile_image_url: 'https://images.clerk.dev/oauth_github/img_2x9JzqOqonmeRfBjPPhHYVerEJN',
    public_metadata: {},
    saml_accounts: [],
    totp_enabled: false,
    two_factor_enabled: false,
    unsafe_metadata: {},
    updated_at: 1747342933614,
    username: 'klausmikhaelson',
    verification_attempts_remaining: 100,
    web3_wallets: [],
    githubStats: {
      mostUsedLanguage: 'JavaScript',
      languageBreakdown: {
        TypeScript: 14,
        JavaScript: 33,
        Python: 4,
        HTML: 10,
        'Jupyter Notebook': 3,
        'C++': 1,
        Svelte: 1,
        EJS: 4,
        CSS: 3,
        Solidity: 1,
      },
    },
  } : null

  console.log(userProfile)

const handleLogout = async () => {
  await logout() // Auth context logout
  await disconnectWallet() // Wallet context disconnect
  router.push('/') // Redirect to home or login page
}

if (!user && !address) {
  // Optionally, redirect to login if not authenticated, or show a message
  // router.push('/auth');
  // return null; 
  // For now, showing a message if accessed directly without login
  return (
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen flex flex-col items-center justify-center">
      <UserIcon className="h-16 w-16 text-zinc-400 mb-4" />
      <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
      <p className="text-zinc-600 mb-6 text-center">Please log in to view your profile.</p>
      <Button onClick={() => router.push('/auth')}>Go to Login</Button>
    </div>
  )
}

return (
  <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
    <Navbar />
    <header className="mb-10 flex justify-between items-center">
      <h1 className="text-4xl font-bold tracking-tight gradient-text">Your Profile</h1>
      <Button variant="outline" onClick={handleLogout} className="text-red-600 hover:text-red-700 border-red-500 hover:border-red-600">
        <LogOutIcon className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Wallet Details Card */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center space-x-3 pb-4">
          <WalletIcon className="h-8 w-8 text-orange-500" />
          <div>
            <CardTitle className="text-2xl">Wallet Details</CardTitle>
            <CardDescription>Your connected Stellar wallet</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {address ? (
            <>
              <div>
                <h4 className="text-sm font-medium text-zinc-500">Public Address</h4>
                <p className="text-sm text-zinc-800 break-all font-mono bg-zinc-100 p-2 rounded-md">{address}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-zinc-500">Balance</h4>
                {/* This is a placeholder; actual balance fetching will depend on your wallet context implementation */}
                <p className="text-lg font-semibold text-zinc-800">{balance ? `${balance} XLM` : 'Loading...'}</p>
              </div>
              <Button variant="outline" onClick={disconnectWallet} className="w-full mt-2">
                Disconnect Wallet
              </Button>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-zinc-600">No wallet connected.</p>
              <Button onClick={() => router.push('/auth')} className="mt-2 gradient-bg text-white">
                Connect Wallet
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* GitHub Account Card */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center space-x-3 pb-4">
          <GithubIcon className="h-8 w-8 text-zinc-700" />
          <div>
            <CardTitle className="text-2xl">GitHub Account</CardTitle>
            <CardDescription>Your linked GitHub profile</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {userProfile ? (
            <div className="space-y-4">
              {/* User Profile Section */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 ring-2 ring-orange-500 ring-offset-2">
                  <AvatarImage src={userProfile.imageUrl} alt={userProfile.username} />
                  <AvatarFallback>{userProfile.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold text-zinc-800">{userProfile.username}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {userProfile.githubStats.mostUsedLanguage}
                    </span>
                    <a
                      href={`https://github.com/${userProfile.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-orange-600 hover:underline flex items-center"
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Language Stats */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-zinc-500 mb-2">Language Distribution</h4>
                <div className="space-y-2">
                  {Object.entries(userProfile.githubStats.languageBreakdown)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .slice(0, 5)
                    .map(([language, percentage]) => (
                      <div key={language} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{language}</span>
                          <span>{percentage}%</span>
                        </div>
                        <div className="w-full bg-zinc-200 rounded-full h-1.5">
                          <div 
                            className="bg-orange-500 h-1.5 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              
              {/* GitHub Actions */}
              <div className="mt-4 flex space-x-2">
                <a
                  href={`https://github.com/${userProfile.username}?tab=repositories`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 bg-zinc-800 text-white rounded-md hover:bg-zinc-700 transition-colors inline-flex items-center"
                >
                  Repositories
                </a>
                <a
                  href={`https://github.com/${userProfile.username}?tab=stars`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 border border-zinc-300 rounded-md hover:bg-zinc-100 transition-colors inline-flex items-center"
                >
                  Stars
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-zinc-600">GitHub account not linked.</p>
              {/* Placeholder for a button to link GitHub account */}
              <Button variant="outline" disabled className="mt-2 w-full">
                Link GitHub Account (Coming Soon)
              </Button>
            </div>
          )}
          {/* Placeholder for additional GitHub-related info if needed */}
        </CardContent>
      </Card>
    </div>
  </div>
)
} 