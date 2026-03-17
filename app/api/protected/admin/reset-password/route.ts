import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        const { employeeId, newPassword } = await req.json();

        if (!employeeId || !newPassword) {
            return NextResponse.json(
                { error: "Missing fields" },
                { status: 400 }
            )
        }

        const user = await prisma.user.findUnique({
            where: {
                employeeId: Number(employeeId)
            }
        })

        if (!user) {
            return NextResponse.json(
                { error: "User account not found" },
                { status: 404 }
            )
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
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