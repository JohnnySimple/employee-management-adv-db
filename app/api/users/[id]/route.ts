import { NextResponse } from "next/server";
import {prisma} from "@/lib/db"



// GET User BY ID
export async function GET(req:Request,{ params }:{ params: { id: any }}){
    try{
        let { id } = await params;
        id = Number(id)

        if(isNaN(id)){
            return NextResponse.json({ error: "Invalid UserId" },{ status:400 });
        }

        const user = await prisma.user.findUnique({
            where :{ id },
            include:{ employee:true }
        });

        if(!user){
            return NextResponse.json(
                {error:"User Not Found"},
                {status:404}
            );
        }
        return NextResponse.json(user)
    } catch(error){
        console.log(error)
        return NextResponse.json(
            {error:"Unable to Retreive User"},
            {status:500}
        );
    }
}
