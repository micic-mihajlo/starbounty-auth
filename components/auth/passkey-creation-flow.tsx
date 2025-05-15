"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useWallet } from "@/context/wallet-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeftIcon, FingerprintIcon, LoaderIcon, CheckCircleIcon, AlertCircleIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

type Step = "info" | "creating" | "success" | "error"

interface PasskeyCreationFlowProps {
  onBack: () => void
}

export default function PasskeyCreationFlow({ onBack }: PasskeyCreationFlowProps) {
  const { createPasskeyWallet } = useWallet()
  const { toast } = useToast()
  const [step, setStep] = useState<Step>("info")
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")

  const handleCreateWallet = async () => {
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username to continue",
        variant: "destructive",
      })
      return
    }

    try {
      setStep("creating")
      await createPasskeyWallet(username)
      setStep("success")
    } catch (err) {
      console.error("Passkey creation error:", err)
      setError(err instanceof Error ? err.message : "Failed to create passkey wallet")
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
            <CardTitle className="text-2xl">Create Wallet</CardTitle>
            <CardDescription className="text-zinc-400">Secure your account with a passkey</CardDescription>
          </div>
          <div className="w-8"></div>
        </div>
      </CardHeader>

      <CardContent>
        {step === "info" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-[#0a101f]/50 border-zinc-800"
              />
            </div>

            <div className="rounded-lg bg-[#0a101f]/50 p-4 border border-zinc-800">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <FingerprintIcon className="h-4 w-4 text-blue-400" />
                <span>What is a passkey?</span>
              </h4>
              <p className="text-sm text-zinc-400">
                Passkeys are a secure alternative to passwords. They use biometric authentication (like your fingerprint
                or face) to create a cryptographic key that's unique to your device.
              </p>
            </div>

            <Button className="w-full gradient-bg" onClick={handleCreateWallet}>
              Create Passkey Wallet
            </Button>
          </motion.div>
        )}

        {step === "creating" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 flex flex-col items-center justify-center space-y-4"
          >
            <LoaderIcon className="h-12 w-12 text-blue-400 animate-spin" />
            <p className="text-center text-zinc-300">Creating your secure wallet...</p>
            <p className="text-xs text-zinc-500 text-center max-w-xs">
              Follow the prompts from your browser or device to create your passkey
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
              <h3 className="text-xl font-medium text-white mb-1">Wallet Created!</h3>
              <p className="text-zinc-400">Your passkey wallet has been successfully created</p>
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
              <h3 className="text-xl font-medium text-white mb-1">Creation Failed</h3>
              <p className="text-zinc-400">{error}</p>
            </div>
            <Button variant="outline" onClick={() => setStep("info")} className="mt-2">
              Try Again
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
