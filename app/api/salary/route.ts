//app/api/salary/route.ts
import { NextResponse } from "next/server";
import {prisma} from "@/lib/db"

//Get Method to retrieve salary information
export async function GET(){

    try{
        const salaries=await prisma.salary.findMany({
            include:{
                employee:false
            },
        });

        return NextResponse.json(salaries);
    }catch(error){
        console.error(error);
        return NextResponse.json(
            {error: "Unable to Retrieve Salary Data"},
            {status: 500 }
        );
    }
}

// POST method to create a new salary record for an employee
export async function POST(req:Request){
    try{
        const data = await req.json();

        // Validate employeeId
        const employeeId = Number(data.employeeId);
        if (isNaN(employeeId)) {
            return NextResponse.json({ error: "Invalid employeeId" }, { status: 400 });
        }

        // Validate salaryDate
        const salaryDate = new Date(data.salaryDate);
        if (isNaN(salaryDate.getTime())) {
            return NextResponse.json({ error: "Invalid salaryDate" }, { status: 400 });
        }

        // Validate amount
        const amount = parseFloat(data.amount);
        if (isNaN(amount)) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        // Ensure employeeId exists
        const employeeExists = await prisma.employee.findUnique({ where: { employeeId } });
        if (!employeeExists) {
            return NextResponse.json({ error: "Employee does not exist" }, { status: 400 });
        }

        const newSalary = await prisma.salary.create({
            data: {
                employeeId,
                salaryDate,
                amount
            }
        });

        return NextResponse.json(newSalary,{status:201});
    }catch(error){
        console.error(error);
        return NextResponse.json(
            {error: "Unable to Create Salary Record"},
            {status: 500 }
        );
    }
}

//No Patch method created here as this can/should be handled by the /salary/[id] route for updating specific salary records