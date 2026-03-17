import { NextResponse } from "next/server";
import {prisma} from "@/lib/db";
import { jwtVerify } from "jose";


// Retrive list of paydates, and salary details for the authenticated employee
export async function GET(req:Request){
    try{
        let authHeader:string | null= null;
        if(req) authHeader=req.headers.get("authorization");
        const headerToken=authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

        const token= headerToken;

        const secret=new TextEncoder().encode(process.env.JWT_SECRET);

        const {payload}=await jwtVerify(token,secret);
        const employeeId=payload.employeeId as number;

        const salaryRecords=await prisma.salary.findMany({
            where:{employeeId},
            orderBy:{salaryDate:"desc"}
        });

        if(!salaryRecords){
            return NextResponse.json({error:`No Salary records found for employee ID ${employeeId}`},{status:404});
        }
        return NextResponse.json({message: "Salary records fetched successfully", salaryRecords});
    }catch(error){
        console.log(error);
        return NextResponse.json({error:{message:"Unable to fetch salary records"}},{status:401});
    }
}