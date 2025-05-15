"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useWallet } from "@/context/wallet-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeftIcon, LoaderIcon, CheckCircleIcon, AlertCircleIcon, KeyIcon } from "lucide-react"
import { useRouter } from 'next/navigation'

type Step = "init" | "connecting" | "success" | "error"

interface PasskeyConnectFlowProps {
  onBack: () => void
}

export default function PasskeyConnectFlow({ onBack }: PasskeyConnectFlowProps) {
  const { connectPasskeyWallet, isConnected } = useWallet()
  const [step, setStep] = useState<Step>("init")
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (step === "success" && isConnected) {
      const timer = setTimeout(() => {
        router.push('/bounties')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [step, isConnected, router])

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
    <Card className="gradient-border border-0 shadow-xl overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 text-zinc-500 hover:text-zinc-700">
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <div className="flex-1 text-center">
            <CardTitle className="text-2xl text-zinc-900">Connect Wallet</CardTitle>
            <CardDescription className="text-zinc-600">Use your existing passkey</CardDescription>
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
            <div className="rounded-full bg-orange-500/10 p-4">
              <KeyIcon className="h-10 w-10 text-orange-600" />
            </div>

            <div className="text-center space-y-2">
              <p className="text-zinc-700">Connect with your existing passkey to access your wallet</p>
              <p className="text-xs text-zinc-500">
                Your browser will prompt you to select and authenticate with your passkey
              </p>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white"
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
            <LoaderIcon className="h-12 w-12 text-orange-600 animate-spin" />
            <p className="text-center text-zinc-700">Connecting to your wallet...</p>
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
            <div className="rounded-full bg-green-500/10 p-3">
              <CheckCircleIcon className="h-12 w-12 text-green-600" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-medium text-zinc-900 mb-1">Connected!</h3>
              <p className="text-zinc-600">Your wallet has been successfully connected</p>
            </div>
          </motion.div>
        )}

        {step === "error" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 flex flex-col items-center justify-center space-y-4"
          >
            <div className="rounded-full bg-red-500/10 p-3">
              <AlertCircleIcon className="h-12 w-12 text-red-600" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-medium text-zinc-900 mb-1">Connection Failed</h3>
              <p className="text-zinc-600">{error}</p>
            </div>
            <Button variant="outline" onClick={() => setStep("init")} className="mt-2 border-zinc-300 hover:bg-zinc-100 text-zinc-700">
              Try Again
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
