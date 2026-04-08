//app/api/project/route.ts
import { NextResponse } from "next/server";
import {prisma} from "@/lib/db"

const validStatuses = ["ACTIVE", "INACTIVE"] as const;
type ValidStatus = (typeof validStatuses)[number];

// GET method to retrieve projects with soft-delete support
export async function GET(req: Request) {
  try {
    // Parse query parameter
    const url = new URL(req.url);
    const statusParamRaw = url.searchParams.get("status"); // "ACTIVE", "INACTIVE", "ALL", or null

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

    // Build Prisma where clause
    const whereClause = statusFilter ? { status: statusFilter } : {};

    const projects = await prisma.project.findMany({
      where: whereClause,
      orderBy: { startDate: "asc" } // optional: sort by startDate
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to retrieve project data" },
      { status: 500 }
    );
  }
}

// POST method to create a new project record
export async function POST(req:Request){
    try{
        const data = await req.json();

        // Validate projectName
        if (!data.projectName || typeof data.projectName !== "string") {
            return NextResponse.json({ error: "Invalid projectName" }, { status: 400 });
            }
        const projectName = data.projectName.trim();

        // Validate startDate
        const startDate = new Date(data.startDate);
        if (isNaN(startDate.getTime())) {
            return NextResponse.json({ error: "Invalid startDate" }, { status: 400 });
        }

        // Validate endDate
        const endDate = new Date(data.endDate);
        if (isNaN(endDate.getTime())) {
            return NextResponse.json({ error: "Invalid endDate" }, { status: 400 });
        }

        if (endDate < startDate) {
            return NextResponse.json({ error: "endDate cannot be before startDate" }, { status: 400 });
        }

        //Validate location
        if (!data.location || typeof data.location !== "string") {
            return NextResponse.json({ error: "Invalid location" }, { status: 400 });
            }
        const location = data.location.trim();

        const status =
    data.status !== undefined
        ? typeof data.status === "string"
            ? data.status.trim()
            : null
        : undefined;

        // 1. Type validation
        if (status === null) {
            return NextResponse.json({ error: "status must be a string" }, { status: 400 });
        }

        // 2. Required field validation (Optional: remove if status can be empty)
        if (status === undefined) {
            return NextResponse.json({ error: "status is required" }, { status: 400 });
        }

        // 3. ENUM validation
        // Note: We don't use .toUpperCase() here because Enums are case-sensitive.
        // If your Enum is ACTIVE/INACTIVE, the input must match exactly.
        if (!["ACTIVE", "INACTIVE"].includes(status)) {
            return NextResponse.json(
                { error: "status must be one of the following: ACTIVE, INACTIVE" }, 
                { status: 400 }
            );
        }

        const newProject = await prisma.project.create({
            data: {
                projectName,
                startDate,
                endDate,
                location,
                status
            }
        });

        return NextResponse.json(newProject,{status:201});
    }catch(error){
        console.error(error);
        return NextResponse.json(
            {error: "Unable to Create Project Record"},
            {status: 500 }
        );
    }
}

//No Patch method created here as this can/should be handled by the /project/[id] route for updating specific project records
