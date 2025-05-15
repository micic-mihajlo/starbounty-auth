import {
  ClerkProvider
} from '@clerk/nextjs'
import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"
import { WalletProvider } from "@/context/wallet-context"
import { DotPattern } from "@/components/ui/dot-pattern"
import { cn } from "@/lib/utils"
import { Container } from "@/components/ui/container"

export const metadata: Metadata = {
  title: "StarBounty",
  description: "Decentralized bounty platform",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="antialiased">
        <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans min-h-screen flex flex-col`}>
          <DotPattern
            className={cn(
              "[mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]",
              "z-[-1]"
            )}
            cr={1}
            cx={1}
            cy={1}
          />
          <AuthProvider>
            <WalletProvider>
              <Container>
                {children}
              </Container>
            </WalletProvider>
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
