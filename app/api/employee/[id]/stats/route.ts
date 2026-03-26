import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";


export async function GET(req:Request,{params}:{params:{id:string}}) {
    try {
        // call project api
        const { id } = await params;
        const employeeId = Number(id);
        if (isNaN(employeeId)) {
            return NextResponse.json({ error: "Invalid Employee ID" }, { status: 400 });
        }

        const projects = await prisma.projectAssigned.findMany({
            where:{employeeId, project:{status:"ACTIVE"}},
            include:{project:true}
        });

        return NextResponse.json({
            "activeProjects": projects,
            "activeProjectCount": projects.length
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}