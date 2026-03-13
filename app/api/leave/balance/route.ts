import { NextResponse } from "next/server";
import {prisma} from "@/lib/db";

// Retrieves List of all employees and their leave balances per leave type
export async function GET(req:Request){
    try{
        const balances=await prisma.employeeLeave.findMany({
            include:{
                employee:true,
                leave:true
            }
        });

        // Create an object to hold the leave balances for each employee
        const grouped:any={};
        // Loop though the balances array.
        balances.forEach((b)=>{
            if(!grouped[b.employeeId]){
                grouped[b.employeeId]={
                    employeeId:b.employeeId,
                    employeeName:b.employee.firstName+" "+b.employee.lastName,
                    leaveBalances:[]
                };
            }

            grouped[b.employeeId].leaveBalances.push({
                leaveType:b.leave.leaveType,
                totalLeaveHours:b.totalLeaveHours,
                totalRemaining:b.totalRemaining,
                status:b.status
            });
        });

        return NextResponse.json(grouped);
    } catch (error) {
        console.error("Error fetching leave balances:", error);
        return NextResponse.json({ error: "Failed to fetch leave balances" }, { status: 500 });
    }
}