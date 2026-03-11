import { NextResponse } from "next/server";
import {prisma} from "@/lib/db";
import { error } from "node:console";

// Get the list of all exployees along with their attendance records
export async function GET(){
    try{
        const employee=await prisma.employee.findMany({
            where:{jobStatus:'ACTIVE'},
            include:{
                attendance:{
                    orderBy:{
                        workDate:"desc"
                    }
                }
            }
        });
        return NextResponse.json(employee);
    }catch(error){
        return NextResponse.json(
            {error:"Unable to fetch employee attendance records"},
            {status:500}
        );
    }
}

// Create an new Employee attendance record
export async function POST(req:Request){
    try{
        const data=await req.json()
        console.log(data);
        // Required Fields
        const requiredFields=[
            "employeeId",
            "workDate",
            "hoursWorked"
        ]
        for(const field of requiredFields){
            if(!data[field]){
                return NextResponse.json(
                    {error:`${field} is Required`},
                    {status:400}
                )
            }
        }
        // Validate if employeeID exists
        const employeeId=Number(data.employeeId);
        if(isNaN(employeeId)){
            return NextResponse.json(
                {error:"Invalid Employee ID"},
                {status:400}
            );
        }

        // Convert Date object to Date type
        const workDate=new Date(data.workDate);
        if(isNaN(workDate.getTime())){
            return NextResponse.json(
                {error:"Invalid Date Format"},
                {status:400}
            );
        }

        // Validate hours worked
        const hoursWorked=Number(data.hoursWorked);
        if(isNaN(hoursWorked) || hoursWorked <=0 || hoursWorked >24){
            return NextResponse.json(
                {error:"Invalid Hours Worked"},
                {status:400}
            );
        }

        // OverTime Hours should not be more than 4 hours
        const overtimeHours=Number(data.overtimeHours);
        if(isNaN(overtimeHours) || overtimeHours < 0 || overtimeHours > 10){
            return NextResponse.json(
                {error:"Invalid Overtime Hours"},
                {status:400}
            );
        }

        // Check if Employee exists or else return No employees
        const employee=await prisma.employee.findUnique({
            where:{employeeId}
        });

        if(!employee){
            return NextResponse.json(
                {error:"Employee not found"},
                {status:404}
            );
        }

        // Prevent dublicate attendance recording for the same day
        const existingRec= await prisma.attendance.findFirst({
            where:{
                employeeId,
                workDate
            }
        });
        if(existingRec){
            return NextResponse.json(
                {error:`Attendance Already recorded for ${workDate}`},
                {status:409}
            );
        }
        // Create Attendence Record
        const attendance= await prisma.attendance.create({
            data: {
                employeeId,
                workDate,
                hoursWorked,
                overtimeHours
            }
        });
        return NextResponse.json(attendance,{status:201});
    }catch(error){
        return NextResponse.json(
            {error:"Unable to create employee Attendance record"},
            {status:500}
        );
    }
}