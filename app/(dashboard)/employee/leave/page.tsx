"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartBar, Pill } from "lucide-react";
import api from "@/lib/api";
import { TreePalm } from "lucide-react";
import LeaveHistoryTable from "@/components/employee/leave-history-table";

export default function EmployeeLeave() {

    const [leaveHistory, setLeaveHistory] = useState(null);

    useEffect(() => {
        const fetchLeaveHistory = async () => {
            try {
                const response = await api.get("/leaveemp");
                setLeaveHistory(response.data);
            } catch (error) {
                console.error("Error fetching user leave history:", error);
            }
        };

        fetchLeaveHistory();
    }, [])


    return (
        <div className="p-6 space-y-6">
            <h3>Leave Balance</h3>
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="w-full sm:w-[48%] lg:w-[23%]">
                    <Card className="flex-1 rounded-sm">
                        <CardContent className="p-0">
                        <div className="px-2 flex flex-row items-center justify-between">
                            <p className="text-xl font-bold text-purple-600">PTO</p>
                            <TreePalm className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <hr className="my-2 border-slate-200 dark:border-slate-800" />
                        <div className="px-2">
                            <p className="text-xl font-bold text-muted-foreground">5/14 days used</p>
                        </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="w-full sm:w-[48%] lg:w-[23%]">
                    <Card className="flex-1 rounded-sm">
                        <CardContent className="p-0">
                        <div className="px-2 flex flex-row items-center justify-between">
                            <p className="text-xl font-bold text-purple-600">Sick Leave</p>
                            <Pill className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <hr className="my-2 border-slate-200 dark:border-slate-800" />
                        <div className="px-2">
                            <p className="text-xl font-bold text-muted-foreground">3/10 days used</p>
                        </div>
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
                            Leave Request History
                        </CardTitle>
                        <CardDescription>
                            View leave request history
                        </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                        {/* Clock In/Out Buttons */}
                        {/* <div className="flex gap-3"> */}
                            <LeaveHistoryTable history={ leaveHistory } />
                        {/* </div> */}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}