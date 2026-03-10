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

        const {firstName,
            lastName,
            dob,
            hireDate,
            email,
            phone,jobStatus,
            deptId,
            jobTitleId}= await req.json();

        const employee= await prisma.employee.create({
            data :{
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

        return NextResponse.json(employee,{status:201});
    } catch(error){
        return NextResponse.json(
            {error:"Unable to Create Employee"},
            {status:500}
        );
    }
}