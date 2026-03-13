//app/api/projectAssigned/route.ts
import { NextResponse } from "next/server";
import {prisma} from "@/lib/db"

//Get method to retrieve projectAssigned information
export async function GET(){

    try{
        const projectAssigned=await prisma.projectAssigned.findMany({
            include:{
                employee:false,
                project:false
            },
         });

    return NextResponse.json(projectAssigned);

    }catch(error){
        console.error(error);
        return NextResponse.json(
            {error: "Unable to Retrieve Project Assigned Data"},
            {status: 500 }
        );
    }
}

// POST method to create a new projectAssigned record
export async function POST(req:Request){
    try{
        const data = await req.json();

        // Validate assignedDate
        const assignedDate = data.assignedDate
        ? new Date(data.assignedDate)
        : new Date();

        if (isNaN(assignedDate.getTime())) {
        return NextResponse.json({ error: "Invalid assignedDate" }, { status: 400 });
        }

        // Validate employeeId
        const employeeId = Number(data.employeeId);
        if (isNaN(employeeId)) {
            return NextResponse.json({ error: "Invalid employeeId" }, { status: 400 });
        }

        // Validate projectId
        const projectId = Number(data.projectId);
        if (isNaN(projectId)) {
            return NextResponse.json({ error: "Invalid projectId" }, { status: 400 });
        }

        // Ensure employeeId exists
        const employeeExists = await prisma.employee.findUnique({ where: { employeeId } });
        if (!employeeExists) {
            return NextResponse.json({ error: "Employee does not exist" }, { status: 400 });
        }

        // Ensure projectId exists
        const projectExists = await prisma.project.findUnique({ where: { projectId } });
        if (!projectExists) {
            return NextResponse.json({ error: "Project does not exist" }, { status: 400 });
        }

        const newProjectAssigned = await prisma.projectAssigned.create({
            data: {
                employeeId,
                projectId,
                assignedDate
            }
        });

        return NextResponse.json(newProjectAssigned,{status:201});
    }catch(error){
        console.error(error);
        return NextResponse.json(
            {error: "Unable to Create Project Assigned Record"},
            {status: 500 }
        );
    }
}

//No Patch method created here as this can/should be handled by the /projectAssigned/[id] route for updating specific projectAssigned records
