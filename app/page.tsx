import { Suspense } from "react"
import AuthenticationSection from "@/components/auth/authentication-section"
import { WalletProvider } from "@/context/wallet-context"
import { Toaster } from "@/components/ui/toaster"
import { StarIcon } from "lucide-react"

export default function Home() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-[#0a101f] bg-gradient-to-b from-[#0a101f] to-[#111827] text-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-15"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-15"></div>
        </div>

        <main className="container relative mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <StarIcon className="h-8 w-8 text-blue-500" />
                <h1 className="text-5xl font-bold tracking-tight">
                  <span className="gradient-text">StarBounty</span>
                </h1>
              </div>
              <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
                The coding-bounty marketplace secured by passkeys and Soroban smart contracts
              </p>
            </div>

            <Suspense
              fallback={<div className="h-64 w-full flex items-center justify-center">Loading authentication...</div>}
            >
              <AuthenticationSection />
            </Suspense>
          </div>
        </main>
        <Toaster />
      </div>
    </WalletProvider>
  )
}
