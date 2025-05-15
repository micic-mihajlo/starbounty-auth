"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"
import { usePasskeyKit } from "@/hooks/use-passkey-kit"
import { Horizon } from "@stellar/stellar-sdk"

interface WalletContextType {
  isConnected: boolean
  isLoading: boolean
  address: string | null
  balance: string | null
  username: string | null
  createPasskeyWallet: (username: string) => Promise<void>
  connectPasskeyWallet: () => Promise<void>
  disconnectWallet: () => void
  signAndSend: (xdr: string) => Promise<string>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

// Initialize Stellar server for testnet
const server = new Horizon.Server("https://horizon-testnet.stellar.org")

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const { toast } = useToast()
  const passkeyKit = usePasskeyKit()

  // Check for existing wallet on load
  useEffect(() => {
    const checkExistingWallet = async () => {
      try {
        const savedWallet = localStorage.getItem("starbounty_wallet")
        if (savedWallet) {
          const walletData = JSON.parse(savedWallet)
          setUsername(walletData.username)

          // Attempt to reconnect the wallet
          const walletAddress = await passkeyKit.getWalletAddress(walletData.username)
          if (walletAddress) {
            setAddress(walletAddress)
            await fetchBalance(walletAddress)
            setIsConnected(true)
          }
        }
      } catch (error) {
        console.error("Error checking existing wallet:", error)
        // Clear potentially corrupted wallet data
        localStorage.removeItem("starbounty_wallet")
      } finally {
        setIsLoading(false)
      }
    }

    checkExistingWallet()
  }, [])

  const fetchBalance = async (walletAddress: string) => {
    try {
      // Fetch account details from Stellar network
      const account = await server.loadAccount(walletAddress)

      // Find XLM balance
      const xlmBalance = account.balances.find((balance) => balance.asset_type === "native")

      if (xlmBalance && "balance" in xlmBalance) {
        setBalance(xlmBalance.balance)
      } else {
        setBalance("0")
      }
    } catch (error) {
      console.error("Error fetching balance:", error)
      // If account not found, it might not be activated yet
      setBalance("0")
      toast({
        title: "Account not activated",
        description: "Your account may need to be funded with XLM to activate it on the Stellar network",
        variant: "destructive",
      })
    }
  }

  const createPasskeyWallet = async (username: string) => {
    try {
      // Create a new passkey wallet
      const walletAddress = await passkeyKit.createWallet(username)

      // Save wallet info to local storage
      localStorage.setItem(
        "starbounty_wallet",
        JSON.stringify({
          username,
          lastConnected: new Date().toISOString(),
        }),
      )

      // Update state
      setUsername(username)
      setAddress(walletAddress)
      await fetchBalance(walletAddress)
      setIsConnected(true)

      toast({
        title: "Wallet created successfully",
        description: `Your wallet is ready to use`,
      })
    } catch (error) {
      console.error("Error creating wallet:", error)
      throw error
    }
  }

  const connectPasskeyWallet = async () => {
    try {
      // Connect to existing passkey wallet
      const { username: connectedUsername, address: walletAddress } = await passkeyKit.connectWallet()

      // Save wallet info to local storage
      localStorage.setItem(
        "starbounty_wallet",
        JSON.stringify({
          username: connectedUsername,
          lastConnected: new Date().toISOString(),
        }),
      )

      // Update state
      setUsername(connectedUsername)
      setAddress(walletAddress)
      await fetchBalance(walletAddress)
      setIsConnected(true)

      toast({
        title: "Wallet connected",
        description: `Successfully connected to your wallet`,
      })
    } catch (error) {
      console.error("Error connecting wallet:", error)
      throw error
    }
  }

  const disconnectWallet = () => {
    // Clear local storage
    localStorage.removeItem("starbounty_wallet")

    // Reset state
    setIsConnected(false)
    setAddress(null)
    setBalance(null)
    setUsername(null)

    toast({
      title: "Wallet disconnected",
      description: "You've been logged out successfully",
    })
  }

  const signAndSend = async (xdr: string): Promise<string> => {
    try {
      if (!isConnected || !username) {
        throw new Error("Wallet not connected")
      }

      // Get transaction nonce from backend
      const nonceResponse = await fetch("/wallet/nonce", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!nonceResponse.ok) {
        throw new Error("Failed to get transaction nonce")
      }

      const { sorobanTx, xdr: txXdr } = await nonceResponse.json()

      // Sign the transaction with passkey
      const signedXdr = await passkeyKit.signTransaction(username, txXdr)

      // Send the signed transaction with Launchtube fee-bump
      const sendResponse = await fetch("/wallet/sendTx", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ signedXdr }),
      })

      if (!sendResponse.ok) {
        throw new Error("Failed to send transaction")
      }

      const { txHash } = await sendResponse.json()

      // Update balance after successful transaction
      if (address) {
        await fetchBalance(address)
      }

      return txHash
    } catch (error) {
      console.error("Error signing and sending transaction:", error)
      toast({
        title: "Transaction failed",
        description: error instanceof Error ? error.message : "Failed to process transaction",
        variant: "destructive",
      })
      throw error
    }
  }

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        isLoading,
        address,
        balance,
        username,
        createPasskeyWallet,
        connectPasskeyWallet,
        disconnectWallet,
        signAndSend,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
