import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";


// Verify JWT and extract user info
export async function verifyToken(req:Request) {
    const cookieStore=await cookies();
    console.log("Cookies:", cookieStore.getAll());

    const cookieToken= (await cookies()).get("token")?.value;

    let authHeader: string | null = null;
    if (req) authHeader = req.headers.get("authorization");
    const headerToken = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    const token= headerToken || cookieToken;

    // Validate the token if exists
    if(!token){
       throw new Error("Authentication token Missing");
    }

    if(!process.env.JWT_SECRET) {
        throw new Error("JWT secret not configured in env");
    }

    const secret=new TextEncoder().encode(process.env.JWT_SECRET);

    const {payload} = await jwtVerify(token, secret);
    if(!payload.employeeId)  throw new Error("Unauthorized");
    return payload.employeeId as number;
}

// Retrives the list of attendance records for the authenticated employee
export async function GET(req:Request) {
    try{
        const employeeId = await verifyToken(req);

        // Get attendance records for the employee
        const attendanceRecords=await prisma.attendance.findMany({
            where : { employeeId },
            orderBy: { workDate: "desc" }
        });

        return NextResponse.json(attendanceRecords);
    } catch(error){
        console.log(error);
        return NextResponse.json(
            { error: { message: "Unable to fetch attendance records" } },
            { status: 401 }
        );
    }
}

// Clock in for authorized employee
export async function POST(req:Request){
    try{
        const employeeId=await verifyToken(req);

        // Set clock in time to today's date with current time
        const clockInTime=new Date();
        clockInTime.setHours(clockInTime.getHours(), clockInTime.getMinutes(), 0, 0); //Nomalize to start of the day
        
        // If employee is already clocked in for today
        const existingRecord=await prisma.attendance.findFirst({
            where:{employeeId, workDate: clockInTime }
        });

        if(existingRecord){
            return NextResponse.json({ message:`Employee ${employeeId} already clocked in for today.` }, { status: 400 });
        }

        // Create an attendance record for the employee once clocked in 
        const attendanceRecord=await prisma.attendance.create({
            data: {
                employeeId,
                workDate: clockInTime,
                timeIn: clockInTime
            }
        });

        return NextResponse.json({ message: `Employee ${employeeId} clocked in successfully.` }, { status: 201 });

    }catch(error){
        console.log(error);
        return NextResponse.json(
            { error: { message: "Unable to clock in" } },
            { status: 401 }
        );
    }
}

// Clock out for authorized employee
export async function PUT(req:Request){
    try{
        const employeeId=await verifyToken(req);

        // Find today's attendance record for the employee
       const today=new Date();
       today.setHours(today.getHours(), today.getMinutes(), 0, 0); // Normalize to start of the day

       const attendance=await prisma.attendance.findFirst({
        where:{ employeeId, workDate: today ,timeOut:null}
       });

       if(!attendance){
        return NextResponse.json({ message: `Employee ${employeeId} has not clocked in today.` }, { status: 400 });
       }

       const clockOutTime=new Date();
       const ClockIn=attendance.timeIn;

       // calcuate total hours worked
       const msWorked=clockOutTime.getTime() - new Date(ClockIn).getTime();
       const hoursWorked=msWorked / (1000 * 60 * 60);

        //Calculate overtime hours 
       const overtimeHours=hoursWorked > 8 ? hoursWorked - 8 : 0;

       // Update the attendance record with clock out time, total hours and overtime hours
       const updatedRecord=await prisma.attendance.update({
        where: { attendanceId: attendance.attendanceId },
        data:{
            timeOut: clockOutTime,
            hoursWorked:Number(hoursWorked.toFixed(2)),
            overtimeHours:Number(overtimeHours.toFixed(2))
        }
       });

       return NextResponse.json(updatedRecord);
    }catch(error){
        console.log(error);
        return NextResponse.json(
            { error: { message: "Unable to clock out" } },
            { status: 401 }
        );
    }
}
