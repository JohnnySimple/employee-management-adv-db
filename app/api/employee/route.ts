import { NextResponse } from "next/server";
import {prisma} from "@/lib/db"

// Retrieve Employeee Information
export async function GET(){
    try{
        // Employee Details which includes department and jobtitle
        const employees=await prisma.employee.findMany({
            where:{jobStatus:'ACTIVE'},
            include:{
                department:true,
                jobTitle:true
            }
        });
        // fetch the department
        const departments=await prisma.department.findMany();

        // fetch the job title
        const jobTitles=await prisma.jobTitle.findMany();

        return NextResponse.json({
            employees,
            departments,
            jobTitles
        });
    } catch(error){
        return NextResponse.json(
            {error: "Unable to Retreive Employee Data"},
            {status : 500}
        )
    }
}

// POST
export async function POST(req:Request){
   try{
    const data = await req.json();
    // Required Fields
    const requiredFields=["firstName","lastName","dob","hireDate","email","phone","jobStatus","deptId","jobTitleId"];

    // Validation
    for(const field in requiredFields){
        if(!data[field]){
            return NextResponse.json(
                {error:`${field} is required`},
                {status:400}
            );
        }
     }

    //  Convert the DOB and hireDate fields to Date Objects
    const dob=new Date(data.dob);
    if(isNaN(dob.getTime())){
        return NextResponse.json(
            {error:"Invalid Date of Birth"},
            {status:400}
        );
     }

     const hireDate=new Date(data.dob);
     if(isNaN(dob.getTime())){
        return NextResponse.json(
            {error:"Invalid Hire Date"},
            {status:400}
        );
     }

    //  Default JobStatus not Required but Putting this here commented
    // const jobStatus=data.jobStatus || "ACTIVE"

    //  Create Employee
    const employee= await prisma.employee.create({
        data:{
            firstName:data.firstName,
            lastName:data.lastName,
            dob:dob,
            hireDate:hireDate,
            email:data.email,
            phone:data.phone,
            jobStatus:data.jobStatus,
            deptId:data.deptId,
            jobTitleId:data.jobTitleId
        }
    });

    return NextResponse.json(employee,{status:201});
   } catch(error){
    return NextResponse.json(
        {error:"Unable to Create Employee"},
        {status:500}
    );
   }
}