import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findFirst({
            where: {
                clerkId: userId
            }
        });

        if (!user) {
            return Response.json({ error: 'User not found' }, { status: 404 });
        }

        const pullRequests = await prisma.pullRequest.findMany({
            where: {
                developerId: user.id
            },
            include: {
                bounty: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Format the response to include both PRs and their bounties
        const formattedBounties = pullRequests.map(pr => ({
            pullRequest: {
                id: pr.id,
                status: pr.status,
                githubPrNumber: pr.githubPrNumber,
                repo: pr.repo,
                createdAt: pr.createdAt,
                updatedAt: pr.updatedAt,
                demoUrl: pr.demoUrl
            },
            bounty: pr.bounty
        }));

        return Response.json({ bounties: formattedBounties });
    } catch (error) {
        console.error('Error in getuserbounties:', error);
        return Response.json(
            { error: 'An error occurred while fetching user bounties' },
            { status: 500 }
        );
    }
}