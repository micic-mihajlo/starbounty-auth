"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useWallet } from "@/context/wallet-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import PasskeyCreationFlow from "./passkey-creation-flow"
import PasskeyConnectFlow from "./passkey-connect-flow"
import WalletDisplay from "./wallet-display"
import { RocketIcon, KeyIcon, WalletIcon, ArrowRightIcon } from "lucide-react"

export default function AuthenticationSection() {
  const { isConnected, address } = useWallet()
  const [authMode, setAuthMode] = useState<"none" | "create" | "connect">("none")

  if (isConnected && address) {
    return <WalletDisplay />
  }

  return (
    <div className="w-full max-w-md">
      <AnimatePresence mode="wait">
        {authMode === "none" && (
          <motion.div
            key="auth-options"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="gradient-border glass border-0 shadow-xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-violet-500 opacity-80"></div>
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-gradient font-geist">Get Started</CardTitle>
                <CardDescription className="text-zinc-300 font-geist">
                  Create or connect your secure passkey wallet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-between group text-white hover:text-blue-400 hover:border-blue-500/50 transition-all duration-300 h-16 glass font-geist"
                  onClick={() => setAuthMode("create")}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10">
                      <KeyIcon className="h-4 w-4 text-blue-400" />
                    </div>
                    <div className="text-left">
                      <span className="block font-medium">Create New Wallet</span>
                      <span className="text-xs text-zinc-400 group-hover:text-blue-300/70">Get started with a new account</span>
                    </div>
                  </div>
                  <ArrowRightIcon className="h-5 w-5 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" />
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-between group text-white hover:text-violet-400 hover:border-violet-500/50 transition-all duration-300 h-16 glass font-geist"
                  onClick={() => setAuthMode("connect")}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-violet-500/10">
                      <WalletIcon className="h-4 w-4 text-violet-400" />
                    </div>
                    <div className="text-left">
                      <span className="block font-medium">Connect Existing Wallet</span>
                      <span className="text-xs text-zinc-400 group-hover:text-violet-300/70">Sign in with your passkey</span>
                    </div>
                  </div>
                  <ArrowRightIcon className="h-5 w-5 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" />
                </Button>
              </CardContent>
              <CardFooter className="flex justify-center border-t border-white/5 pt-4">
                <p className="text-xs text-zinc-500 flex items-center gap-1 font-geist">
                  <RocketIcon className="h-3 w-3" />
                  Powered by Soroban Smart Contracts
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {authMode === "create" && (
          <motion.div
            key="create-flow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <PasskeyCreationFlow onBack={() => setAuthMode("none")} />
          </motion.div>
        )}

        {authMode === "connect" && (
          <motion.div
            key="connect-flow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <PasskeyConnectFlow onBack={() => setAuthMode("none")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
