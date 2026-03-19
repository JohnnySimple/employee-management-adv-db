import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { jwtVerify } from "jose";
import { jwt } from "zod";

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
export async function POST(req:Request){
    try{
        let authHeader=req.headers.get("Authorization");
        const headerToken=authHeader?.startsWith("Bearer")?
        authHeader.split(" ")[1] : null;    

        const token=headerToken;
        if(!token){
            return NextResponse.json({error:{message:"Authorization token missing"}} , {status:401});   
        }

        const{payload}=await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
        const employeeId=payload.employeeId as number;

        const {LeaveId}=await req.json();

        // Check if Employee has any leave requests with pending status
        const employeeLeave= await prisma.employeeLeave.findFirst({
            where:{
                employeeId,
                leaveId:LeaveId,
            }
        });
        console.log("Employee Leave Check:", employeeLeave);
        if(!employeeLeave){
            return NextResponse.json({error:{message:"You have a pending leave request. Please wait for it to be processed before applying for another leave."}} , {status:400});
        }

        const start=new Date();
        const end=new Date();

        // Validate the date objects to date type
        if(isNaN(start.getTime()) || isNaN(end.getTime())){
            return NextResponse.json({error:{message:"Invalid date format. Please provide valid start and end dates."}} , {status:400});
        }

        //check if start date is after end date
        if(start > end){
            return NextResponse.json({error:{message:"Start date cannot be after end date."}} , {status:400});
        }

        // Calulate the hours
        const days=(end.getTime() - start.getTime())/(1000*60*60*24)+1;
        const hoursOff=days*8;

        // Check balance without deduction
        if(employeeLeave.totalRemaining <hoursOff){
            return NextResponse.json({error:{message:"You have sufficient leave balance. No need to submit leave request."}} , {status:400});
        }

        // Create a new Leave Request
        const newLeaveRequest=await prisma.leaveDate.create({
            data:{
                employeeLeaveId:employeeLeave.employeeLeaveId,
                startDate:start,
                endDate:end,
                hoursOff,
                status:"Pending"
            }
        });

        return NextResponse.json({message:"Leave Request Submitted Successfully",newLeaveRequest},{status:201});
    }catch(error){
        console.log(error);
        return NextResponse.json({error:{message:"Unable to submit leave request"}} , {status:500});
    }
}

//  Update leave request status by employee