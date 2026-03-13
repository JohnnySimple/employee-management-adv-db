//app/api/project/route.ts
import { NextResponse } from "next/server";
import {prisma} from "@/lib/db"

// Get Method to retrieve project information for a specific project record based on ID
export async function GET(req:Request, context: { params: { id: string } }){  
    try{
        const params = await context.params;


        const projectId = Number(params.id);

        if (isNaN(projectId)) {
            return NextResponse.json({error: "Invalid Project ID"}, {status:400});
        }

        const project = await prisma.project.findUnique({
            where: { projectId },
            include:{
                assigned:true
            },
        });

        if(!project){
            return NextResponse.json(
                {error: "Project record not found"},
                {status:404}
            );
        }

        return NextResponse.json(project);
    }catch(error){
        console.error(error);
        return NextResponse.json(
            {error : "Unable to Retrieve Project Data"},
            {status: 500 }
        );
    }
}

//Patch method to update project information for a specific project based on ID
export async function PATCH(req: Request, context: { params: { id: string } } ){
    try{

        const params = await context.params;

        const projectId = Number(params.id);

        if (isNaN(projectId)) {
            return NextResponse.json({ error: "Invalid Project ID" }, { status: 400 });
        }
        
        const data = await req.json();

        // Fetch existing project to compare dates if necessary
        const existingProject = await prisma.project.findUnique({
            where: { projectId }
        });

        if (!existingProject) {
            return NextResponse.json({ error: `Project ID ${projectId} not found` }, { status: 404 });
        }

        // Validate projectName
        const projectName =
            data.projectName !== undefined
                ? typeof data.projectName === "string"
                ? data.projectName.trim()
                : null
                : undefined;

        if (projectName === null) {
            return NextResponse.json({ error: "projectName must be a string" }, { status: 400 });
        }

        // Validate location
        const location =
            data.location !== undefined
                ? typeof data.location === "string"
                ? data.location.trim()
                : null
                : undefined;

        if (location === null) {
            return NextResponse.json({ error: "location must be a string" }, { status: 400 });
        }

        //Validate startDate
        let startDate = undefined;
        if (data.startDate !== undefined) {
            startDate = new Date(data.startDate);
        if (isNaN(startDate.getTime())) {
            return NextResponse.json({ error: "startDate must be a valid date" }, { status: 400 });
        }
        }

        //Validate endDate
        let endDate = undefined;
        if (data.endDate !== undefined) {
            endDate = new Date(data.endDate);
        if (isNaN(endDate.getTime())) {
            return NextResponse.json({ error: "endDate must be a valid date" }, { status: 400 });
        }
        }

        // Use existing values for comparison if one is missing
        const startForCompare = startDate ?? existingProject.startDate;
        const endForCompare = endDate ?? existingProject.endDate;

        if (startForCompare >= endForCompare) {
            return NextResponse.json({ error: "startDate must be before endDate" }, { status: 400 });
        }

        const updatedProject = await prisma.project.update({
            where: { projectId },
            data: {
                projectName,       
                startDate,
                endDate,
                location   
            }
        });

        return NextResponse.json(updatedProject);
    }catch(error){
        console.error(error);
        return NextResponse.json(
            {error: "Unable to Update Project Record"},
            {status: 500 }
        );
    }
}