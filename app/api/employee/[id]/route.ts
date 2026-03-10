import { NextResponse } from "next/server";
import {prisma} from "@/lib/db"

// Update employee records
export async function PUT(req:Request,{params}:{params:{id:string}}){
    try{
        const data=await req.json();

        const {
            firstName,
            lastName,
            dob,
            hireDate,email,
            phone,
            jobStatus,
            deptId,
            jobTitleId
        }=data;

        const employee=await prisma.employee.update({
            where :{
                employeeId:Number(params.id)
            },
            data:{
                firstName,
                lastName,
                dob,
                hireDate,
                email,
                phone,
                jobStatus,
                deptId,
                jobTitleId 
            }
        }); 

        return NextResponse.json(employee);
    } catch(error){
        return NextResponse.json(
            {error: "Unable to Update Employee Information"},
            {status : 500}
        );
    }
}

// Delete Method which soft deletes and not completely.
export async function PATCH(req:Request,{params}:{params:{id:string}}){
    try{
        const data=await req.json();

        const employee=await prisma.employee.update({
            where : {
                employeeId :Number(params.id),
            },
            data : {
                jobStatus:'inactive'
            }
        });

        return NextResponse.json(employee)
    } catch(error){
        return NextResponse.json(
            {error:"Unable to Delete Employee Information"},
            {status : 500}
        );
    }
}