import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { jwtVerify } from "jose";

// Retrieves all leave records for an authenticated employee
export async function GET(req:Request){
    try{
        let authHeader=req.headers.get("Authorization");
        const headerToken= authHeader?.startsWith("Bearer") ? 
        authHeader.split(" ")[1] : null;

        const token= headerToken;
        if(!token){
            return NextResponse.json({error:{message:"Authorization token missing"}} , {status:401});
        }

        const secret=new TextEncoder().encode(process.env.JWT_SECRET);

        const {payload}=await jwtVerify(token,secret);
        console.log("JWT Payload:", payload);
        const employeeId=payload.employeeId as number;

        // Fetch Leave records after authorization
        const leaveRecords=await prisma.employeeLeave.findMany({
            where:{employeeId},
            include:{
                leave:true,
            }
        });

        // Format response to include leave details
        const formattedRecords=leaveRecords.map(record=>({
            employeeId: record.employeeId,
            leaveId: record.leaveId,
            status: record.status,
            leaveType: record.leave.leaveType,
            totalRemaining:record.totalRemaining,
            totalLeaveHours:record.totalLeaveHours
        }));
        if(!formattedRecords){
            return NextResponse.json({error:{message:`No leave records found for employee ID ${employeeId}`}} , {status:404});
        }
        return NextResponse.json(formattedRecords);
    }catch(error){
        console.log("Error fetching leave records:", error);
        return NextResponse.json({error:{message:"Unable to fetch leave records"}} , {status:500});
    }
}

// Allows an authenticated employee to apply for leave requests