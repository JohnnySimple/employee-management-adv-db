//app/api/salary/[id]/route.ts
import { NextResponse } from "next/server";
import {prisma} from "@/lib/db"

// Get Method to retrieve salary information for a specific salary record based on ID
export async function GET(req:Request, context: { params: { id: string } }){  
    try{
        const params = await context.params;


        const salaryId = Number(params.id);

        if (isNaN(salaryId)) {
            return NextResponse.json({error: "Invalid Salary ID"}, {status:400});
        }

        const salary = await prisma.salary.findUnique({
            where: { salaryId },
            include:{
                employee:true
            },
        });

        if(!salary){
            return NextResponse.json(
                {error: "Salary record not found"},
                {status:404}
            );
        }

        return NextResponse.json(salary);
    }catch(error){
        console.error(error);
        return NextResponse.json(
            {error : "Unable to Retrieve Salary Data"},
            {status: 500 }
        );
    }
}


// PATCH method to update salary information for a specific employee based on ID
//This method assumes we do not need to update the employeeId as it is a foreign key, can make changes later here if necessary
export async function PATCH(req: Request, context: { params: { id: string } } ){
    try{

        const params = await context.params;

        const salaryId = Number(params.id);

        if (isNaN(salaryId)) {
            return NextResponse.json({ error: "Invalid Salary ID" }, { status: 400 });
        }
        
        const data = await req.json();

        // Validate amount
            const amount =
            data.amount !== undefined
                ? typeof data.amount === "number"
                ? data.amount
                : null
                : undefined;

        if (amount === null) {
            return NextResponse.json({ error: "amount must be a number" }, { status: 400 });
        }

        // Validate salaryDate
        let salaryDate = undefined;
        if (data.salaryDate !== undefined) {
            salaryDate = new Date(data.salaryDate);
        if (isNaN(salaryDate.getTime())) {
            return NextResponse.json({ error: "salaryDate must be a valid date" }, { status: 400 });
        }
        }

        const updatedSalary = await prisma.salary.update({
            where: { salaryId },
            data: {
                amount,       
                salaryDate   
            }
        });

        return NextResponse.json(updatedSalary);
    }catch(error){
        console.error(error);
        return NextResponse.json(
            {error: "Unable to Update Salary Record"},
            {status: 500 }
        );
    }
}