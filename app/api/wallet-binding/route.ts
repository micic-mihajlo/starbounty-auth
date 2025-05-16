import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export const POST = async (req: NextRequest) => {
    try {
        const { address } = await req.json();
        const { userId } = getAuth(req);
        console.log(address);

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

        const user = await prisma.user.updateMany({
            where: {
                clerkId: userId,
            },
            data: {
                walletAddress: address,
            }
        })

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }
}
