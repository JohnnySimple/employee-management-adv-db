//app/api/project/route.ts
import { NextResponse } from "next/server";
import {prisma} from "@/lib/db"

//Get method to retrieve project information
export async function GET(){

    try{
        const projects=await prisma.project.findMany({
            include:{
                assigned:true
            },
        });

    return NextResponse.json(projects);

    }catch(error){
        console.error(error);
        return NextResponse.json(
            {error: "Unable to Retrieve Project Data"},
            {status: 500 }
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


        const newProject = await prisma.project.create({
            data: {
                projectName,
                startDate,
                endDate,
                location
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
