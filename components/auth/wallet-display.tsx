"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useWallet } from "@/context/wallet-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CopyIcon, ExternalLinkIcon, LogOutIcon, CheckCircleIcon } from "lucide-react"
import { truncateAddress } from "@/lib/utils"

export default function WalletDisplay() {
  const { address, balance, username, disconnectWallet } = useWallet()
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
      <Card className="gradient-border bg-[#111827]/80 backdrop-blur-sm border-0 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-violet-500"></div>

        <CardHeader>
          <CardTitle className="text-2xl">Your Wallet</CardTitle>
          <CardDescription className="text-zinc-400">Connected as {username}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-lg bg-[#0a101f]/70 p-4 border border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-400">Address</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-zinc-400 hover:text-white"
                  onClick={copyAddress}
                >
                  {copied ? <CheckCircleIcon className="h-3.5 w-3.5" /> : <CopyIcon className="h-3.5 w-3.5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-zinc-400 hover:text-white"
                  onClick={() => window.open(`https://stellar.expert/explorer/testnet/account/${address}`, "_blank")}
                >
                  <ExternalLinkIcon className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <p className="font-mono text-sm break-all">{address ? truncateAddress(address) : "Loading..."}</p>
          </div>

          <div className="flex items-stretch gap-4">
            <div className="flex-1 rounded-lg bg-[#0a101f]/70 p-4 border border-zinc-800">
              <span className="text-sm text-zinc-400 block mb-1">Balance</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-medium">{balance || "0"}</span>
                <span className="text-sm text-zinc-400">XLM</span>
              </div>
            </div>

            <div className="flex-1 rounded-lg bg-[#0a101f]/70 p-4 border border-zinc-800">
              <span className="text-sm text-zinc-400 block mb-1">Network</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Testnet</span>
              </div>
            </div>
          </div>
        </CardContent>

        <Separator className="bg-zinc-800" />

        <CardFooter className="py-4">
          <Button
            variant="ghost"
            className="w-full text-red-400 hover:text-red-300 hover:bg-red-950/20"
            onClick={disconnectWallet}
          >
            <LogOutIcon className="h-4 w-4 mr-2" />
            Disconnect Wallet
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
