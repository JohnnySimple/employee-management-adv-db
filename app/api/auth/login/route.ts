import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

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

        const token = await new SignJWT(
            {
                userId: user.id,
                role: user.role,
                employeeId: user.employeeId
            }
        )
        .setProtectedHeader({ alg: "HS256" })
        .setSubject(user.id.toString())
        .setIssuedAt()
        .setExpirationTime("1d")
        .sign(secret)

        const response = NextResponse.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                employee: user.employee
            }
        })

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24
        })

        return response
    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { error: `Internal server error: ${error}` },
            { status: 500 }
        )
    }
}