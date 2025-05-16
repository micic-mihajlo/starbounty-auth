import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET (req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const bounty = await prisma.bounty.findUnique({
      where: { id },
      include: {
        pullRequests: true,
        creator: {
          select: { id: true, username: true, clerkId: true }
        },
      },
    })

    if (!bounty) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ bounty })
  } catch (err) {
    console.error('[Get Bounty]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 