import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { clerkClient, requireAuth } from '@clerk/express'

export const POST = async (req: NextRequest) => {
    try {
        const { address } = await req.json();
        const { userId } = getAuth(req);

        const addressInDB = await prisma.user.findFirst({
            where: {
                walletAddress: address,
            }
        })

        if (addressInDB) {
            return NextResponse.json({ error: "Address already exists" }, { status: 400 });
        }

        if (!userId) {
            return NextResponse.json({ error: "User not found" }, { status: 400 });
        }

        // Update the user in your database
        const dbUser = await prisma.user.updateMany({
            where: {
                clerkId: userId,
            },
            data: {
                walletAddress: address,
            }
        });

        // For now, we'll only update the database
        // Clerk metadata update requires additional setup with Admin API
        // This will be addressed in a follow-up task

        const clerkUser = await clerkClient.users.updateUserMetadata(userId, {
            privateMetadata: {
                walletAddress: address,
            },
        });

        console.log("User updated in Clerk:", clerkUser);

        return NextResponse.json({ user: dbUser });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }
}
