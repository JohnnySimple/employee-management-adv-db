import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
    try {
        const users = await prisma.user.findMany()
        return NextResponse.json(users)
    } catch(error) {
        return NextResponse.json({error: "Error fetching users"}, {status: 500})
    }
}

// Post Method
export async function POST(req:Request){
    try{
        const body:{name:string,email:string}=await req.json();

        // Validation
        if(!body.name || !body.email){
            return NextResponse.json(
            {error:"Name and Email Required"},
            {status:400}
            );
        }

        const user= await prisma.user.create({
            data:{
                name:body.name,
                email:body.email
            }
        });

        return NextResponse.json(user);
    } catch(error){
        return NextResponse.json(
            {error:"Error Creating User"},
            {status:500}
        );
    }
}