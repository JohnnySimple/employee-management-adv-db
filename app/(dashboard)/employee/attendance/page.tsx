"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import api from "@/lib/api";
import AttendanceHistoryTable from "@/components/employee/attendance-history-table";
import { Hourglass, Clock, Play, Square, Briefcase, Umbrella, CalendarCheck2, Activity } from "lucide-react";

export default function EmployeeAttendance() {

    const [attendance, setAttendance] = useState(null);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const response = await api.get("/attendancemp");
                setAttendance(response.data);
            } catch (error) {
                console.error("Error fetching user attendance:", error);
            }
        };

        fetchAttendance();
    }, [])

    const formatTime = (minutes: number) => {
        const roundedMinutes = Math.round(minutes);
        const h24 = Math.floor(roundedMinutes / 60);
        const m = roundedMinutes % 60;
        const period = h24 >= 12 ? "PM" : "AM";
        const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
        return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
    }

    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthRecords = attendance?.filter(a => {
    const recordDate = new Date(a.workDate);
    return recordDate.getMonth() === currentMonth && 
            recordDate.getFullYear() === currentYear;
    }) || [];

    const averageWorkingHoursthisMonth = thisMonthRecords.reduce((sum, a) => 
    sum + (a.hoursWorked || 0), 0) / (thisMonthRecords.length || 1);


    const totalHoursThisMonth = thisMonthRecords?.reduce((sum, a) => sum + (a.hoursWorked || 0) + (a.overtimeHours || 0), 0);
    

    const getMinutes = (date: Date) => {
        date = new Date(date);
        return date.getHours() * 60 + date.getMinutes();
    }

    const totalMinutesTimeIn = thisMonthRecords.reduce((sum, a) => {
    return sum + getMinutes(a.timeIn);
    }, 0);

    const avgMinutesTimeIn = totalMinutesTimeIn / (thisMonthRecords.length || 1);


    const totalMinutesTimeOut = thisMonthRecords.reduce((sum, a) => {
    return sum + getMinutes(a.timeOut);
    }, 0);

    const avgMinutesTimeOut = totalMinutesTimeOut / (thisMonthRecords.length || 1);



    // const averageCheckInTime = thisMonthRecords?.reduce((sum, a) => sum + getMinutes(a.timeIn), 0) / (attendance?.length || 1);
    // const averageCheckIn = `${Math.floor(averageCheckInMinutes / 60)
    //     .toString().padStart(2, "0")}:${Math.floor(averageCheckInMinutes % 60).toString().padStart(2, "0")}`;
    const avgerageCheckIn = formatTime(avgMinutesTimeIn);

    //const validCheckouts = thisMonthRecords?.filter(a => a.timeOut);
    // const averageCheckOutMinutes = validCheckouts?.reduce((sum, a) => sum + getMinutes(a.timeOut), 0) / (attendance?.length || 1);
    // const averageCheckOut = `${Math.floor(averageCheckOutMinutes / 60)
    //     .toString().padStart(2, "0")}:${Math.floor(averageCheckOutMinutes % 60).toString().padStart(2, "0")}`;
    const averageCheckOut = formatTime(avgMinutesTimeOut);

    

    return (
        <div className="p-6 space-y-6">
    {/* Corrected container: flex-wrap + gap-4 is the secret sauce */}
    <div className="flex flex-wrap gap-4 mb-6">
        
        {/* Card 1 */}
        <div className="w-full sm:w-[48%] lg:w-[23%]">
            <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Hours Worked</CardTitle>
                    <CalendarCheck2 className="w-4 h-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalHoursThisMonth?.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">This Month</p>
                </CardContent>
            </Card>
        </div>

        {/* Card 2 */}
        <div className="w-full sm:w-[48%] lg:w-[23%]">
            <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Average Working Hours</CardTitle>
                    <Hourglass className="w-4 h-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{averageWorkingHoursthisMonth?.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">This Month</p>
                </CardContent>
            </Card>
        </div>

        {/* Card 3 */}
        <div className="w-full sm:w-[48%] lg:w-[23%]">
            <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Average Clock In Time</CardTitle>
                    <Clock className="w-4 h-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{avgerageCheckIn}</div>
                    <p className="text-xs text-muted-foreground">This Month</p>
                </CardContent>
            </Card>
        </div>

        {/* Card 4 */}
        <div className="w-full sm:w-[48%] lg:w-[23%]">
            <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Average Clock Out Time</CardTitle>
                    <Clock className="w-4 h-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{averageCheckOut}</div>
                    <p className="text-xs text-muted-foreground">This Month</p>
                </CardContent>
            </Card>
        </div>
    </div>
            <div className="flex flex-col lg:flex-row gap-6 w-full">
                {/* Time Logging Card */}
                <div className="flex-1">
                    <Card className="h-full border-0 shadow-sm">
                        <CardHeader className="pb-3">
                        <CardTitle className="text-xl font-semibold flex items-center gap-2">
                            {/* <Clock className="h-5 w-5 text-primary" /> */}
                            Attendance History
                        </CardTitle>
                        <CardDescription>
                            View attendance logs
                        </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                        {/* Clock In/Out Buttons */}
                        {/* <div className="flex gap-3"> */}
                            <AttendanceHistoryTable history={attendance} />
                        {/* </div> */}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
