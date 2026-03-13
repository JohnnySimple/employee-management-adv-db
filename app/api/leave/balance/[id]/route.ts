import { NextResponse } from "next/server";
import {prisma} from "@/lib/db";

// To update the total remaining days for a specific employee.
export async function PUT(req:Request,{params}:{params:{id:string}}){
    try{
        const {id}=await params;
        const employeeLeaveId=Number(id);
        if(isNaN(employeeLeaveId)){
            return NextResponse.json({error:`Invalid Employee Leave ID ${employeeLeaveId}`},{status:400});
        }
        // Validation
        const {totalRemaining}=await req.json();
        if(typeof totalRemaining !== "number"){
            return NextResponse.json({error:"totalRemaining must be a number"},{status:400});
        }
        // Update the total remaining days for the specified employee leave record.
        const updatedLeave=await prisma.employeeLeave.update({
            where:{employeeLeaveId},
            data:{totalRemaining:totalRemaining}
        });
        return NextResponse.json(updatedLeave);
    }catch(error){
        console.log(error);
        return NextResponse.json({error:"Unable to update total remaining Leave Days"},{status:500});
    }
}