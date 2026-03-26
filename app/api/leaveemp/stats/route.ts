import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {

        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const employeeId = user.employeeId as number;

        const leaveStats = await prisma.employeeLeave.findMany({
            where: { employeeId },
            include: {
                leave: true,
                leaveDates: true
            }
        })

        const stats = leaveStats.map(el => {
            const used = el.leaveDates.filter(ld => ld.status === "Approved").reduce((sum, ld) => sum + ld.hoursOff, 0);
            return {
                leaveType: el.leave.leaveType,
                usedHours: used,
                remaining: el.totalLeaveHours -  used
            }
        })

        return NextResponse.json({
            "stats": stats
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}