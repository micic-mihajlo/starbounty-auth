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
            <Card className="gradient-border border-0 shadow-xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-yellow-400 opacity-80"></div>
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-gradient font-geist">Get Started</CardTitle>
                <CardDescription className="text-zinc-600 font-geist">
                  Create or connect your secure passkey wallet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-between group text-zinc-700 hover:text-orange-600 hover:border-orange-500/80 transition-all duration-300 h-16 font-geist"
                  onClick={() => setAuthMode("create")}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-orange-500/10">
                      <KeyIcon className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="text-left">
                      <span className="block font-medium">Create New Wallet</span>
                      <span className="text-xs text-zinc-500 group-hover:text-orange-500/70">Get started with a new account</span>
                    </div>
                  </div>
                  <ArrowRightIcon className="h-5 w-5 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" />
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-between group text-zinc-700 hover:text-yellow-600 hover:border-yellow-500/80 transition-all duration-300 h-16 font-geist"
                  onClick={() => setAuthMode("connect")}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/10">
                      <WalletIcon className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="text-left">
                      <span className="block font-medium">Connect Existing Wallet</span>
                      <span className="text-xs text-zinc-500 group-hover:text-yellow-500/70">Sign in with your passkey</span>
                    </div>
                  </div>
                  <ArrowRightIcon className="h-5 w-5 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" />
                </Button>
              </CardContent>
              <CardFooter className="flex justify-center border-t border-zinc-200 pt-4">
                <p className="text-xs text-zinc-600 flex items-center gap-1 font-geist">
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
