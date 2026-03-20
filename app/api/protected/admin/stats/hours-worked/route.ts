import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// get total hours worked by workDate for the last n days, default to 7 days
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const daysParam = searchParams.get("days");
        const days = daysParam ? parseInt(daysParam) : 7;

        const today = new Date();
        const pastDate = new Date(today);
        pastDate.setDate(today.getDate() - days);

        // get total hours worked by workDate for the last n days
        const hoursWorkedByDate = await prisma.attendance.groupBy({
            by: ["workDate"],
            where: {
                workDate: {
                    gte: pastDate,
                    lte: today
                }
            },
            _sum: {
                hoursWorked: true
            },
            orderBy: {
                workDate: "asc"
            }
        });

        // format response to have date and totalHours
        const formattedResponse = hoursWorkedByDate.map(item => ({
            date: item.workDate.toISOString().split("T")[0],
            totalHours: item._sum.hoursWorked || 0
        }));

        return NextResponse.json(formattedResponse);
    } catch (error) {
        console.error("Error fetching hours worked:", error);
        return NextResponse.error();
    }
}