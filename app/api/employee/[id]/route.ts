import { NextResponse } from "next/server";
import {prisma} from "@/lib/db"



// GET Employee BY ID
export async function GET(req:Request,{params}:{params:{id:string}}){
    try{
        const {id}= await params;
        console.log(id);
        const employeeId=Number(id)
        console.log(employeeId);
        if(isNaN(employeeId)){
            return NextResponse.json({error:"Invalid EmployeeID"},{status:400});
        }
        // find Employees
        const employee=await prisma.employee.findUnique({
            where :{employeeId},
            include:{department:true,jobTitle:true}
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
        const {id}=await params;
        const employeeId=Number(id);
        if(isNaN(employeeId)){
            return NextResponse.json({error:"Invalid Employee ID"},{status:400});
        }
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
        // Convert dob and HireDate to Date objects
        const dob=new Date(data.dob);
        if(isNaN(dob.getTime())){
            return NextResponse.json({error:"Invalid Date of Birth"},{status: 400});
        }

        const hireDate=new Date(data.hireDate);
        if(isNaN(hireDate.getTime())){
            return NextResponse.json({error:"Invalid Hire Date"},{status:400});
        }

        // update Employee
        const employee=await prisma.employee.update({
            where:{employeeId},
            data:{
                firstName:data.firstName.trim(),
                lastName:data.lastName.trim(),
                dob : new Date(dob),
                hireDate: new Date(hireDate),
                email:data.email.trim(),
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
        const {id}=await params;
        const employeeId=Number(id);
        if(isNaN(employeeId)){
            return NextResponse.json({error:"Invalid Employee ID"},{status:400});
        }
        // Soft Update
        const employee=await prisma.employee.update({
            where : {employeeId},
            data : {jobStatus:'INACTIVE'}
        });

        return NextResponse.json({message: "Employee Deactivated Successfully",employee});

    } catch(error){
        return NextResponse.json(
            {error:"Unable to Deactivate Employee"},
            {status : 500}
        );
    }
}