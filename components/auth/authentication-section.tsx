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
            <Card className="gradient-border bg-[#111827]/80 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="text-2xl">Get Started</CardTitle>
                <CardDescription className="text-zinc-400">
                  Create or connect your secure passkey wallet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-between group hover:border-blue-500 hover:text-blue-400 transition-all"
                  onClick={() => setAuthMode("create")}
                >
                  <div className="flex items-center gap-2">
                    <KeyIcon className="h-5 w-5" />
                    <span>Create New Wallet</span>
                  </div>
                  <ArrowRightIcon className="h-5 w-5 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-between group hover:border-violet-500 hover:text-violet-400 transition-all"
                  onClick={() => setAuthMode("connect")}
                >
                  <div className="flex items-center gap-2">
                    <WalletIcon className="h-5 w-5" />
                    <span>Connect Existing Wallet</span>
                  </div>
                  <ArrowRightIcon className="h-5 w-5 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                </Button>
              </CardContent>
              <CardFooter className="flex justify-center border-t border-zinc-800 pt-4">
                <p className="text-xs text-zinc-500 flex items-center gap-1">
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
