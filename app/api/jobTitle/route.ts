import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/db"

// Retrieve JobTitle Information
export async function GET(request: NextRequest){
    try{
        const searchParams = request.nextUrl.searchParams;
        const includeEmployees = searchParams.get("includeEmployees") === "true";
        const jobTitles=await prisma.jobTitle.findMany({
            include: {
                employees: includeEmployees
            }
        });
        return NextResponse.json({
            jobTitles,
        });
    } catch(error){
        return NextResponse.json(
            {error: "Unable to Retreive JobTitle Data"},
            {status : 500}
        )
    }
}
