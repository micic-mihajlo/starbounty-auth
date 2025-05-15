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
    <Card className="gradient-border border-0 shadow-xl overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-yellow-400 opacity-80"></div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 text-zinc-500 hover:text-zinc-700">
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <div className="flex-1 text-center">
            <CardTitle className="text-2xl font-bold text-zinc-900">Create Wallet</CardTitle>
            <CardDescription className="text-zinc-600">Secure your account with a passkey</CardDescription>
          </div>
          <div className="w-8"></div>
        </div>
      </CardHeader>

      <CardContent>
        {step === "info" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-zinc-700">Username</Label>
              <Input
                id="username"
                placeholder="Enter a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-zinc-50 border-zinc-300 focus:border-blue-500 focus:ring-blue-500/20 text-zinc-900"
              />
            </div>

            <div className="rounded-lg p-4 border border-zinc-200 bg-zinc-50">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500/10">
                  <FingerprintIcon className="h-3.5 w-3.5 text-orange-600" />
                </div>
                <span className="text-zinc-900">What is a passkey?</span>
              </h4>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Passkeys are a secure alternative to passwords. They use biometric authentication (like your fingerprint
                or face) to create a cryptographic key that's unique to your device.
              </p>
            </div>

            <Button className="w-full gradient-bg text-white font-medium h-12" onClick={handleCreateWallet}>
              Create Passkey Wallet
            </Button>
          </motion.div>
        )}

        {step === "creating" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 flex flex-col items-center justify-center space-y-4"
          >
            <div className="relative">
              <LoaderIcon className="h-12 w-12 text-orange-600 animate-spin" />
              <div className="absolute -inset-2 bg-orange-500/10 rounded-full blur-md -z-10"></div>
            </div>
            <p className="text-center text-zinc-700 font-medium">Creating your secure wallet...</p>
            <p className="text-xs text-zinc-500 text-center max-w-xs">
              Follow the prompts from your browser or device to create your passkey
            </p>
          </motion.div>
        )}

        {step === "success" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 flex flex-col items-center justify-center space-y-4"
          >
            <div className="relative">
              <div className="rounded-full bg-green-500/10 p-4">
                <CheckCircleIcon className="h-12 w-12 text-green-600" />
              </div>
              <div className="absolute -inset-2 bg-green-500/5 rounded-full blur-md -z-10"></div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-zinc-900 mb-1">Wallet Created!</h3>
              <p className="text-zinc-600">Your passkey wallet has been successfully created</p>
            </div>
          </motion.div>
        )}

        {step === "error" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 flex flex-col items-center justify-center space-y-4"
          >
            <div className="relative">
              <div className="rounded-full bg-red-500/10 p-4">
                <AlertCircleIcon className="h-12 w-12 text-red-600" />
              </div>
              <div className="absolute -inset-2 bg-red-500/5 rounded-full blur-md -z-10"></div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-zinc-900 mb-1">Creation Failed</h3>
              <p className="text-zinc-600">{error}</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setStep("info")} 
              className="mt-2 border-zinc-300 hover:bg-zinc-100 hover:border-red-500/30 text-zinc-700"
            >
              Try Again
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
