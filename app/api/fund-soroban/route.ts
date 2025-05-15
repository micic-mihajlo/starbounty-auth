import { NextResponse } from 'next/server';
import { 
  Horizon,
  Networks, 
  TransactionBuilder, 
  Operation, 
  BASE_FEE, 
  Keypair,
  Asset
} from '@stellar/stellar-sdk';

// Initialize Stellar SDK
const server = new Horizon.Server("https://horizon-testnet.stellar.org");
const networkPassphrase = Networks.TESTNET;

// This is our funding account - in production you would use an actual account you control
// For testing/demo purposes only!
const FUNDING_SECRET = process.env.STELLAR_FUNDING_SECRET;

export async function POST(request: Request) {
  console.log('[fund-soroban API] STELLAR_FUNDING_SECRET:', FUNDING_SECRET);
  console.log('[fund-soroban API] Type of STELLAR_FUNDING_SECRET:', typeof FUNDING_SECRET);

  try {
    // Parse the incoming request
    const data = await request.json();
    const { contractId } = data;
    
    if (!contractId) {
      return NextResponse.json(
        { error: 'Contract ID is required' },
        { status: 400 }
      );
    }
    
    // Validate the contract ID format (should start with 'C')
    if (!contractId.startsWith('C')) {
      return NextResponse.json(
        { error: 'Invalid Soroban contract ID format' },
        { status: 400 }
      );
    }
    
    // Check if we have a funding secret
    if (!FUNDING_SECRET) {
      console.error('STELLAR_FUNDING_SECRET environment variable is not set');
      return NextResponse.json(
        { error: 'Funding account not configured' },
        { status: 500 }
      );
    }

    try {
      // Load the funding account
      const fundingKeypair = Keypair.fromSecret(FUNDING_SECRET);
      const fundingAccount = await server.loadAccount(fundingKeypair.publicKey());
      
      // For contracts, we need to use createAccount instead of payment
      // This simplifies dealing with contract IDs vs account IDs
      const transaction = new TransactionBuilder(fundingAccount, {
        fee: BASE_FEE,
        networkPassphrase
      })
        .addOperation(
          Operation.createAccount({
            destination: contractId, // Use contract ID directly
            startingBalance: '10' // Send 10 XLM to initialize the account
          })
        )
        .setTimeout(30)
        .build();
      
      // Sign the transaction with the funding account
      transaction.sign(fundingKeypair);
      
      // Submit the transaction
      const result = await server.submitTransaction(transaction);
      
      return NextResponse.json({
        success: true,
        message: "Funding successful",
        txHash: result.hash
      });
    } catch (err: any) {
      // If transaction failed, return the error
      console.error('Transaction submission error:', err);
      
      // Check for specific error types
      if (err.response && err.response.data && err.response.data.extras) {
        const stellarError = err.response.data.extras.result_codes;
        
        // If the error is because the account already exists, we consider it a success
        if (stellarError && 
            stellarError.operations && 
            stellarError.operations.includes('op_already_exists')) {
          return NextResponse.json({
            success: true,
            message: "Account already funded"
          });
        }
      }
      
      // If we reach here, return a simplified error response to client
      return NextResponse.json({
        success: false, // Make sure this is set to false so client can handle error properly
        error: 'Transaction failed',
        details: err.message || 'Unknown error',
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error('Error in fund-soroban endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
} 