"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useWallet } from "@/context/wallet-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CopyIcon, ExternalLinkIcon, LogOutIcon, CheckCircleIcon, ShieldIcon, CoinsIcon, LoaderIcon } from "lucide-react"
import { truncateAddress } from "@/lib/utils"

export default function WalletDisplay() {
  const { address, balance, username, disconnectWallet, fundWalletTestnet, isFunding } = useWallet()
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    if (address) {
      const addressString = typeof address === 'string' ? address : String(address);
      navigator.clipboard.writeText(addressString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
      <Card className="gradient-border glass border-0 shadow-xl overflow-hidden bg-white">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-yellow-400 opacity-80"></div>

        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-1">
            <ShieldIcon className="h-5 w-5 text-orange-500" />
            <span className="text-xs font-medium text-green-600 bg-green-100 py-0.5 px-2 rounded-full">CONNECTED</span>
          </div>
          <CardTitle className="text-2xl font-bold text-zinc-900">Your Wallet</CardTitle>
          <CardDescription className="text-zinc-500">Connected as <span className="text-zinc-900 font-medium">{username}</span></CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-lg glass p-4 bg-zinc-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-500 font-medium">Address</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-zinc-500 hover:text-orange-500 transition-colors"
                  onClick={copyAddress}
                  title="Copy address"
                >
                  {copied ? <CheckCircleIcon className="h-3.5 w-3.5 text-green-500" /> : <CopyIcon className="h-3.5 w-3.5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-zinc-500 hover:text-orange-500 transition-colors"
                  onClick={() => window.open(`https://stellar.expert/explorer/testnet/account/${address}`, "_blank")}
                  title="View on explorer"
                >
                  <ExternalLinkIcon className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <p className="font-mono text-sm break-all text-zinc-900">{address ? truncateAddress(address) : "Loading..."}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg glass p-4 bg-zinc-50/50">
              <span className="text-sm text-zinc-500 font-medium block mb-1">Balance</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-zinc-900">{balance || "0"}</span>
                <span className="text-sm text-zinc-500">XLM</span>
              </div>
            </div>

            <div className="rounded-lg glass p-4 bg-zinc-50/50">
              <span className="text-sm text-zinc-500 font-medium block mb-1">Network</span>
              <div className="flex items-center gap-2">
                <div className="flex h-2 w-2">
                  <span className="animate-ping absolute h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative rounded-full h-2 w-2 bg-green-500"></span>
                </div>
                <span className="text-zinc-900 font-medium">Testnet</span>
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full gradient-bg text-white flex items-center gap-2"
            onClick={fundWalletTestnet}
            disabled={isFunding}
          >
            {isFunding ? (
              <>
                <LoaderIcon className="h-4 w-4 animate-spin" />
                <span>Funding Wallet...</span>
              </>
            ) : (
              <>
                <CoinsIcon className="h-4 w-4" />
                <span>Fund Wallet with Test XLM</span>
              </>
            )}
          </Button>
          <p className="text-xs text-center text-zinc-500">
            This button requests free XLM from the Stellar Testnet Friendbot
          </p>
        </CardContent>

        <Separator className="bg-zinc-200" />

        <CardFooter className="py-4">
          <Button
            variant="ghost"
            className="w-full text-red-500 hover:text-red-600 hover:bg-red-100 transition-colors"
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
