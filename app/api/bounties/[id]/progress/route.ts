import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type PullRequest = {
    number: number;
    html_url: string;
    state: string;
    title: string;
    user: {
        login: string;
        avatar_url: string;
    };
    created_at: string;
    updated_at: string;
};

type Issue = {
    state: string;
    title: string;
    body: string;
    number: number;
    pull_requests: Array<{ url: string; }>;
    assignee: {
        login: string;
        avatar_url: string;
    } | null;
    assignees: Array<{
        login: string;
        avatar_url: string;
    }>;
};

export const POST = async (req: NextRequest) => {
    try {
        const { id } = await req.json();
        if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

        const bounty = await prisma.bounty.findFirst({
            where: { id }
        });

        if (!bounty) return NextResponse.json({ error: 'Bounty not found' }, { status: 404 });

        // Get issue details
        const issueResponse = await fetch(
            `https://api.github.com/repos/${bounty.repository}/issues/${bounty.issueNumber}`,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github+json'
                }
            }
        );

        if (!issueResponse.ok) {
            return NextResponse.json({ error: 'Failed to fetch issue details' }, { status: issueResponse.status });
        }

        const issueData: Issue = await issueResponse.json();

        // Get all PRs that reference this issue
        const searchResponse = await fetch(
            `https://api.github.com/search/issues?q=type:pr+repo:${bounty.repository}+${bounty.issueNumber}`,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github+json'
                }
            }
        );

        if (!searchResponse.ok) {
            return NextResponse.json({ error: 'Failed to fetch PR details' }, { status: searchResponse.status });
        }

        const searchData = await searchResponse.json();
        const linkedPRs: PullRequest[] = [];

        // Get detailed information for each PR
        for (const item of searchData.items || []) {
            const prResponse = await fetch(
                item.pull_request.url,
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                        'Accept': 'application/vnd.github+json'
                    }
                }
            );

            if (prResponse.ok) {
                const prData: PullRequest = await prResponse.json();
                linkedPRs.push(prData);
            }
        }

        // Process each PR and update database accordingly
        for (const pr of linkedPRs) {
            // Check if PR already exists in database
            const existingPR = await prisma.pullRequest.findFirst({
                where: {
                    githubPrNumber: pr.number,
                    repo: bounty.repository
                }
            });

            if (!existingPR) {
                // Find or create user by GitHub username
                let developer = await prisma.user.findFirst({
                    where: {
                        username: pr.user.login
                    }
                });

                if (!developer) {
                    // If user doesn't exist, create a placeholder user
                    developer = await prisma.user.create({
                        data: {
                            username: pr.user.login,
                            githubStats: {},
                            clerkId: `github_${pr.user.login}`, // Temporary clerkId
                            imageUrl: pr.user.avatar_url
                        }
                    });
                }

                // Create new PR record
                await prisma.pullRequest.create({
                    data: {
                        githubPrNumber: pr.number,
                        repo: bounty.repository,
                        bountyId: bounty.id,
                        developerId: developer.id,
                        status: pr.state === 'closed' ? 'MERGED' : 'SUBMITTED'
                    }
                });
            }
        }

        // Update bounty status based on issue and PR status
        let status = bounty.status;
        if (issueData.state === 'closed') {
            status = 'CLOSED';
        } else if (linkedPRs.length > 0) {
            const mergedPR = linkedPRs.find(pr => pr.state === 'closed');
            if (mergedPR) {
                status = 'MERGED';
            } else if (status !== 'IN_PROGRESS') {
                // Only update to IN_PROGRESS if it's not already
                status = 'IN_PROGRESS';
            }
        }

        // Update bounty status if changed
        if (status !== bounty.status) {
            await prisma.bounty.update({
                where: { id },
                data: { status }
            });
        }

        return NextResponse.json({
            issue: {
                state: issueData.state,
                title: issueData.title,
                number: issueData.number,
                assignee: issueData.assignee ? {
                    username: issueData.assignee.login,
                    avatar: issueData.assignee.avatar_url
                } : null,
                assignees: issueData.assignees.map(assignee => ({
                    username: assignee.login,
                    avatar: assignee.avatar_url
                })),
            },
            pullRequests: linkedPRs.map(pr => ({
                number: pr.number,
                url: pr.html_url,
                state: pr.state,
                title: pr.title,
                author: {
                    username: pr.user.login,
                    avatar: pr.user.avatar_url
                },
                createdAt: pr.created_at,
                updatedAt: pr.updated_at
            })),
            status
        });
    } catch (error) {
        console.error('[Bounty Progress] error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}