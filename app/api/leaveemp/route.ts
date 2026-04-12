import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { jwtVerify } from "jose";
import { getCurrentUser } from "@/lib/auth";

// Retrieves all leave records for an authenticated employee
export async function GET(req:Request){
    try{
        // let authHeader=req.headers.get("Authorization");
        // const headerToken= authHeader?.startsWith("Bearer") ? 
        // authHeader.split(" ")[1] : null;

        // const token= headerToken;
        // if(!token){
        //     return NextResponse.json({error:{message:"Authorization token missing"}} , {status:401});
        // }

        // const secret=new TextEncoder().encode(process.env.JWT_SECRET);

        // const {payload}=await jwtVerify(token,secret);
        // console.log("JWT Payload:", payload);
        // const employeeId=payload.employeeId as number;

        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const employeeId = user.employeeId as number;

        // Fetch Leave records after authorization
        const leaveRecords=await prisma.employeeLeave.findMany({
            where:{employeeId},
            include:{
                leave: true,
                leaveDates: {
                    select: {
                        startDate: true,
                        endDate: true,
                        hoursOff: true,
                        status: true
                    }
                }
            }
        });

        // Format response to include leave details
        // const formattedRecords=leaveRecords.map(record=>({
        //     employeeId: record.employeeId,
        //     leaveId: record.leaveId,
        //     status: record.status,
        //     leaveType: record.leave.leaveType,
        //     totalRemaining:record.totalRemaining,
        //     totalLeaveHours:record.totalLeaveHours,
        // }));

        const flatttened = leaveRecords.flatMap((el) => 
            el.leaveDates.map(ld => ({
                employeeLeaveId: el.employeeLeaveId,
                leaveType: el.leave.leaveType,
                status: el.status,
                startDate: ld.startDate,
                endDate: ld.endDate,
                hoursOff: ld.hoursOff,
                dateStatus: ld.status
            }))
        )

        if(!flatttened){
            return NextResponse.json({error:{message:`No leave records found for employee ID ${employeeId}`}} , {status:404});
        }
        return NextResponse.json(flatttened);
    }catch(error){
        console.log("Error fetching leave records:", error);
        return NextResponse.json({error:{message:"Unable to fetch leave records"}} , {status:500});
    }
}

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { leaveId, startDate, endDate } = await req.json();

        // 1. Get the general balance record for this employee
        const employeeLeave = await prisma.employeeLeave.findFirst({
            where: { employeeId: user.employeeId }
        });

        if (!employeeLeave) {
            return NextResponse.json({ error: "Employee balance record not found." }, { status: 404 });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1;
        const hoursOff = Math.round(days * 8);

        // 3. Create the history record
        // We removed the overlapping check and the strict balance check here
        const newLeaveRequest = await prisma.leaveDate.create({
            data: {
                employeeLeaveId: employeeLeave.employeeLeaveId,
                startDate: start,
                endDate: end,
                hoursOff: hoursOff,
                status: "Pending",
                // If your leaveDate table has a leaveId column, include it here:
                // leaveId: leaveId 
            }
        });

        return NextResponse.json({ message: "Success", newLeaveRequest }, { status: 201 });

    } catch (error) {
        console.error("POST_ROUTE_ERROR:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

//  Update leave request status by employee
export async function PUT(req:Request){
    try{
        let authHeader=req.headers.get("Authorization");
        const headerToken=authHeader?.startsWith("Bearer") ?
        authHeader.split(" ")[1] : null;

        const token=headerToken;
        if(!token){
            return NextResponse.json({error:{message:"Authorization token missing"}} , {status:401});
        }

        const {payload}=await jwtVerify(token,new TextEncoder().encode(process.env.JWT_SECRET!))
        const employeeId=payload.employeeId as number;

        const {leaveDateId}=await req.json();

        // check if leave request exists and belongs to the employee
        const leaveReq=await prisma.leaveDate.findUnique({
            where:{leaveDateId},
            include:{
                employeeLeave:true
            }
        });

        if(!leaveReq || leaveReq.employeeLeave.employeeId !==employeeId){
            return NextResponse.json({error:{message:"Leave request not found or does not belong to the authenticated employee."}} , {status:404});
        }

        // check if status is pending before allowing cancellation or changing status
        if(leaveReq.status !=="Pending"){
            return NextResponse.json({error:{message:"Only pending leave requests can be cancelled or updated."}} , {status:400});
        }

        const startdate=new Date(leaveReq.startDate);
        const enddate=new Date(leaveReq.endDate);

        // Validate data fields to date objects
        if(isNaN(startdate.getTime()) || isNaN(enddate.getTime())){
            return NextResponse.json({error:{message:"Invalid date format, please provide valid start and end dates."}} , {status:400});
        }

        if(startdate >enddate){
            return NextResponse.json({error:{message:"Start date cannot be after end date."}} , {status:400});
        }

        // Calculate hours'
        const oldHoursOff=leaveReq.hoursOff;
        const days=(enddate.getTime() - startdate.getTime())/(1000*60*60*24)+1;
        const newHoursOff=days*8;

        const balance=leaveReq.employeeLeave;;

        // adjust remaining balance by adding back old hours and checking ig new hours exceed balance
        const adjustedBalance=balance.totalRemaining + oldHoursOff - newHoursOff;

        if(adjustedBalance <0){
            return NextResponse.json({error:{message:"Insufficient Leave balance "}} , {status:400});
        }
        // Update balance 
        await prisma.employeeLeave.update({
            where:{employeeLeaveId:balance.employeeLeaveId},
            data:{totalRemaining:adjustedBalance},
        })

        // Update the leave request status
        const updated=await prisma.leaveDate.update({
            where:{leaveDateId},
            data:{
                startDate:startdate,
                endDate:enddate,
                hoursOff:newHoursOff,
                status:"Approved"
            }
        });
        return NextResponse.json({message:"Leave request status updated successfully",updated},{status:200});
    }catch(error){
        console.log(error);
        return NextResponse.json({error:{message:"Unable to update leave request status"}} , {status:500});
    }
}