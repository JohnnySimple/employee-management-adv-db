import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { jwtVerify } from "jose";


// Verify JWT and extract user info
async function verifyToken(req: Request) {
    const authHeader = req.headers.get("Authorization");
    if(!authHeader?.startsWith("Bearer ")) {
        throw new Error("Unauthorized");
    }

    const token = authHeader?.split(" ")[1];
    if(!token) {
        throw new Error("Unauthorized");
    }

    if(!process.env.JWT_SECRET) {
        throw new Error("JWT secret not configured in env");
    }

    const secret=new TextEncoder().encode(process.env.JWT_SECRET);

    const {payload} = await jwtVerify(token, secret);
    if(!payload.employeeId)  throw new Error("Unauthorized");
    return payload.employeeId as number;
}

// Retrives the list of attendance records for the authenticated employee
export async function GET(req: Request){
    try{
        const employeeId = await verifyToken(req);

        // Get attendance records for the employee
        const attendanceRecords=await prisma.attendance.findMany({
            where : { employeeId },
            orderBy: { workDate: "desc" }
        });

        return NextResponse.json(attendanceRecords);
    } catch(error){
        return NextResponse.json(
            { error: { message: "Unable to fetch attendance records" } },
            { status: 401 }
        );
    }
}

// Clock in for auhorized employee