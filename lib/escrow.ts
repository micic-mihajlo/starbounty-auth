import { passkeyServerInstance } from './passkey_service'
import type { Transaction } from '@stellar/stellar-sdk'

interface TxResult {
  ok: boolean
  txHash?: string
  error?: string
  contractId?: string
}

/**
 * Deposit bounty reward into a newly deployed escrow contract.
 * Returns the escrow contractId so it can be persisted on the Bounty row.
 */
export async function fundEscrow (
  amount: string,
  beneficiaryWallet: string,
  fundingSecret: string
): Promise<TxResult> {
  if (!passkeyServerInstance) return { ok: false, error: 'PasskeyServer not initialised' }

  try {
    // NOTE: Replace with real Soroban contract invocation once PasskeyServer exposes helpers.
    // For now we forward the request directly to the LaunchTube /api/launch endpoint.

    const res = await passkeyServerInstance.launch({
      amount,
      beneficiaryWallet,
      fundingSecret
    })

    return { ok: true, ...res }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Release funds from escrow vault to the bounty beneficiary.
 */
export async function releaseEscrow (
  escrowContractId: string,
  callerSecret: string
): Promise<TxResult> {
  if (!passkeyServerInstance) return { ok: false, error: 'PasskeyServer not initialised' }

  try {
    const res = await passkeyServerInstance.invoke({
      contractId: escrowContractId,
      function: 'release',
      args: [],
      callerSecret
    })

    return { ok: true, ...res }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
} 