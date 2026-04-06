import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        const employee = await req.json();

        if (!employee.employeeId) {
            return NextResponse.json(
                { error: "Missing employee ID" },
                { status: 400 }
            )
        }

        const user = await prisma.user.findUnique({
            where: {
                employeeId: Number(employee.employeeId)
            }
        })


        if (!user) {
            return NextResponse.json(
                { error: "User account not found" },
                { status: 404 }
            )
        }

        let newStatus = !user.isActive;

        await prisma.user.update({
            where: { id: user.id },
            data: {
                isActive: newStatus
            }
        });
        
        return NextResponse.json({
            message: "Account status toggled successfully"
        })

    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}