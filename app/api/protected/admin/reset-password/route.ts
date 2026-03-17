import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        const { userId, newPassword } = await req.json();

        if (!userId || !newPassword) {
            return NextResponse.json(
                { error: "Missing fields" },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: Number(userId) },
            data: {
                passwordHash: hashedPassword
            }
        });
        
        return NextResponse.json({
            message: "Password reset successful"
        })

    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}