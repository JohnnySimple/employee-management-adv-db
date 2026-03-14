import { NextResponse } from "next/server";
import {prisma} from "@/lib/db";

// Retrieves List of ALL leave Requests
export async function GET(){
    try{
        const leaveRequests= await prisma.leaveDate.findMany({
            include:{
                employeeLeave:{
                    include:{
                        employee:true,
                        leave:true
                    }
                }
            }
        });

        // Format the response to include employee and leave details
        const formattedLeaveRequests=leaveRequests.map((lr)=>({
            leaveDate:lr.leaveDateId,
            employeeName:lr.employeeLeave.employee.firstName + " " + lr.employeeLeave.employee.lastName,
            employeeId:lr.employeeLeave.employeeId,
            leaveType:lr.employeeLeave.leave.leaveType,
            startDate:lr.startDate,
            endDate:lr.endDate,
            hoursOff:lr.hoursOff,
            status:lr.employeeLeave.status
        }));

        return NextResponse.json(formattedLeaveRequests);
    }catch(error){
        return NextResponse.json({error:"Failed to retrieve leave requests"}, {status:500});
    }
}

// Creates a New Leave date entry for a leave request
export async function POST(req:Request){
    try{
        const data=await req.json();
        // Required Fields: employeeLeaveId, startDate, endDate, hoursOff
        const requiredFields=["employeeLeaveId","startDate","endDate","hoursOff"];
        for(const field of requiredFields){
            if(!data[field]){
                return NextResponse.json({error:`${field} is Required`}, {status:400});
            }
        }
        // Check if EmployeeLeaveId exists
        const employeeLeaveId=Number(data.employeeLeaveId);
        if(isNaN(employeeLeaveId) || !employeeLeaveId){
            return NextResponse.json({error:"employeeLeaveId does not exist "}, {status:400});
        }
        // Validate Date objects
        const startDate=new Date(data.startDate);
        const endDate=new Date(data.endDate);
        if(isNaN(startDate.getTime()) || isNaN(endDate.getTime())){
            return NextResponse.json({error:"Invalid date format for startDate or endDate"}, {status:400});
        }


        // Check if employeeLeaveId exists in the database
        const employeeLeave=await prisma.employeeLeave.findUnique({
            where:{employeeLeaveId}
        });

        if(!employeeLeave){
            return NextResponse.json({error:"employeeLeaveId does not exist in the database"}, {status:400});
        }

        // HoursOff must not be negative
        const hoursOff=Number(data.hoursOff);
        if(hoursOff > employeeLeave.totalRemaining){
            return NextResponse.json({error:"Requested hours exceed remaining leave balance"}, {status:400});
        }

        // Prevent Overlapping leave requests for the same employee
        const overlappingLeave=await prisma.leaveDate.findFirst({
            where:{
                employeeLeaveId,
                OR:[
                    {
                        startDate:{lte:endDate},
                        endDate:{gte:startDate}
                    }
                ]
                    }
            });

        if(overlappingLeave){
            return NextResponse.json({error:"Overlapping leave request exists for the same employee"}, {status:400});
        }
        const newLeaveDate=await prisma.leaveDate.create({
            data:{
                employeeLeaveId,
                startDate,
                endDate,
                hoursOff
            }
        });
        return NextResponse.json(newLeaveDate);
    }catch(error){
        console.log(error);
        return NextResponse.json({error:"Failed to create leave date entry"}, {status:500});
    }
}