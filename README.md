
# BOSS  
  
## Turn Coding Tasks into Secure Bounties  
  
BOSS is a platform that allows developers to create and manage bounties for coding tasks, secured by passkeys and Soroban smart contracts on the Stellar blockchain.  
  
![BOSS Banner]  
  
## Overview  
  
BOSS powers decentralized projects with on-chain bounties, secured by passkeys and Soroban smart contracts. Focus on building, not on payout complexities. [1](#0-0)   
  
## Features  
  
- **Secure Authentication**: Create and sign in with passkeys, eliminating password vulnerabilities [2](#0-1)   
  
- **Bounty Creation**: Create bounties from GitHub issues with custom requirements and rewards [3](#0-2)   
  
- **Stellar Integration**: Wallets backed by Stellar blockchain technology for secure transactions [4](#0-3)   
  
- **Soroban Smart Contracts**: Smart contracts ensure fair and automated bounty payouts [5](#0-4)   
  
## Technology Stack  
  
- **Frontend**: Next.js with React and TypeScript [6](#0-5)   
  
- **Authentication**: Passkey-based authentication using WebAuthn standard [7](#0-6)   
  
- **Blockchain**: Stellar network (Testnet) with Soroban smart contracts [4](#0-3)   
  
- **UI Components**: Custom UI built with shadcn/ui, Radix UI, and Tailwind CSS [8](#0-7)   
  
## Getting Started  
  
### Prerequisites  
  
- Node.js (v18+)  
- npm or yarn  
- Git  
  
### Installation  
  
1. Clone the repository:  
```bash  
git clone https://github.com/micic-mihajlo/BOSS-auth.git  
cd BOSS-auth  
```  
  
2. Install dependencies:  
```bash  
npm install  
# or  
yarn install  
```  
  
3. Set up environment variables (create a `.env.local` file in the root directory):  
```  
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org  
NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015  
NEXT_PUBLIC_WALLET_WASM_HASH=<your-wallet-wasm-hash>  
NEXT_PUBLIC_LAUNCHTUBE_URL=<your-launchtube-url>  
LAUNCHTUBE_JWT_SERVER=<your-launchtube-jwt>  
```
[9](#0-8)   
  
4. Run the development server:  
```bash  
npm run dev  
# or  
yarn dev  
```
[10](#0-9)   
  
## Usage  
  
### Creating a Wallet  
  
1. Navigate to the authentication page  
2. Select "Create New Wallet"  
3. Enter a username  
4. Follow the browser prompts to create a passkey [7](#0-6)   
  
### Connecting to an Existing Wallet  
  
1. Navigate to the authentication page  
2. Select "Connect Existing Wallet"  
3. Follow the browser prompts to authenticate with your passkey [11](#0-10)   
  
### Creating a Bounty  
  
1. Navigate to the Bounties page  
2. Select "Attach Bounty"  
3. Fill in the bounty details including title, description, requirements, and reward amount  
4. Submit the form to create your bounty [3](#0-2)   
  
### Browsing Bounties  
  
1. Navigate to the Bounties page  
2. Use the search functionality to find bounties by title, description, or keywords  
3. Click on a bounty to view details [12](#0-11)   
  
## Security Features  
  
### Passkey Authentication  
  
BOSS uses passkeys, a modern authentication standard that:  
  
- Eliminates password vulnerabilities  
- Uses biometric authentication (like fingerprint or face recognition)  
- Creates cryptographic keys unique to your device [13](#0-12)   
  
### Blockchain Security  
  
- All bounty transactions are secured on the Stellar blockchain  
- Smart contracts ensure transparent and trustless transactions  
- Decentralized architecture prevents single points of failure [4](#0-3)   
  
## Architecture  
  
BOSS uses a modern web architecture:  
  
- **Client-Side Rendering**: Fast, responsive UI with Next.js  
- **API Routes**: Secure backend operations through Next.js API routes  
- **Blockchain Integration**: Direct integration with Stellar's Soroban smart contracts  
- **Passkey Authentication**: WebAuthn standard for passwordless authentication  
  
## Contributing  
  
Contributions are welcome! Please feel free to submit a Pull Request.  
  
1. Fork the repository  
2. Create your feature branch (`git checkout -b feature/amazing-feature`)  
3. Commit your changes (`git commit -m 'Add some amazing feature'`)  
4. Push to the branch (`git push origin feature/amazing-feature`)  
5. Open a Pull Request  
  
## License  
  
This project is licensed under the MIT License - see the LICENSE file for details.  
  
## Acknowledgements  
  
- [Stellar Development Foundation](https://stellar.org)  
- [WebAuthn](https://webauthn.guide/)  
- [Passkey-Kit](https://github.com/Passkey-Kit/passkey-kit)  
  
---  
  
   
