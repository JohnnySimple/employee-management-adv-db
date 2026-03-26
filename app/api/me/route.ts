import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // get employee details from the user object and return
    const employeeId = Number(user.employeeId);
    const employee = await prisma.employee.findUnique({
        where: { employeeId }
    });

    return NextResponse.json({
        userId: user.userId,
        employeeId: user.employeeId,
        role: user.role,
        employee: employee || null
    });
}