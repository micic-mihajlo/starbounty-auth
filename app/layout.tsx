import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"
import { Background } from "@/components/ui/background"
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
        <Background />
        <AuthProvider>
          <Container>
            {children}
          </Container>
        </AuthProvider>
      </body>
    </html>
  )
}
