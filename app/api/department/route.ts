import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/db"

// Retrieve Department Information
export async function GET(request: NextRequest){
    try{
        const searchParams = request.nextUrl.searchParams;
        const includeEmployees = searchParams.get("includeEmployees") === "true";
        const departments=await prisma.department.findMany({
            include: {
                employees: includeEmployees
            }
        });
        return NextResponse.json({
            departments,
        });
    } catch(error){
        return NextResponse.json(
            {error: "Unable to Retreive Department Data"},
            {status : 500}
        )
    }
}
