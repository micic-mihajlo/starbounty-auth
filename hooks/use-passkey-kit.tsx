"use client"

// Removed: import { useState, useEffect } from "react"
// PasskeyKit and PasskeyServer imports are not needed here if only using instances
// import { PasskeyKit, PasskeyServer } from "passkey-kit"
// Stellar SDK imports might still be needed for type definitions if you handle XDR directly
// import { Networks, TransactionBuilder, type xdr } from "@stellar/stellar-sdk/minimal"
import { passkeyKitInstance } from "@/lib/passkey_service"

// Helper type guard to check for toXDR method
// function hasToXDRApi(obj: any): obj is { toXDR: () => string } {
//   return obj !== null && typeof obj === 'object' && typeof obj.toXDR === 'function';
// }

export function usePasskeyKit() {
  // Removed: const [passkeyKit, setPasskeyKit] = useState<PasskeyKit | null>(null)
  // Removed: const [passkeyServer, setPasskeyServer] = useState<PasskeyServer | null>(null)

  // Removed: useEffect hook that initialized local passkeyKit and passkeyServer

  const createWallet = async (username: string, appName: string = "StarBounty"): Promise<{ walletAddress: string, keyId: string, accountAddress: string }> => {
    if (!passkeyKitInstance) {
      throw new Error("PasskeyKit is not initialized. Check console for errors regarding environment variables or initialization process.");
    }
    // No longer need passkeyServerInstance check here for createWallet's send path

    let walletResponseFromCreate: Awaited<ReturnType<typeof passkeyKitInstance.createWallet>> | null = null;

    try {
      console.log("[usePasskeyKit] Attempting to call passkeyKitInstance.createWallet...");
      walletResponseFromCreate = await passkeyKitInstance.createWallet(appName, username);
      const { contractId, keyIdBase64, signedTx } = walletResponseFromCreate;
      console.log("[usePasskeyKit] passkeyKitInstance.createWallet SUCCEEDED. signedTx object:", JSON.stringify(signedTx, null, 2));

      if (!signedTx) {
        console.error("[usePasskeyKit] signedTx is null or undefined after createWallet.");
        throw new Error("PasskeyKit.createWallet returned without a signed transaction object.");
      }

      console.log("[usePasskeyKit] Attempting to send transaction via /api/send...");
      const apiResponse = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xdr: signedTx.toXDR() })
      });

      const submissionResult = await apiResponse.json();

      if (!apiResponse.ok) {
        console.error("[usePasskeyKit] /api/send call failed:", submissionResult);
        throw new Error(submissionResult.error || `Failed to send transaction via API: ${apiResponse.statusText}`);
      }
      
      console.log("[usePasskeyKit] /api/send SUCCEEDED. Wallet address (contractId):", contractId, "Key ID:", keyIdBase64);
      
      if (!contractId || !keyIdBase64) {
        // This check might be redundant if createWallet already guarantees these, but safe to keep
        throw new Error("PasskeyKit.createWallet did not return expected values for contractId or keyIdBase64.");
      }

      // Extract the host account (Ed25519 public key) from the signed transaction
      let accountAddress: string
      if ('source' in signedTx && typeof signedTx.source === 'string') {
        accountAddress = signedTx.source
      } else {
        // Fallback: decode raw XDR to get the source account public key
        const raw = signedTx._tx._attributes.sourceAccount._value.data
        const buffer = Buffer.from(raw)
        const { StrKey } = await import('@stellar/stellar-sdk')
        accountAddress = StrKey.encodeEd25519PublicKey(buffer)
      }
      
      return { walletAddress: contractId, keyId: keyIdBase64, accountAddress }
    } catch (error: any) {
      console.error("[usePasskeyKit] Error during createWallet process.");
      if (walletResponseFromCreate?.signedTx) {
        console.error("[usePasskeyKit] signedTx object at time of error was:", JSON.stringify(walletResponseFromCreate.signedTx, null, 2));
      }
      if (error && typeof error === 'object' && 'status' in error && 'error' in error && error.status !== 200 /* if it's from our API */) {
        console.error("[usePasskeyKit] Detailed error object from failed operation:", error);
      } else {
        console.error("[usePasskeyKit] Raw error object:", error);
      }
      throw new Error(`Failed to create passkey wallet: ${error.message ? error.message : JSON.stringify(error)}`);
    }
  };

  const connectWallet = async (rpId?: string): Promise<{ address: string; keyId: string }> => {
    if (!passkeyKitInstance) {
      throw new Error("PasskeyKit is not initialized.");
    }
    try {
      const { contractId, keyIdBase64 } = await passkeyKitInstance.connectWallet({ rpId });
      if (!contractId || !keyIdBase64) {
        throw new Error("Failed to connect wallet: PasskeyKit.connectWallet did not return expected values.");
      }
      return { address: contractId, keyId: keyIdBase64 };
    } catch (error: any) {
      console.error("Error in connectWallet (raw):", error);
      console.error("Error message:", error?.message);
      console.error("Error name:", error?.name);
      console.error("Error stack:", error?.stack);
      if (error?.cause) {
        console.error("Error cause:", error.cause);
      }
      throw new Error(`Failed to connect passkey wallet: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
    }
  };

  const getWalletAddress = async (keyId: string, rpId?: string): Promise<string | null> => {
    if (!passkeyKitInstance) {
      console.warn("getWalletAddress called when PasskeyKit is not initialized.");
      return null;
    }
    try {
      const { contractId } = await passkeyKitInstance.connectWallet({
        keyId,
        rpId,
        getContractId: async (kId: string) => {
          console.log("getContractId callback invoked for keyId:", kId);
          return undefined; 
        }
      });
      return contractId || null;
    } catch (error) {
      console.error("Error in getWalletAddress:", error);
      return null;
    }
  };

  const signAndSubmitTransaction = async (userKeyId: string, transactionXDR: string, rpId?: string): Promise<any> => {
    if (!passkeyKitInstance) {
      throw new Error("PasskeyKit is not initialized.");
    }
    // No longer need passkeyServerInstance check here

    let signedArtefactForLogging: any = null;
    try {
      console.log("[usePasskeyKit] Attempting to call passkeyKitInstance.sign for signAndSubmitTransaction with XDR:", transactionXDR);
      const signedTransactionArtefact = await passkeyKitInstance.sign(transactionXDR, { keyId: userKeyId, rpId });
      signedArtefactForLogging = signedTransactionArtefact;
      console.log("[usePasskeyKit] passkeyKitInstance.sign SUCCEEDED. signedTransactionArtefact:", JSON.stringify(signedTransactionArtefact, null, 2));
      
      console.log("[usePasskeyKit] Attempting to send signed transaction artefact via /api/send...");
      // The 'send' method of PasskeyServer expects a Transaction object or its XDR string.
      // passkeyKitInstance.sign() returns a StellarSdk.Transaction object.
      const xdrToSend = typeof signedTransactionArtefact === 'string' ? signedTransactionArtefact : signedTransactionArtefact.toXDR();

      const apiResponse = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xdr: xdrToSend })
      });

      const submissionResult = await apiResponse.json();

      if (!apiResponse.ok) {
        console.error("[usePasskeyKit] /api/send call failed (signAndSubmitTransaction):", submissionResult);
        throw new Error(submissionResult.error || `Failed to send transaction via API: ${apiResponse.statusText}`);
      }

      console.log("[usePasskeyKit] /api/send SUCCEEDED for signAndSubmitTransaction.");
      return submissionResult;
    } catch (error: any) {
      console.error("[usePasskeyKit] Error during signAndSubmitTransaction.");
      console.error("[usePasskeyKit] Original XDR for .sign() was:", transactionXDR);
      console.error("[usePasskeyKit] signedArtefact from .sign() at time of error was:", JSON.stringify(signedArtefactForLogging, null, 2));
      if (error && typeof error === 'object' && 'status' in error && 'error' in error && error.status !== 200) {
        console.error("[usePasskeyKit] Detailed error object from failed operation (signAndSubmitTransaction):", error);
      } else {
        console.error("[usePasskeyKit] Raw error object (signAndSubmitTransaction):", error);
      }
      throw new Error(`Failed to sign and submit transaction: ${error.message ? error.message : JSON.stringify(error)}`);
    }
  };

  return {
    createWallet,
    connectWallet,
    getWalletAddress,
    signAndSubmitTransaction,
  };
}
