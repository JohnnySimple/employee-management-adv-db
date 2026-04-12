import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request, context: { params: { employeeId: string } }) {
    try {
        const { employeeId } = await context.params;
        const id = Number(employeeId);

        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid Employee ID" }, { status: 400 });
        }

        // Use findFirst since we only expect one record per employee
        const leaveRecord = await prisma.employeeLeave.findFirst({
            where: { employeeId: id },
            include: {
                leave: true,
                leaveDates: true
            }
        });

        if (!leaveRecord) {
            return NextResponse.json(
                { error: "No leave record found for this employee" },
                { status: 404 }
            );
        }

        return NextResponse.json(leaveRecord);
    } catch (error) {
        console.error("Error fetching employee leave:", error);
        return NextResponse.json(
            { error: "Internal Server Error" }, 
            { status: 500 }
        );
    }
}

export async function PATCH(req: Request, context: { params: { employeeId: string } }) {
    try {
        const { employeeId } = await context.params;
        const id = Number(employeeId);
        const data = await req.json();

        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid Employee ID" }, { status: 400 });
        }

        // 1. Fetch the current record first to check existing balance
        const currentRecord = await prisma.employeeLeave.findFirst({
            where: { employeeId: id }
        });

        if (!currentRecord) {
            return NextResponse.json({ error: "Leave record not found" }, { status: 404 });
        }

        // 2. Logic: If we are subtracting hours (e.g., approving a request)
        if (data.hoursToSubtract !== undefined) {
            const deduction = parseFloat(data.hoursToSubtract);
            const newRemaining = currentRecord.totalRemaining - deduction;

            // PREVENT NEGATIVE BALANCE
            if (newRemaining < 0) {
                return NextResponse.json(
                    { 
                        error: "Insufficient leave balance", 
                        currentBalance: currentRecord.totalRemaining,
                        requested: deduction 
                    }, 
                    { status: 400 }
                );
            }

            // Update the record with the calculated balance
            const updated = await prisma.employeeLeave.update({
                where: { employeeLeaveId: currentRecord.employeeLeaveId },
                data: { totalRemaining: newRemaining }
            });

            return NextResponse.json(updated);
        }

        const updated = await prisma.employeeLeave.update({
            where: { employeeLeaveId: currentRecord.employeeLeaveId },
            data: {
                totalRemaining: data.totalRemaining !== undefined ? Number(data.totalRemaining) : undefined,
                status: data.status || undefined
            }
        });

        return NextResponse.json(updated);

    } catch (error) {
        console.error("PATCH EmployeeLeave Error:", error);
        return NextResponse.json({ error: "Unable to update leave balance" }, { status: 500 });
    }
}