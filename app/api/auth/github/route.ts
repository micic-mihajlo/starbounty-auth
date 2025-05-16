import { Webhook } from 'svix'
import { headers } from 'next/headers'
import prisma from '@/lib/prisma';

// Helper to fetch GitHub stats for a username
async function getGithubStats(username: string) {
    const headers: Record<string, string> = {
        'Accept': 'application/vnd.github+json'
    }
    if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
        headers,
        // Cache GitHub response for 24h if Next.js ISR is enabled
        next: { revalidate: 60 * 60 * 24 }
    })

    if (!res.ok) {
        throw new Error(`GitHub API error: ${res.status} ${res.statusText}`)
    }

    const repos: Array<{ language: string | null }> = await res.json()

    const languageCount: Record<string, number> = {}
    for (const repo of repos) {
        const lang = repo.language
        if (lang) {
            languageCount[lang] = (languageCount[lang] || 0) + 1
        }
    }

    let mostUsedLanguage: string | null = null
    let max = 0
    for (const [lang, count] of Object.entries(languageCount)) {
        if (count > max) {
            max = count
            mostUsedLanguage = lang
        }
    }

    return { mostUsedLanguage, languageBreakdown: languageCount }
}

export async function POST(req: Request) {
    const SIGNING_SECRET = process.env.SIGNING_SECRET

    if (!SIGNING_SECRET) {
        throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local')
    }

    const wh = new Webhook(SIGNING_SECRET)

    const headerPayload = await headers()
    const svix_id = headerPayload.get('svix-id')
    const svix_timestamp = headerPayload.get('svix-timestamp')
    const svix_signature = headerPayload.get('svix-signature')

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error: Missing Svix headers', {
            status: 400,
        })
    }

    const payload = await req.json()
    const body = JSON.stringify(payload)

    if (!payload) {
        return new Response('Error: No payload received', {
            status: 400,
        })
    }

    console.log('Received webhook payload:', body);

    let evt

    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        })
    } catch (err) {
        console.error('Webhook verification failed:', err);
        return new Response(`Webhook verification failed: ${err.message}`, {
            status: 400,
        })
    }

    // Parse the webhook event
    const event = evt
    const { id } = event.data
    const eventType = event.type

    if (eventType === 'user.created') {
        try {

            // Extract GitHub account (if any) from Clerk event
            let githubStats: any = null

            const username = event.data.username
            console.log("Username:", username)
            if (username) {
                try {
                    githubStats = await getGithubStats(username)
                } catch (statsErr) {
                    console.error('Failed to fetch GitHub stats:', statsErr)
                }
            }

            // Persist user to DB if desired
            // const newUser = await prisma.user.create({ ... })

            console.log('Successfully created user with GitHub stats:', {
                user: event.data,
                githubStats,
            })

            const { id } = event.data

            const user = await prisma.user.create({
                data: {
                    clerkId: id,
                    username: event.data.username || '',
                    githubStats: githubStats || {},
                    imageUrl: event.data.profile_image_url || '',
                }
            });
            console.log("User created in DB:", user);

            return new Response(
                JSON.stringify({ success: true, githubStats }),
                {
                    status: 201,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type',
                    },
                },
            )
        } catch (error: Error | any) {
            console.error('Error creating user:', {
                error: error.message,
                stack: error.stack
            });
            return new Response(JSON.stringify({
                success: false,
                error: error.message,
                details: error.stack
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            });
        }
    }

    return new Response(JSON.stringify({ success: true, message: 'Webhook processed' }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    })
}