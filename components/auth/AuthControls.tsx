"use client";

import { useState } from 'react';
import { usePasskeyKit } from "@/hooks/use-passkey-kit"; // Adjust path
import { useAuth } from "@/context/AuthContext"; // Adjust path

export default function AuthControls() {
  const { createWallet, connectWallet } = usePasskeyKit();
  const { keyId, contractId, setKeyId, setContractId, isAuthenticated, logout } = useAuth();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    if (!username) {
      setError("Please enter a username to sign up.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { walletAddress, keyId: newKeyId } = await createWallet(username);
      setKeyId(newKeyId);
      setContractId(walletAddress);
      setUsername(""); // Clear username input
      console.log("Signed up! Wallet:", walletAddress, "KeyID:", newKeyId);
    } catch (err) {
      console.error("Sign up error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during sign up.");
    }
    setIsLoading(false);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { address, keyId: newKeyId } = await connectWallet();
      setKeyId(newKeyId);
      setContractId(address);
      console.log("Logged in! Wallet:", address, "KeyID:", newKeyId);
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during login.");
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    logout(); // This now comes from AuthContext
    console.log("Logged out.");
  };

  if (isAuthenticated) {
    return (
      <div>
        <p>Welcome! Wallet: {contractId ? `${contractId.slice(0,6)}...${contractId.slice(-4)}` : "N/A"}</p>
        <p>Key ID: {keyId ? `${keyId.slice(0,10)}...` : "N/A"}</p>
        <button onClick={handleLogout} disabled={isLoading} className="px-3 py-1 border rounded bg-red-500 text-white">
          Logout
        </button>
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2 p-4 border rounded">
      <h2 className="text-lg font-semibold">Auth Controls</h2>
      <div>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Enter username for sign-up" 
          className="border p-1 rounded w-full mb-1"
        />
        <button onClick={handleSignUp} disabled={isLoading || !username} className="px-3 py-1 border rounded bg-blue-500 text-white disabled:opacity-50 w-full">
          {isLoading ? "Signing Up..." : "Sign Up with Passkey"}
        </button>
      </div>
      <div>
        <button onClick={handleLogin} disabled={isLoading} className="px-3 py-1 border rounded bg-green-500 text-white disabled:opacity-50 w-full">
          {isLoading ? "Logging In..." : "Login with Passkey"}
        </button>
      </div>
      {error && <p style={{ color: 'red' }} className="mt-2">Error: {error}</p>}
    </div>
  );
} 