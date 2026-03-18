import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

export async function GET() {
    try {
        const users = await prisma.user.findMany()
        return NextResponse.json(users)
    } catch(error) {
        return NextResponse.json({error: "Error fetching users"}, {status: 500})
    }
}

export async function POST(req:Request) {
    try{
        const body:{name:string, email:string, employeeId: Number, password: string, role: string} = await req.json();
        
        // validation
        if(!body.name || !body.email || !body.employeeId || !body.password || !body.role){
            return NextResponse.json(
            {error:"name, email, employeeId, password, role are Required"},
            {status:400}
            );
        }

        const passwordHash = await bcrypt.hash(body.password, 10)

        const user= await prisma.user.create({
            data:{
                name: body.name,
                email: body.email,
                employeeId: Number(body.employeeId),
                passwordHash: passwordHash,
                role: body.role
            }
        });

        return NextResponse.json(body);
    } catch(error){
        console.log(error)
        return NextResponse.json(
            {error:"Error Creating User"},
            {status:500}
        );
    }
}