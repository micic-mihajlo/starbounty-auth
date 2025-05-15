'use client'

import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  onStartClick: () => void
}

export function HeroSection({ onStartClick }: HeroSectionProps) {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-b from-white via-orange-50/50 to-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full inline-block text-sm font-medium mb-6">
          <span className="mr-2">🎉</span> StarBounty is now live! Secure your code with passkeys.
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Turn Coding Tasks into <span className="gradient-text">Secure Bounties</span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-600 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
          Power your decentralized projects with on-chain bounties, secured by passkeys and Soroban smart contracts. Focus on building, not on payout complexities.
        </p>
        <div className="flex justify-center items-center gap-4 mb-12">
          <Button onClick={onStartClick} size="lg" className="gradient-bg text-white text-lg px-8 py-6">
            Get Started for Free
          </Button>
        </div>

        <div className="relative mt-16 max-w-4xl mx-auto">
           <div className="relative mx-auto border-zinc-800 dark:border-zinc-800 bg-zinc-800 border-[8px] rounded-t-xl h-[172px] max-w-[301px] md:h-[294px] md:max-w-[512px]">
            <div className="rounded-lg overflow-hidden h-[156px] md:h-[278px] bg-white dark:bg-zinc-800">
              <img src="https://firecrawl.dev/_next/image?url=%2F_static%2Fscreenshot-1.png&w=1080&q=75" alt="Code example" className="dark:hidden h-[156px] md:h-[278px] w-full rounded-lg object-cover"/>
              <img src="https://firecrawl.dev/_next/image?url=%2F_static%2Fscreenshot-1-dark.png&w=1080&q=75" alt="Code example dark" className="hidden dark:block h-[156px] md:h-[278px] w-full rounded-lg object-cover"/>
            </div>
          </div>
          <div className="relative mx-auto bg-zinc-800 dark:bg-zinc-700 border-zinc-800 dark:border-zinc-800 border-[8px] rounded-b-xl rounded-t-none h-[172px] max-w-[301px] md:h-[294px] md:max-w-[512px]">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-full max-w-[300px] md:max-w-[520px] h-[44px] md:h-[48px] bg-zinc-800 rounded-full z-[-1]"></div> {/* Fake URL bar */}
            <div className="rounded-b-lg overflow-hidden h-[156px] md:h-[278px] bg-zinc-900">
              <pre className="text-left text-xs md:text-sm text-zinc-300 p-4 overflow-x-auto">
                <code className="language-json">
{`[
  {
    "url": "https://starbounty.example/task-123",
    "markdown": "# Implement User Authentication...",
    "json": { "title": "Auth Module", "reward": "500 XLM", "status": "open" },
    "screenshot": "https://starbounty.example/preview.png",
  }
  ...
]`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 