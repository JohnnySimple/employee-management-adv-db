import { NextResponse } from "next/server";
import {prisma} from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

import { verifyToken } from "../attendemp/route";
// Retrive list of paydates, and salary details for the authenticated employee
export async function GET(req:Request){
    try{
        const employeeId=await verifyToken(req);

        const salaryRecords=await prisma.salary.findMany({
            where:{employeeId},
            orderBy:{salaryDate:"desc"}
        });

        if(!salaryRecords){
            return NextResponse.json({error:`No Salary records found for employee ID ${employeeId}`},{status:404});
        }
        return NextResponse.json(salaryRecords);
    }catch(error){
        console.log(error);
        return NextResponse.json({error:{message:"Unable to fetch salary records"}},{status:401});
    }
}