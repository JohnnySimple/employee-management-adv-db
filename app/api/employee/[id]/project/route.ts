import { NextResponse } from "next/server";
import {prisma} from "@/lib/db";

// get projects assigned to a specific employee
export async function GET(req:Request,{params}:{params:{id:string}}){
    try{
        const {id}= await params;
        const employeeId=Number(id);
        if(isNaN(employeeId)){
            return NextResponse.json({error:"Invalid Employee ID"},{status:400});
        }
        // find active projects assigned to the employee
        const projects = await prisma.projectAssigned.findMany({
            where:{employeeId, project:{status:"ACTIVE"}},
            include:{project:true}
        });
        return NextResponse.json(projects);
    }catch(error){
        return NextResponse.json(
            {error:"Unable to fetch projects for the employee"},
            {status:500}
        );
    }
}