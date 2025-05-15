import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
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
    <html lang="en" className="dark antialiased">
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans min-h-screen flex flex-col items-center justify-center`}>
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className={cn(
            "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 z-[-1]",
          )}
        />
        <AuthProvider>
          <Container>
            {children}
          </Container>
        </AuthProvider>
      </body>
    </html>
  )
}
