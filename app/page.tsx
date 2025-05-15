import { Suspense } from "react"
import AuthenticationSection from "@/components/auth/authentication-section"
import { WalletProvider } from "@/context/wallet-context"
import { Toaster } from "@/components/ui/toaster"
import { StarIcon } from "lucide-react"

export default function Home() {
  return (
    <WalletProvider>
      <div className="min-h-screen text-white dot-pattern flex flex-col">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-normal filter blur-[120px] opacity-30 pulse-slow glow"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full mix-blend-normal filter blur-[120px] opacity-30 pulse-slow glow-purple"></div>
          
          {/* Additional subtle orbs */}
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-indigo-600/10 rounded-full mix-blend-normal filter blur-[80px] opacity-20"></div>
          <div className="absolute bottom-1/3 left-2/3 w-48 h-48 bg-blue-500/10 rounded-full mix-blend-normal filter blur-[60px] opacity-20"></div>
        </div>

        <main className="container relative mx-auto px-4 py-20 flex-grow flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center space-y-16">
            <div className="text-center space-y-6 max-w-2xl">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="relative">
                  <StarIcon className="h-10 w-10 text-blue-500 relative z-10" />
                  <div className="absolute -inset-1 bg-blue-500/20 rounded-full blur-sm"></div>
                </div>
                <h1 className="text-6xl font-bold tracking-tight">
                  <span className="gradient-text">StarBounty</span>
                </h1>
              </div>
              <p className="text-xl text-zinc-300 max-w-2xl mx-auto font-light leading-relaxed">
                The coding-bounty marketplace secured by passkeys and Soroban smart contracts
              </p>
            </div>

            <Suspense
              fallback={
                <div className="h-64 w-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              }
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
