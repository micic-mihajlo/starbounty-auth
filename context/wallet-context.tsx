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
  fundWalletTestnet: () => Promise<void>
  isFunding: boolean
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

// Initialize Stellar server for testnet
const server = new Horizon.Server("https://horizon-testnet.stellar.org")

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isFunding, setIsFunding] = useState(false)
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
      // Ensure walletAddress is a valid string format for Stellar
      const formattedAddress = typeof walletAddress === 'string' ? walletAddress : String(walletAddress);
      
      // Check if the address is a Soroban contract address (starts with C)
      const isSorobanContract = formattedAddress.startsWith('C');
      
      if (isSorobanContract) {
        // For Soroban contract wallets, we can't query balance directly from Horizon
        // Set a default balance until funded/activated
        setBalance("0");
        toast({
          title: "New Soroban Wallet",
          description: "Your wallet has been created but needs to be funded with XLM to be activated",
          variant: "default",
        });
        return;
      }
      
      // Only proceed with Horizon query for regular Stellar accounts
      const account = await server.loadAccount(formattedAddress);

      // Find XLM balance
      const xlmBalance = account.balances.find((balance) => balance.asset_type === "native");

      if (xlmBalance && "balance" in xlmBalance) {
        setBalance(xlmBalance.balance);
      } else {
        setBalance("0");
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      // If account not found, it might not be activated yet
      setBalance("0");
      toast({
        title: "Account not activated",
        description: "Your account may need to be funded with XLM to activate it on the Stellar network",
        variant: "destructive",
      });
    }
  };

  const createPasskeyWallet = async (username: string) => {
    try {
      // Create a new passkey wallet
      const result = await passkeyKit.createWallet(username)
      const walletAddress = result.walletAddress

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
      const result = await passkeyKit.connectWallet()
      const walletAddress = result.address
      const connectedUsername = result.keyId // Using keyId as username

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
      const signedXdr = await passkeyKit.signAndSubmitTransaction(username, txXdr)

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

  const fundWalletTestnet = async () => {
    if (!address) {
      toast({
        title: "No wallet connected",
        description: "Please create or connect a wallet first",
        variant: "destructive",
      });
      return;
    }

    setIsFunding(true);
    try {
      // Check if this is a Soroban contract address (starts with C)
      const isSorobanContract = address.startsWith('C');
      
      if (isSorobanContract) {
        // For Soroban contracts, we need to use the Soroban RPC API 
        // to directly interact with the contract
        toast({
          title: "Soroban Contract Detected",
          description: "Currently testing this functionality for Soroban contracts. Please check back later.",
          variant: "default",
        });
        
        // Alternative approach: create a server endpoint that funds Soroban contracts
        try {
          // This is a placeholder - your implementation may vary
          const response = await fetch('/api/fund-soroban', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ contractId: address }),
          });
          
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to fund Soroban contract');
          }
          
          // Wait a moment for the funding to propagate
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Refresh the balance (though this may not show accurate results for Soroban contracts)
          toast({
            title: "Funding in Progress",
            description: "Please check your wallet in a few moments",
            variant: "default",
          });
        } catch (err) {
          console.error("Error funding Soroban contract:", err);
          toast({
            title: "Funding Failed",
            description: "Could not fund Soroban contract at this time",
            variant: "destructive",
          });
        }
      } else {
        // For regular Stellar accounts, use Friendbot
        const response = await fetch(
          `https://friendbot.stellar.org?addr=${encodeURIComponent(address)}`
        );
        
        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || "Failed to fund account");
        }
        
        // Wait a moment for the funding to propagate
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Refresh the balance
        await fetchBalance(address);
        
        toast({
          title: "Funding successful",
          description: "Your account has been funded with test XLM",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error funding wallet:", error);
      toast({
        title: "Funding failed",
        description: error instanceof Error ? error.message : "Failed to fund your wallet",
        variant: "destructive",
      });
    } finally {
      setIsFunding(false);
    }
  };

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
        fundWalletTestnet,
        isFunding,
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
