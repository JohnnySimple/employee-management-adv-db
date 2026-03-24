"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartBar } from "lucide-react";
import api from "@/lib/api";
import AttendanceHistoryTable from "@/components/employee/attendance-history-table";

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
    

    return (
        <div className="p-6 space-y-6">
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