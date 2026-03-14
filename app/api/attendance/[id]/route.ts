import { NextResponse } from "next/server";
import {prisma} from "@/lib/db";

// Get a specific attendance record by ID
export async function GET(req:Request,{params}:{params:{id:string}}){
    try{
        const {id}=await params;
        // Validate if Employee ID is a valid ID
        const attendanceId=Number(id);
        if(isNaN(attendanceId)){
            return NextResponse.json({error:`Invalid Attendance ID ${attendanceId}`},{status:400});
        }
        // Get the attendance records for the specified employee ID
        const attendance=await prisma.attendance.findUnique({
            where:{attendanceId}
        });

        // Check if attendance for specific employee ID exists
        if(!attendance){
            return NextResponse.json({error:`Attendance Record for ${attendanceId} not found`},{status:404});
        };
        
        return NextResponse.json(attendance);
    }catch(error){
        return NextResponse.json(
            {error:"Unable to fetch attendance record"},
            {status:500}
        );
    }
}

// Update an existing attendance record by ID
export async function PUT(req:Request,{params}:{params:{id:string}}){
    try{
        const {id}=await params;
       const attendanceId=Number(id);
       if (isNaN(attendanceId)){
        return NextResponse.json({error:`Invalid ${attendanceId}`},{status:400});
       }

        const data=await req.json();
        console.log(data);

        // Convert Date object to date type Validate
        const workDate=new Date(data.workDate);
        if(isNaN(workDate.getTime())){
            return NextResponse.json(
                {error:"Invalid Date Format"},
                {status:400}
            );
        }

        // Validate the hours Worked
        const hoursWorked=Number(data.hoursWorked);
        if(isNaN(hoursWorked)||hoursWorked<0 || hoursWorked>24){
            return NextResponse.json(
                {error:"Invalid Hours Worked"},
                {status:400}
            );
        }

        // Validate the overtime hours
        const overtimeHours=Number(data.overtimeHours);
        if(isNaN(overtimeHours)||overtimeHours< 0 || overtimeHours>10){
            return NextResponse.json(
                {error:"Invalid Overtime Hours"},
                {status:400}
            );
        }
        // Update the attendance record
        const attendance=await prisma.attendance.update({
            where:{attendanceId},
            data:{
                workDate,
                hoursWorked,
                overtimeHours
            }
        });

        return NextResponse.json(attendance);

    }catch(error){
        console.log(error);
        return NextResponse.json(
            {error:"Unable to update attendance record"},
            {status:500}
        );
    }
}