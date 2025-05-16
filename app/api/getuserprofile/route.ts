import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return NextResponse.json({ error: "User not found" }, { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: {
                clerkId: userId,
            }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 400 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }
}