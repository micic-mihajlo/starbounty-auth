"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useWallet } from "@/context/wallet-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeftIcon, LoaderIcon, CheckCircleIcon, AlertCircleIcon, KeyIcon } from "lucide-react"

type Step = "init" | "connecting" | "success" | "error"

interface PasskeyConnectFlowProps {
  onBack: () => void
}

export default function PasskeyConnectFlow({ onBack }: PasskeyConnectFlowProps) {
  const { connectPasskeyWallet } = useWallet()
  const [step, setStep] = useState<Step>("init")
  const [error, setError] = useState("")

  const handleConnectWallet = async () => {
    try {
      setStep("connecting")
      await connectPasskeyWallet()
      setStep("success")
    } catch (err) {
      console.error("Passkey connection error:", err)
      setError(err instanceof Error ? err.message : "Failed to connect passkey wallet")
      setStep("error")
    }
  }

  return (
    <Card className="gradient-border bg-[#111827]/80 backdrop-blur-sm border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <div className="flex-1 text-center">
            <CardTitle className="text-2xl">Connect Wallet</CardTitle>
            <CardDescription className="text-zinc-400">Use your existing passkey</CardDescription>
          </div>
          <div className="w-8"></div>
        </div>
      </CardHeader>

      <CardContent>
        {step === "init" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-6 flex flex-col items-center space-y-6"
          >
            <div className="rounded-full bg-violet-900/20 p-4">
              <KeyIcon className="h-10 w-10 text-violet-400" />
            </div>

            <div className="text-center space-y-2">
              <p className="text-zinc-300">Connect with your existing passkey to access your wallet</p>
              <p className="text-xs text-zinc-500">
                Your browser will prompt you to select and authenticate with your passkey
              </p>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
              onClick={handleConnectWallet}
            >
              Connect with Passkey
            </Button>
          </motion.div>
        )}

        {step === "connecting" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 flex flex-col items-center justify-center space-y-4"
          >
            <LoaderIcon className="h-12 w-12 text-violet-400 animate-spin" />
            <p className="text-center text-zinc-300">Connecting to your wallet...</p>
            <p className="text-xs text-zinc-500 text-center max-w-xs">
              Follow the prompts from your browser or device to authenticate with your passkey
            </p>
          </motion.div>
        )}

        {step === "success" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 flex flex-col items-center justify-center space-y-4"
          >
            <div className="rounded-full bg-green-900/20 p-3">
              <CheckCircleIcon className="h-12 w-12 text-green-500" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-medium text-white mb-1">Connected!</h3>
              <p className="text-zinc-400">Your wallet has been successfully connected</p>
            </div>
          </motion.div>
        )}

        {step === "error" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 flex flex-col items-center justify-center space-y-4"
          >
            <div className="rounded-full bg-red-900/20 p-3">
              <AlertCircleIcon className="h-12 w-12 text-red-500" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-medium text-white mb-1">Connection Failed</h3>
              <p className="text-zinc-400">{error}</p>
            </div>
            <Button variant="outline" onClick={() => setStep("init")} className="mt-2">
              Try Again
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
