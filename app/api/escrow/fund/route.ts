import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { fundEscrow } from '@/lib/escrow'

export async function POST (req: Request) {
  try {
    const { bountyId, amount, beneficiaryWallet } = await req.json()

    if (!bountyId || !amount || !beneficiaryWallet) {
      return NextResponse.json({ ok: false, error: 'Missing params' }, { status: 400 })
    }

    const bounty = await prisma.bounty.findUnique({ where: { id: bountyId } })
    if (!bounty) {
      return NextResponse.json({ ok: false, error: 'Bounty not found' }, { status: 404 })
    }

    if (bounty.escrowContractId) {
      return NextResponse.json({ ok: false, error: 'Escrow already created' }, { status: 400 })
    }

    const txRes = await fundEscrow(
      amount,
      beneficiaryWallet,
      process.env.ESCROW_FUNDER_SECRET || ''
    )

    if (!txRes.ok) {
      return NextResponse.json({ ok: false, error: txRes.error }, { status: 500 })
    }

    await prisma.bounty.update({
      where: { id: bountyId },
      data: {
        escrowContractId: txRes.contractId || undefined,
        beneficiaryWallet
      }
    })

    return NextResponse.json({ ok: true, txRes })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
} 