import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password required" },
                { status: 400 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { email },
            include: { employee: true }
        })

        if (!user) {
            return NextResponse.json(
                { error: "Invalid crendentials" },
                { status: 401 }
            )
        }

        if (!user.isActive) {
            return NextResponse.json(
                { error: "Account disabled" },
                { status: 403 }
            )
        }

        const passwordValid = await bcrypt.compare(password, user.passwordHash)

        if (!passwordValid) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            )
        }

        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role,
                employeeId: user.employeeId
            },
            process.env.JWT_SECRET!,
            { expiresIn: "1d" }
        )

        return NextResponse.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                employee: user.employee
            }
        })
    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { error: `Internal server error: ${error}` },
            { status: 500 }
        )
    }
}