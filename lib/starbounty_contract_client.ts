import { Client as YourContractClient } from "./sdk/your_contract_name_sdk"; // Adjust path to your generated SDK

const rpcUrl = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL;
const networkPassphrase = process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE;
const yourStarBountyContractId = process.env.NEXT_PUBLIC_YOUR_CONTRACT_ID; // You'll define this

let starBountyContractClient: YourContractClient | null = null;

if (rpcUrl && networkPassphrase && yourStarBountyContractId) {
  try {
    starBountyContractClient = new YourContractClient({
      rpcUrl,
      contractId: yourStarBountyContractId,
      networkPassphrase,
      // publicKey: undefined, // or the source account if calls need to be sponsored or from a specific account by default
      // allowance: undefined,
    });
    console.log("StarBounty Contract Client initialized successfully.");
  } catch (e) {
    console.error("Failed to initialize StarBounty Contract Client:", e);
  }
} else {
  console.error("StarBounty Contract Client cannot be initialized due to missing environment variables.");
}

export { starBountyContractClient }; 