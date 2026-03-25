"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartBar } from "lucide-react";
import api from "@/lib/api";
import AttendanceHistoryTable from "@/components/employee/attendance-history-table";
import { Hourglass, Clock, Play, Square } from "lucide-react";

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

    const totalHours = attendance?.reduce((sum, a) => sum + (a.hoursWorked || 0) + (a.overtimeHours || 0), 0);
    const averageWorkingHours = attendance?.reduce((sum, a) => sum + (a.hoursWorked || 0), 0) / (attendance?.length || 1);

    const getMinutes = (date: Date) => {
        date = new Date(date);
        return date.getHours() * 60 + date.getMinutes();
    }
    const averageCheckInMinutes = attendance?.reduce((sum, a) => sum + getMinutes(a.timeIn), 0) / (attendance?.length || 1);
    const averageCheckIn = `${Math.floor(averageCheckInMinutes / 60)
        .toString().padStart(2, "0")}:${Math.floor(averageCheckInMinutes % 60).toString().padStart(2, "0")}`;

    const validCheckouts = attendance?.filter(a => a.timeOut);
    const averageCheckOutMinutes = validCheckouts?.reduce((sum, a) => sum + getMinutes(a.timeOut), 0) / (attendance?.length || 1);
    const averageCheckOut = `${Math.floor(averageCheckOutMinutes / 60)
        .toString().padStart(2, "0")}:${Math.floor(averageCheckOutMinutes % 60).toString().padStart(2, "0")}`;
    

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between mb-6 bg-white rounded-2xl p-4 shadow-sm">

                {/* Item */}
                <div className="flex items-center gap-4 px-4">
                    <div className="p-3 rounded-xl bg-purple-100">
                        {/* replace with Activity if needed */}
                        <Hourglass className="w-7 h-7 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Total Hours</p>
                        <p className="text-xl font-semibold">{ totalHours?.toFixed(2) }</p>
                    </div>
                </div>

                <div className="hidden lg:block h-10 w-px bg-gray-200" />

                {/* Item */}
                <div className="flex items-center gap-4 px-4">
                    <div className="p-3 rounded-xl bg-blue-100">
                        <Clock className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Average Working Hours</p>
                        <p className="text-xl font-semibold">{ averageWorkingHours?.toFixed(2) }</p>
                    </div>
                </div>

                <div className="hidden lg:block h-10 w-px bg-gray-200" />

                {/* Item */}
                <div className="flex items-center gap-4 px-4">
                    <div className="p-3 rounded-xl bg-green-100">
                        <Play className="w-7 h-7 text-green-600" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Average Check In Time</p>
                        <p className="text-xl font-semibold">{ averageCheckIn }</p>
                    </div>
                </div>

                <div className="hidden lg:block h-10 w-px bg-gray-200" />

                {/* Item */}
                <div className="flex items-center gap-4 px-4">
                    <div className="p-3 rounded-xl bg-orange-100">
                        <Square className="w-7 h-7 text-orange-600" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Average Check Out Time</p>
                        <p className="text-xl font-semibold">{ averageCheckOut }</p>
                    </div>
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