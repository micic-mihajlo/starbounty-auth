"use client"

import { useState, useEffect } from "react"
import { SorobanPasskeyKit } from "soroban-passkey"
import { Networks, Transaction } from "stellar-sdk"

export function usePasskeyKit() {
  const [passkeyKit, setPasskeyKit] = useState<SorobanPasskeyKit | null>(null)

  useEffect(() => {
    // Initialize the Soroban Passkey Kit
    const initPasskeyKit = async () => {
      try {
        // This is the actual implementation that would work with the real libraries
        const kit = new SorobanPasskeyKit({
          network: Networks.TESTNET,
          rpcUrl: "https://soroban-testnet.stellar.org",
          appName: "StarBounty",
          appIcon: "/logo.png",
        })

        await kit.initialize()
        setPasskeyKit(kit)
      } catch (error) {
        console.error("Failed to initialize PasskeyKit:", error)
      }
    }

    initPasskeyKit()
  }, [])

  const createWallet = async (username: string): Promise<string> => {
    if (!passkeyKit) {
      throw new Error("PasskeyKit not initialized")
    }

    try {
      // Create a new passkey wallet
      const walletAddress = await passkeyKit.register({
        username,
        displayName: username,
      })

      return walletAddress
    } catch (error) {
      console.error("Error creating wallet:", error)
      throw new Error("Failed to create passkey wallet")
    }
  }

  const connectWallet = async (): Promise<{ username: string; address: string }> => {
    if (!passkeyKit) {
      throw new Error("PasskeyKit not initialized")
    }

    try {
      // Authenticate with existing passkey
      const { username, address } = await passkeyKit.authenticate()

      return { username, address }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      throw new Error("Failed to connect passkey wallet")
    }
  }

  const getWalletAddress = async (username: string): Promise<string | null> => {
    if (!passkeyKit) {
      return null
    }

    try {
      const address = await passkeyKit.getAddressByUsername(username)
      return address
    } catch (error) {
      console.error("Error getting wallet address:", error)
      return null
    }
  }

  const signTransaction = async (username: string, xdr: string): Promise<string> => {
    if (!passkeyKit) {
      throw new Error("PasskeyKit not initialized")
    }

    try {
      // Parse the XDR into a Transaction object
      const transaction = Transaction.fromXDR(xdr, Networks.TESTNET)

      // Sign the transaction with the passkey
      const signedTransaction = await passkeyKit.signTransaction({
        username,
        transaction,
      })

      // Convert the signed transaction back to XDR
      return signedTransaction.toXDR()
    } catch (error) {
      console.error("Error signing transaction:", error)
      throw new Error("Failed to sign transaction with passkey")
    }
  }

  return {
    createWallet,
    connectWallet,
    getWalletAddress,
    signTransaction,
  }
}
