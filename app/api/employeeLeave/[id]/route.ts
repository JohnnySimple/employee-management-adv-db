import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET a specific leave record
export async function GET(req: Request, context: { params: { id: string } }) {
    try {
        const { id } = await context.params;
        const employeeLeaveId = Number(id);

        if (isNaN(employeeLeaveId)) {
            return NextResponse.json({ error: "Invalid Leave ID" }, { status: 400 });
        }

        const leaveRecord = await prisma.employeeLeave.findUnique({
            where: { employeeLeaveId },
            include: {
                employee: true,
                leave: true,
                leaveDates: true
            },
        });

        if (!leaveRecord) {
            return NextResponse.json({ error: "Leave record not found" }, { status: 404 });
        }

        return NextResponse.json(leaveRecord);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Unable to Retrieve Leave Data" }, { status: 500 });
    }
}

// PATCH to update status (Approve/Reject) or hours
export async function PATCH(req: Request, context: { params: { id: string } }) {
    try {
        const { id } = await context.params;
        const employeeLeaveId = Number(id);

        if (isNaN(employeeLeaveId)) {
            return NextResponse.json({ error: "Invalid Leave ID" }, { status: 400 });
        }

        const data = await req.json();

        const updateData: any = {};
        
        if (data.status !== undefined) updateData.status = data.status;
        if (data.totalLeaveHours !== undefined) updateData.totalLeaveHours = Number(data.totalLeaveHours);
        if (data.totalRemaining !== undefined) updateData.totalRemaining = Number(data.totalRemaining);

        const updatedLeave = await prisma.employeeLeave.update({
            where: { employeeLeaveId },
            data: updateData,
            include: {
                leaveDates: true 
            }
        });

        return NextResponse.json(updatedLeave);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Unable to Update Leave Record" }, { status: 500 });
    }
}

// DELETE a leave request (e.g., employee cancels it)
export async function DELETE(req: Request, context: { params: { id: string } }) {
    try {
        const { id } = await context.params;
        const employeeLeaveId = Number(id);

        if (isNaN(employeeLeaveId)) {
            return NextResponse.json({ error: "Invalid Leave ID" }, { status: 400 });
        }


        await prisma.employeeLeave.delete({
            where: { employeeLeaveId }
        });

        return NextResponse.json({ message: "Leave record deleted successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Unable to Delete Leave Record" }, { status: 500 });
    }
}