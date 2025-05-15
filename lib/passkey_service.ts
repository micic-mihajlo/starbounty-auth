// Removed: "use client";

import { PasskeyKit, PasskeyServer } from "passkey-kit";
import { Networks } from "@stellar/stellar-sdk/minimal";

// Config for PasskeyKit (Client-side)
const clientRpcUrl = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL;
const clientWalletWasmHash = process.env.NEXT_PUBLIC_WALLET_WASM_HASH;
const clientNetworkPassphrase = process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE || Networks.TESTNET;
const clientTimeoutInSeconds = 30;

// Config for PasskeyServer (Server-side)
const serverRpcUrl = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL;
const serverLaunchtubeUrl = process.env.NEXT_PUBLIC_LAUNCHTUBE_URL;
const serverLaunchtubeJwt = process.env.LAUNCHTUBE_JWT_SERVER || "";

let passkeyKitInstance: PasskeyKit | null = null;
let passkeyServerInstance: PasskeyServer | null = null;

if (typeof window !== 'undefined') {
  // CLIENT-SIDE INITIALIZATION for PasskeyKit
  if (!clientRpcUrl) {
    console.error("PasskeyKit Init Error: NEXT_PUBLIC_SOROBAN_RPC_URL is not set (client-side).");
  }
  if (!clientWalletWasmHash) {
    console.error("PasskeyKit Init Error: NEXT_PUBLIC_WALLET_WASM_HASH is not set (client-side).");
  }
  if (!clientNetworkPassphrase) {
    console.error("PasskeyKit Init Error: NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE is not set (client-side).");
  }

  if (clientRpcUrl && clientWalletWasmHash && clientNetworkPassphrase) {
    try {
      // Note: There might be a warning about missing algorithm identifiers (ES256/RS256) 
      // in pubKeyCredParams, but this doesn't affect most browsers and authenticators
      passkeyKitInstance = new PasskeyKit({
        rpcUrl: clientRpcUrl,
        networkPassphrase: clientNetworkPassphrase,
        walletWasmHash: clientWalletWasmHash,
        timeoutInSeconds: clientTimeoutInSeconds,
      });
      console.log("Passkey Service: PasskeyKit initialized (client-side).");
    } catch (e) {
      console.error("Passkey Service: Error initializing PasskeyKit (client-side):", e);
    }
  }
} else {
  // SERVER-SIDE INITIALIZATION for PasskeyServer
  console.log("[Passkey Service] Initializing PasskeyServer (server-side)...Env Var Values:");
  console.log("[Passkey Service] serverLaunchtubeUrl:", serverLaunchtubeUrl);
  console.log("[Passkey Service] LAUNCHTUBE_JWT_SERVER env var status:", process.env.LAUNCHTUBE_JWT_SERVER ? "Exists" : "MISSING or empty");
  console.log("[Passkey Service] serverRpcUrl:", serverRpcUrl);

  if (!serverLaunchtubeUrl) {
    console.error("PasskeyServer Init Error: NEXT_PUBLIC_LAUNCHTUBE_URL not set (server-side).");
  }
  if (!process.env.LAUNCHTUBE_JWT_SERVER) {
     console.warn("PasskeyServer Init Warning: LAUNCHTUBE_JWT_SERVER environment variable is missing or empty. Launchtube calls may fail if authentication is required.");
  }
  
  if (serverLaunchtubeUrl) {
    try {
      passkeyServerInstance = new PasskeyServer({
        rpcUrl: serverRpcUrl, 
        launchtubeUrl: serverLaunchtubeUrl,
        launchtubeJwt: serverLaunchtubeJwt,
        // OMITTING launchtubeHeaders entirely to let passkey-kit defaults and fetch() auto-generation work
      });
      console.log("Passkey Service: PasskeyServer initialized (server-side, no explicit launchtubeHeaders).");
    } catch (e) {
      console.error("Passkey Service: Error initializing PasskeyServer (server-side):", e);
    }
  }
}

export { passkeyKitInstance, passkeyServerInstance }; 
