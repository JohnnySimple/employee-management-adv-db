import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
    const token = req.headers.get("authorization")?.split(" ")[1]
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    if (!token) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }

    try {
        await jwtVerify(token, secret)
        return NextResponse.next()
    } catch (error) {
        return NextResponse.json(
            { error: `Invalid token: ${error}` },
            { status: 401 }
        )
    }
}

export const config = {
    matcher: ["/api/protected/:path*"]
}