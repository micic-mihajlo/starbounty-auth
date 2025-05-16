import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuth } from '@clerk/nextjs/server'

export async function POST (req: NextRequest) {
  try {
    const {
      title,
      repository,
      issueNumber,
      description,
      githubLink,
      keywords,
      requirements,
      reward,
      issueUrl // alias, fallback to githubLink
    } = await req.json()

    if (!title || !repository || !issueNumber || !description || !githubLink || !reward) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { userId } = getAuth(req)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ensure user exists in DB
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: {
        clerkId: userId,
        githubStats: {},
      },
    })

    // Create bounty
    const bounty = await prisma.bounty.create({
      data: {
        title,
        repository,
        issueNumber: Number(issueNumber),
        description,
        githubLink,
        issueUrl: issueUrl || githubLink,
        reward,
        keywords: Array.isArray(keywords) ? keywords : typeof keywords === 'string' ? keywords.split(',').map((k: string) => k.trim()) : [],
        requirements: Array.isArray(requirements) ? requirements : typeof requirements === 'string' ? requirements.split(/\n/).map((r: string) => r.trim()) : [],
        creatorId: user.id,
      },
    })

    return NextResponse.json({ bounty })
  } catch (err: any) {
    console.error('[Create Bounty] error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 