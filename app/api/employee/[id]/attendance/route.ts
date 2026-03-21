import { NextResponse } from "next/server";
import {prisma} from "@/lib/db";


// Get attendance record for a specific employee
export async function GET(req:Request,{params}:{params:{id:string}}){
    try{
        const {id}= await params;
        const employeeId=Number(id);
        if(isNaN(employeeId)){
            return NextResponse.json({error:"Invalid Employee ID"},{status:400});
        }
        // find attendance records for the employee
        const attendanceRecords=await prisma.attendance.findMany({
            where:{employeeId},
            orderBy:{workDate:"desc"}
        });
        return NextResponse.json(attendanceRecords);
    }catch(error){
        return NextResponse.json(
            {error:"Unable to fetch attendance records for the employee"},
            {status:500}
        );
    }
}