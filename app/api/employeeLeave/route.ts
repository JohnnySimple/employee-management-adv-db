//api/employeeLeave/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET method to retrieve all leave requests
export async function GET() {
  try {
    const employeeLeaves = await prisma.employeeLeave.findMany({
      include: {
        employee: true, // Usually helpful to know who the leave belongs to
        leave: true,    // Shows the type of leave (Sick, Vacation, etc.)
        leaveDates: true // Shows the specific dates requested
      },
    });

    return NextResponse.json(employeeLeaves);
  } catch (error) {
    console.error("GET EmployeeLeave Error:", error);
    return NextResponse.json(
      { error: "Unable to Retrieve Leave Data" },
      { status: 500 }
    );
  }
}

// POST method to create a new leave request
export async function POST(req: Request) {
  try {
    const data = await req.json();

    // 1. Basic Validation & Parsing
    const employeeId = Number(data.employeeId);
    const leaveId = Number(data.leaveId);
    const totalLeaveHours = parseFloat(data.totalLeaveHours);
    const totalRemaining = parseFloat(data.totalRemaining);

    if (isNaN(employeeId) || isNaN(leaveId) || isNaN(totalLeaveHours)) {
      return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 });
    }

    // 2. Ensure Employee and Leave Type exist
    const [employeeExists, leaveTypeExists] = await Promise.all([
      prisma.employee.findUnique({ where: { employeeId } }),
      prisma.leave.findUnique({ where: { leaveId } })
    ]);

    if (!employeeExists) {
      return NextResponse.json({ error: "Employee does not exist" }, { status: 404 });
    }
    if (!leaveTypeExists) {
      return NextResponse.json({ error: "Leave type does not exist" }, { status: 404 });
    }

    // 3. Create the Record
    // Note: If you are passing an array of dates in 'data.dates', 
    // you can use 'createMany' or 'connect' logic for leaveDates here.
    const newLeaveRequest = await prisma.employeeLeave.create({
      data: {
        employeeId,
        leaveId,
        totalLeaveHours,
        totalRemaining,
        status: data.status || "Pending",
        // Optional: If you want to create dates at the same time
        // leaveDates: { create: data.dates.map((d: string) => ({ date: new Date(d) })) }
      },
      include: {
        leaveDates: true
      }
    });

    return NextResponse.json(newLeaveRequest, { status: 201 });
  } catch (error) {
    console.error("POST EmployeeLeave Error:", error);
    return NextResponse.json(
      { error: "Unable to Create Leave Request" },
      { status: 500 }
    );
  }
}
