import { NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/lib/prisma'

const githubSecret = process.env.GITHUB_WEBHOOK_SECRET || ''

function verifySignature (signature: string | null, payload: string) {
  if (!signature || !githubSecret) return false
  const hmac = crypto.createHmac('sha256', githubSecret)
  hmac.update(payload)
  const digest = `sha256=${hmac.digest('hex')}`
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))
}

export async function POST (req: Request) {
  // GitHub sends the signature in this header
  const signature = req.headers.get('X-Hub-Signature-256')
  const event = req.headers.get('X-GitHub-Event') || 'unknown'
  const deliveryId = req.headers.get('X-GitHub-Delivery')

  const rawBody = await req.text()

  // Optional: reject if signature invalid
  if (githubSecret && !verifySignature(signature, rawBody)) {
    console.warn('[GitHub Webhook] Invalid signature', { deliveryId })
    return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 401 })
  }

  let payload: any = {}
  try {
    payload = JSON.parse(rawBody)
  } catch (err) {
    console.error('[GitHub Webhook] JSON parse error', err)
    return NextResponse.json({ ok: false, error: 'Bad payload' }, { status: 400 })
  }

  // Handle pull_request events of interest
  if (event === 'pull_request') {
    const action = payload.action as string
    const pr = payload.pull_request

    if (action === 'opened') {
      await handlePrOpened(pr, payload)
    }

    if (action === 'closed' && pr.merged) {
      await handlePrMerged(pr, payload)
    }
  }

  // We respond quickly; heavy work should be moved to queue/edge function later
  return NextResponse.json({ ok: true })
}

async function handlePrOpened (pr: any, payload: any) {
  try {
    const issueUrl: string | undefined = pr.body?.match(/https?:\/\/github.com\/[\w-./]+\/issues\/\d+/)?.[0]

    // Lookup bounty by issueUrl (if provided)
    if (!issueUrl) {
      console.log('[GitHub Webhook] PR opened but no issue URL found in body')
      return
    }

    const bounty = await prisma.bounty.findUnique({ where: { issueUrl } })
    if (!bounty) {
      console.log('[GitHub Webhook] No bounty matches issueUrl', issueUrl)
      return
    }

    // Upsert PR record
    await prisma.pullRequest.upsert({
      where: { githubPrNumber_repo: { githubPrNumber: pr.number, repo: payload.repository.full_name } },
      update: {},
      create: {
        githubPrNumber: pr.number,
        repo: payload.repository.full_name,
        bountyId: bounty.id,
        developer: {
          connectOrCreate: {
            where: { clerkId: pr.user.id.toString() }, // placeholder mapping
            create: {
              clerkId: pr.user.id.toString(),
              githubStats: {},
            },
          },
        },
        status: 'SUBMITTED',
      },
    })

    // Update bounty status
    await prisma.bounty.update({
      where: { id: bounty.id },
      data: { status: 'PR_SUBMITTED' },
    })
  } catch (err) {
    console.error('[GitHub Webhook] handlePrOpened error', err)
  }
}

async function handlePrMerged (pr: any, payload: any) {
  try {
    const githubPrNumber = pr.number
    const repo = payload.repository.full_name

    const updatedPr = await prisma.pullRequest.update({
      where: { githubPrNumber_repo: { githubPrNumber, repo } },
      data: { status: 'MERGED' },
      select: { bountyId: true },
    })

    await prisma.bounty.update({
      where: { id: updatedPr.bountyId },
      data: { status: 'MERGED' },
    })
  } catch (err) {
    console.error('[GitHub Webhook] handlePrMerged error', err)
  }
} 