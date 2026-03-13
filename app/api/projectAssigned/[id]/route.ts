// app/api/projectAssigned/[id]/route.ts
import { NextResponse } from "next/server";
import {prisma} from "@/lib/db"

// Get Method to retrieve projectAssigned information for a specific projectAssigned record based on ID
export async function GET(req:Request, context: { params: { id: string } }){  
    try{
        const params = await context.params;


        const assignId = Number(params.id);

        if (isNaN(assignId)) {
            return NextResponse.json({error: "Invalid Project Assigned ID"}, {status:400});
        }

        const projectAssigned = await prisma.projectAssigned.findUnique({
            where: { assignId },
            include:{
                employee:true,
                project:true
            },
        });

        if(!projectAssigned){
            return NextResponse.json(
                {error: "Project Assigned record not found"},
                {status:404}
            );
        }

        return NextResponse.json(projectAssigned);
    }catch(error){
        console.error(error);
        return NextResponse.json(
            {error : "Unable to Retrieve Project Assigned Data"},
            {status: 500 }
        );
    }
}

// PATCH method to update projectAssigned information for a specific projectAssigned record based on ID
export async function PATCH(req: Request, context: { params: { id: string } } ){
    try{

        const params = await context.params;

        const assignId = Number(params.id);

        if (isNaN(assignId)) {
            return NextResponse.json({ error: "Invalid Project Assigned ID" }, { status: 400 });
        }
        
        const data = await req.json();

        // Validate assignedDate
        let assignedDate = undefined;
        if (data.assignedDate !== undefined) {
            assignedDate = new Date(data.assignedDate);
        if (isNaN(assignedDate.getTime())) {
            return NextResponse.json({ error: "assignedDate must be a valid date" }, { status: 400 });
            }
        }

        // Validate employeeId
        const employeeId =
        data.employeeId !== undefined
            ? typeof data.employeeId === "number"
            ? data.employeeId
            : null
            : undefined;

        if (employeeId === null) {
            return NextResponse.json({ error: "employeeId must be a number" }, { status: 400 });
        }

        // Validate projectId
        const projectId =
            data.projectId !== undefined
                ? typeof data.projectId === "number"
                ? data.projectId
                : null
                : undefined;
                
        if (projectId === null) {
            return NextResponse.json({ error: "projectId must be a number" }, { status: 400 });
        }

        // Ensure employeeId exists
        if (employeeId !== undefined) {
            const employeeExists = await prisma.employee.findUnique({ where: { employeeId } });
            if (!employeeExists) {
                return NextResponse.json({ error: "Employee does not exist" }, { status: 400 });
            }
        }

        // Ensure projectId exists
        if (projectId !== undefined) {
            const projectExists = await prisma.project.findUnique({ where: { projectId } });
            if (!projectExists) {
                return NextResponse.json({ error: "Project does not exist" }, { status: 400 });
            }
        }
        
        const updatedProjectAssigned = await prisma.projectAssigned.update({
            where: { assignId },
            data: {
                employeeId,       
                projectId,   
                assignedDate
                }
        });

    return NextResponse.json(updatedProjectAssigned);
    }catch(error){
        console.error(error);
        return NextResponse.json(
            {error: "Unable to Update Project Assigned Record"},
            {status: 500 }
        );
    }
}
