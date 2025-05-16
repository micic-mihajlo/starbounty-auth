import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const bounties = await prisma.bounty.findMany({
            include: {
                creator: true,
                pullRequests: true
            }
        })
        return NextResponse.json({ bounties })
    } catch (error) {
        console.error('Error processing request:', error)
        return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }
}