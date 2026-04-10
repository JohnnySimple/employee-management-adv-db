"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartBar } from "lucide-react";
import api from "@/lib/api";
import SalaryHistoryTable from "@/components/employee/salary-history-table";

export default function EmployeePayroll() {

    const [salaries, setSalaries] = useState(null);
    const [attendance, setAttendance] = useState(null);
    const [me, setMe] = useState(null);

    useEffect(() => {
        const fetchSalaries = async () => {
            try {
                const response = await api.get("/salaryemp");
                setSalaries(response.data.salaryRecords);
            } catch (error) {
                console.error("Error fetching user salaries:", error);
            }
        };

        fetchSalaries();
    }, [])

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

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const response = await api.get("/me");
                setMe(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchMe();
    }, [])


    const fmt = (n: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

    // get last salary payment date
    const lastPaidDate = salaries && salaries.length > 0 ? new Date(salaries[0].salaryDate) : null;

    // get hours worked since last salary payment date
    // const outstandingHours = attendance?.reduce((sum, a) => sum + (a.hoursWorked || 0) + (a.overtimeHours || 0), 0);
    const outstandingHours = attendance?.reduce((sum, a) => {
        const attendanceDate = new Date(a.workDate);
        if (!lastPaidDate || attendanceDate > lastPaidDate) {
            return sum + (a.hoursWorked || 0) + (a.overtimeHours || 0);
        }
        return sum;
    }, 0) || 0;
    
    // const dummyHourlyRate = 40;
    // const hourlyRate = salaries && salaries.length > 0 ? salaries[0].amount / 2080 : dummyHourlyRate;
    const hourlyRate = me?.employee?.jobTitle.payRate || 40;

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col lg:flex-row gap-6 w-full">
                {/* Time Logging Card */}
                <div className="flex-1">
                <Card className="h-full border-0 shadow-sm">
                    <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                        {/* <Clock className="h-5 w-5 text-primary" /> */}
                        Payroll History
                    </CardTitle>
                    <CardDescription>
                        View salary history
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                    {/* Clock In/Out Buttons */}
                    {/* <div className="flex gap-3"> */}
                        <SalaryHistoryTable history={salaries} />
                    {/* </div> */}
                    </CardContent>
                </Card>
                </div>

                {/* Active Projects Card */}
                <div className="lg:w-80 xl:w-96">
                    <Card className="flex-1">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex">
                                <ChartBar className="w-4 h-4 mr-2 text-muted-foreground"/>
                                <CardTitle className="text-sm font-medium">
                                    Previous payroll
                                </CardTitle>
                            </div>
                            <p>{ salaries && salaries.length > 0 ? new Date(salaries[0].salaryDate).toLocaleDateString(undefined,
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                }
                            ) : "n/a" }</p>
                        </CardHeader>
                        <CardContent>
                        <div className="flex justify-between">
                            <div>
                                <div className="text-2xl font-bold">{ salaries && salaries.length > 0 ? fmt(salaries[0].amount) : "N/A" }</div>
                            </div>
                            <p>
                                <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-700">
                                    PAID
                                </span>
                            </p>
                        </div>
                        </CardContent>
                    </Card>

                    <Card className="flex-1 mt-6">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex">
                                <ChartBar className="w-4 h-4 mr-2 text-muted-foreground"/>
                                <CardTitle className="text-sm font-medium">
                                    Upcoming payroll
                                </CardTitle>
                            </div>
                            <p>{ new Date(new Date().getFullYear(), new Date().getMonth() , 23).toLocaleDateString(undefined,
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                }
                            )}</p>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between">
                                <div>
                                    <div className="text-2xl font-bold">{ fmt(outstandingHours * hourlyRate) }</div>
                                </div>
                                <p>
                                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-orange-100 text-orange-700">
                                        PENDING
                                    </span>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}