//app/api/project/employee/[id]/route.ts
import { NextResponse } from "next/server";
import {prisma} from "@/lib/db"

const validStatuses = ["ACTIVE", "INACTIVE"] as const;
type ValidStatus = (typeof validStatuses)[number];

export async function GET( req: Request, context: { params: { id: string } }) {
  try {

    const params = await context.params;
    const employeeId = Number(params.id);

    if (isNaN(employeeId)) {
      return NextResponse.json({ error: "Invalid employeeId" }, { status: 400 });
    }

    const url = new URL(req.url);
    const statusParamRaw = url.searchParams.get("status"); // ACTIVE, INACTIVE, ALL

    let statusFilter: ValidStatus | undefined;
    if (statusParamRaw && statusParamRaw !== "ALL") {
      if (validStatuses.includes(statusParamRaw as ValidStatus)) {
        statusFilter = statusParamRaw as ValidStatus;
      } else {
            return NextResponse.json(
                { error: "Invalid status query parameter. Must be ACTIVE, INACTIVE, or ALL." }, 
                { status: 400 }
        );
      }
    }

    // Fetch assignments and include project
    const assignments = await prisma.projectAssigned.findMany({
      where: {
        employeeId,
        project: statusFilter ? { status: statusFilter } : undefined
      },
      include: {
        project: true
      },
      orderBy: { assignedDate: "asc" }
    });

    // Instead of returning only projects, include assignedDate
    const result = assignments.map(a => ({
      assignedDate: a.assignedDate,
      project: a.project
    }));

    return NextResponse.json(result);
  } catch(error){
        console.error(error);
        return NextResponse.json(
            {error: "Unable to Retrieve Employee Project records"},
            {status: 500 }
        );
    }
}