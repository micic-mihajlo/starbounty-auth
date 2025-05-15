'use client'

import { Button } from "@/components/ui/button"
import { AuroraText } from "@/components/magicui/aurora-text"
import { AnimatedSpan, Terminal, TypingAnimation } from '@/components/magicui/terminal'
import { motion } from 'framer-motion'

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

        <motion.div
          className="relative mt-16 max-w-4xl mx-auto flex flex-col items-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Terminal className='max-w-md w-full'>
            <TypingAnimation>
              &gt; starbounty_cli deploy --bounty issue-42
            </TypingAnimation>
            <AnimatedSpan delay={2500} className='text-green-500'>
              <span>🚀 Deploying bounty to Soroban network...</span>
            </AnimatedSpan>
            <AnimatedSpan delay={3500} className='text-green-500'>
              <span>✅ Bounty deployed successfully!</span>
            </AnimatedSpan>
            <AnimatedSpan delay={4500}>
              <span>🔒 Secured with Passkeys. Earn crypto!</span>
            </AnimatedSpan>
          </Terminal>
        </motion.div>
      </div>
    </section>
  )
} 