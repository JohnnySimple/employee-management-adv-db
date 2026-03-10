import { NextResponse } from "next/server";
import {prisma} from "@/lib/db"


// GET Employee BY ID
export async function GET({params}:{params:{id:string}}){
    try{
        // find Employees
        const employee=await prisma.employee.findUnique({
            where :{
                employeeId:Number(params.id)
            },
            include:{
                department:true,
                jobTitle:true
            }
        });

        if(!employee){
            return NextResponse.json(
                {error:"Employee Not Found"},
                {status:404}
            );
        }
        return NextResponse.json(employee)
    } catch(error){
        return NextResponse.json(
            {error:"Unable to Retreive Employee"},
            {status:500}
        );
    }
}

// Update employee records
export async function PUT(req:Request,{params}:{params:{id:string}}){
    try{
        const data=await req.json();
        // required Fields
        const requiredFields=["firstName","lastName","dob","hireDate","email","phone","jobStatus","deptId","jobTitleId"];
        for(const field of requiredFields){
            if(!data[field]){
                return NextResponse.json(
                    {error:`${field} is required`},
                    {status:400}
                );
            }
        }
        // update Employee
        const employee=await prisma.employee.update({
            where:{employeeId:Number(params.id)},
            data:{
                firstName:data.firstName,
                lastName:data.lastName,
                dob:data.dob,
                hireDate:data.hireDate,
                email:data.email,
                phone:data.phone,
                jobStatus:data.jobStatus,
                deptId:data.deptId,
                jobTitleId:data.jobTitleId
            }
        });
        return NextResponse.json(employee)
    }catch(error){
        return NextResponse.json(
            {error:"Unable to Update Employee"},
            {status:500}
        );
    }
}

// Delete Method which soft deletes and not completely.
export async function PATCH(req:Request,{params}:{params:{id:string}}){
    try{
        // Soft Update
        const employee=await prisma.employee.update({
            where : {
                employeeId :Number(params.id),
            },
            data : {
                jobStatus:'INACTIVE'
            }
        });

        return NextResponse.json({message: "Employee Deactivated Successfully",employee});
    } catch(error){
        return NextResponse.json(
            {error:"Unable to Delete Employee Information"},
            {status : 500}
        );
    }
}