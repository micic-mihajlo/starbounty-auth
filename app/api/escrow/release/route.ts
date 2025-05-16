import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { releaseEscrow } from '@/lib/escrow'

export async function POST (req: Request) {
  const { bountyId } = await req.json()

  if (!bountyId) {
    return NextResponse.json({ ok: false, error: 'Missing bountyId' }, { status: 400 })
  }

  const bounty = await prisma.bounty.findUnique({ where: { id: bountyId } })
  if (!bounty || !bounty.escrowContractId) {
    return NextResponse.json({ ok: false, error: 'Escrow not found for bounty' }, { status: 404 })
  }

  const txRes = await releaseEscrow(
    bounty.escrowContractId,
    process.env.ESCROW_FUNDER_SECRET || ''
  )

  if (!txRes.ok) {
    return NextResponse.json({ ok: false, error: txRes.error }, { status: 500 })
  }

  await prisma.bounty.update({
    where: { id: bountyId },
    data: { status: 'PAID' },
  })

  return NextResponse.json({ ok: true, txRes })
} 