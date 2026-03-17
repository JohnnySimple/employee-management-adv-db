import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function middleware(req: NextRequest) {
    const headerToken = req.headers.get("authorization")?.split(" ")[1]
    const cookieToken = req.cookies.get("token")?.value

    const token = headerToken || cookieToken

    if (!token) {
        // return NextResponse.json(
        //     { error: "Unauthorized" },
        //     { status: 401 }
        // )
        return NextResponse.redirect(
            new URL("/login", req.url)
        )
    }

    try {
        const { payload } = await jwtVerify(token, secret)
        const role = payload.role as string
        const path = req.nextUrl.pathname

        // protect admin routes
        if (path.startsWith("/admin") && role !== "ADMIN") {
            return NextResponse.redirect(new URL("/employee", req.url))
        }

        // protect employee routes
        if (path.startsWith("/employee") && role !== "EMPLOYEE") {
            return NextResponse.redirect(new URL("/manager", req.url))
        }

        // protect manager routes
        if (path.startsWith("/manager") && role !== "MANAGER") {
            return NextResponse.redirect(new URL("/admin", req.url))
        }

        // API routes
        if (path.startsWith("/api/protected/admin") && role !== "ADMIN") {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            )
        }

        return NextResponse.next()
    } catch (error) {
        return NextResponse.json(
            { error: `Invalid token: ${error}` },
            { status: 401 }
        )
    }
}

export const config = {
    matcher: [
        "/api/protected/:path*",
        "/admin/:path*"
    ],
}