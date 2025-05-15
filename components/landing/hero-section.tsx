'use client'

import { Button } from "@/components/ui/button"
import { Safari } from "@/components/magicui/safari"
import { AuroraText } from "@/components/magicui/aurora-text"

interface HeroSectionProps {
  onStartClick: () => void
}

export function HeroSection({ onStartClick }: HeroSectionProps) {
  const projectColors = ["#f97316", "#facc15"] // Orange-500 and Yellow-400

  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-b from-white via-orange-50/50 to-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full inline-block text-sm font-medium mb-6">
          <span className="mr-2">🎉</span> StarBounty is now live! Secure your code with passkeys.
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Turn Coding Tasks into{" "}
          <AuroraText colors={projectColors} className="font-bold">
            Secure Bounties
          </AuroraText>
        </h1>
        <p className="text-lg md:text-xl text-zinc-700 max-w-3xl mx-auto mb-10 leading-relaxed">
          Power your decentralized projects with on-chain bounties, secured by passkeys and Soroban smart contracts. Focus on building, not on payout complexities.
        </p>
        <div className="flex justify-center items-center gap-4 mb-12">
          <Button onClick={onStartClick} size="lg" className="gradient-bg text-white text-lg px-8 py-6">
            Get Started for Free
          </Button>
        </div>

        <div className="relative mt-16 max-w-4xl mx-auto">
          <Safari
            url="app.starbounty.io"
            imageSrc="https://firecrawl.dev/_next/image?url=%2F_static%2Fscreenshot-1.png&w=1080&q=75"
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  )
} 