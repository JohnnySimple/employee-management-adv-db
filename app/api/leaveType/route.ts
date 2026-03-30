import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/db"

// Retrieve all leave types
export async function GET(request: NextRequest){
    try{
        const leaveTypes = await prisma.leave.findMany();

        return NextResponse.json({
            leaveTypes
        });
    } catch(error){
        return NextResponse.json(
            {error: "Unable to Retreive leave types Data"},
            {status : 500}
        )
    }
}
