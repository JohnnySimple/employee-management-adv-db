"use client";
import {
    XAxis,
    YAxis,
    Tooltip as ReTooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    Legend
} from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "../ui/input";
import { Toaster } from "@/components/ui/sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserCheck, Edit2, Loader, User, Calendar } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

import { getLeaveRecords } from "./attendancerecords/getLeaveRecords";
import { toast } from "sonner";
import api from "@/lib/api";

const MONTH_ORDER = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// Design an Interface which matches the attendance record structure\
interface LeaveRecord {
    leaveDate: number,
    employeeName: string,
    employeeId: string,
    leaveType: string,
    startDate: string,
    endDate: string,
    hoursOff: number,
    leaveDateStatus: string;
}

const COLORS = {
    pto: "#2563eb",
    sick: "#ef4444",
    remaining: "#e5e7eb"
};
const TOTAL_HOURS = 120;

export default function AdminLeavePage() {
    const [search, setSearch] = useState("");
    const [leaveData, setLeaveData] = useState<LeaveRecord[]>([]); //pass the attendance interface as a generic
    const [loading, setLoading] = useState(false);

    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const [monthSearch, setMonthSearch] = useState("");
    const [employeeSearch, setEmployeeSearch] = useState("");

    async function updateStatus(leaveDate: number, status: string) {
        try {
            setUpdatingId(leaveDate);

            // Send PATCH request with correct field names
            // const payload = {
            //     leaveDateId: Number(leaveDate), // backend still expects leaveDateId
            //     status,
            // };

            console.log("Sending PATCH request with payload:", {
                leaveDateId: Number(leaveDate),
                status
            });

            const res = await api.patch("/leave", {
                leaveDateId: Number(leaveDate),
                status
            });

            toast.success(`Request ${status}`);

            // Update frontend state to match interface
            setLeaveData((prev) =>
                prev.map((r) =>
                    r.leaveDate === leaveDate
                        ? { ...r, leaveDateStatus: status } // match interface property
                        : r
                )
            );

        } catch (error: any) {
            console.error("Axios error:", error);

            const message =
                error?.response?.data?.error ||
                error?.message ||
                "Failed to update status";

            toast.error(message);
        } finally {
            setUpdatingId(null);
        }
    }

    // Load attendance records on component mount
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const data = await getLeaveRecords();
                setLeaveData(data);
            } catch (error) {
                console.log("Error Fetching Attendance Records:", error);
                toast.error("Failed to load attendance records")
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // const approvedCount = leaveData.filter((r) => r.leaveDateStatus === "Approved").length;
    const today = new Date();

    const approvedCount = leaveData.filter((r) => r.leaveDateStatus === "Approved").length;
    const pendingCount = leaveData.filter((r) => r.leaveDateStatus === "Pending").length;
    // const rejectedCount = leaveData.filter((r) => r.leaveDateStatus === "Rejected").length;
    //Upcoming Leaves
    const upcomingLeaves = leaveData.filter(r =>
        r.leaveDateStatus === "Approved" &&
        new Date(r.startDate) >= today
    ).length;

    // Employees on Leave Today
    const onLeaveToday = leaveData.filter(
        (r) =>
            new Date(r.startDate) <= today &&
            new Date(r.endDate) >= today &&
            r.leaveDateStatus === "Approved"
    ).length;


    // Leave Type Map
    const typeMap: Record<string, number> = {};
    leaveData.forEach((r) => {
        typeMap[r.leaveType] = (typeMap[r.leaveType] || 0) + 1;
    });

    // find the most common leave type
    // const mostCommonLeaveType = Object.entries(typeMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    // const leaveTypeData = Object.entries(typeMap).map(([name, value]) => ({
    //     name,
    //     value
    // }));

    // Status Pie Chart Data
    // const statusData = [
    //     { name: "Approved", value: approvedCount },
    //     { name: "Pending", value: pendingCount },
    //     { name: "Rejected", value: rejectedCount }
    // ];

    // Monthly Leave Trends (Leaves per month)
    const monthlyTypeMap: Record<string, Record<string, any>> = {};

    leaveData.forEach(r => {
        if (r.leaveDateStatus !== "Approved") return;

        const month = new Date(r.startDate).toLocaleString("default", { month: "short" });

        if (!monthlyTypeMap[month]) {
            monthlyTypeMap[month] = { name: month, PTO: 0, Sick: 0 };
        }

        if (r.leaveType.toLowerCase().includes("sick")) {
            monthlyTypeMap[month].Sick += 1;
        } else {
            monthlyTypeMap[month].PTO += 1;
        }
    });

    let monthlyTypeData = MONTH_ORDER.filter((month) => monthlyTypeMap[month]).map((month) => monthlyTypeMap[month]);

    if (monthSearch) {
        monthlyTypeData = monthlyTypeData.filter(m =>
            m.name.toLowerCase().includes(monthSearch.toLowerCase())
        );
    }

    const leaveTypes = Array.from(
        new Set(leaveData.map(r => r.leaveType))
    );

    // Top Employees with most leaves
    const empHoursMap: Record<string, number> = {};

    leaveData.forEach(r => {
        if (r.leaveDateStatus === "Approved") {
            empHoursMap[r.employeeName] =
                (empHoursMap[r.employeeName] || 0) + r.hoursOff;
        }
    });

    let employeeChartData = Object.entries(empHoursMap)
        .map(([name, used]) => {
            const total = TOTAL_HOURS;
            const remaining = Math.max(total - used, 0);
            const utilization = (used / total) * 100;

            return {
                name,
                used,
                remaining,
                total,
                utilization: Number(utilization.toFixed(1))
            };
        })
        .sort((a, b) => b.used - a.used);

    if (employeeSearch) {
        employeeChartData = employeeChartData.filter(e =>
            e.name.toLowerCase().includes(employeeSearch.toLowerCase())
        );
    }

    const filteredData = leaveData.filter((row) =>
        row.employeeName.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center ">
                <Loader className="w-12 h-12 animate-spin text-gray-500">
                </Loader>
            </div>
        )
    }

    return (
        <div className="space-y-6 p-6">
            <Toaster />
            <h1 className="font-bold tracking-wide text-3xl">Leave Management</h1>
            {/* Metrics Cards */}
            <div className="grid grid-cols-4 md:grid-col-3 lg-grid-cols-4 gap-6 border border-gray-300 rounded-lg p-4">
                {/* Total Hours Card */}
                {/* <Card>
                    <CardHeader>
                        <CardTitle className="tracking-widest font-bold">Total Leave Hours</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Clock className="w-6 h-6 text-purple-400" />
                            <span className="text-2xl font-bold">{totalHoursOff} hrs</span>
                        </div>
                    </CardContent>
                </Card> */}
                {/* Pending Requests Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="Tracking-widest font-bold">Pending Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <UserCheck className="w-6 h-6 text-yellow-500" />
                            <span className="tracking-wide text-xl font-bold">{pendingCount}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Requests awaiting approval</p>
                    </CardContent>
                </Card>

                {/* <Card>
                    <CardHeader>
                        <CardTitle className="Tracking-widest font-bold">Rejected Leave Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-6 h-6 text-yellow-500" />
                            <span className="tracking-wide text-xl font-bold">{rejectedCount}</span>
                        </div>
                    </CardContent>
                </Card> */}
                {/* On Leave Today */}
                <Card>
                    <CardHeader>
                        <CardTitle className="Tracking-widest font-bold">On Leave</CardTitle>

                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <User className="w-6 h-6 text-green-500" />
                            <span className="tracking-wide text-xl font-bold">{onLeaveToday}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Employees on leave today</p>
                    </CardContent>
                </Card>
                {/* Upcoming Leaves */}
                <Card>
                    <CardHeader>
                        <CardTitle className="tracking-widest font-bold">Upcoming Leaves</CardTitle>

                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-blue-500" />
                            <span className="tracking-wide text-xl font-bold">{upcomingLeaves}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Scheduled Approved Leaves</p>
                    </CardContent>
                </Card>
                {/* Appproved Leaves Count */}
                <Card>
                    <CardHeader>
                        <CardTitle className="Tracking-widest font-bold">YTD Approved</CardTitle>

                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <UserCheck className="w-6 h-6 text-blue-500" />
                            <span className="tracking-wide text-xl font-bold">{approvedCount}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Total Approved Leaves</p>
                    </CardContent>
                </Card>
                {/* Average Hours Off
                <Card>
                    <CardHeader>
                        <CardTitle className="tracking-widest font-bold">Average Hours Off</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Clock className="w-6 h-6 text-blue-500" />
                            <span className="tracking-wide text-xl font-bold">{avgHoursOff}</span>
                        </div>
                    </CardContent>
                </Card> */}
                {/* Most Common Leave Type
                <Card>
                    <CardHeader>
                        <CardTitle className="tracking-widest font-bold">Most Common Leave Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-blue-500" />
                            <span className="tracking-wide text-xl font-bold">{mostCommonLeaveType}</span>
                        </div>
                    </CardContent>
                </Card> */}
            </div>
            {/* Search Filters */}
            <div className="w-full border border-gray-300 rounded-lg p-4 flex items-center gap-4">
                <Input type="text" placeholder="Search Employee" value={search} onChange={(e) => setSearch(e.target.value)} className="input" />
            </div>
            {/* Attendance Table */}
            <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="max-h-100 overflow-y-auto">
                    <TooltipProvider>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>LeaveType</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>EndDate</TableHead>
                                    <TableHead>Hours Off</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.map((row) => (
                                    <TableRow key={row.leaveDate}>
                                        <TableCell>{row.employeeName}</TableCell>
                                        <TableCell>{row.leaveType}</TableCell>
                                        <TableCell>{new Date(row.startDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{new Date(row.endDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{row.hoursOff}</TableCell>
                                        <TableCell>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <span className={row.leaveDateStatus === "Approved" ? "text-green-500 border rounded-xl px-2 py-1" : row.leaveDateStatus === "Pending" ? "text-yellow-500 border rounded-xl px-2 py-1" : row.leaveDateStatus === "Rejected" ? "text-red-500 border rounded-xl px-2 py-1" : ""}>
                                                        {row.leaveDateStatus}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{row.leaveType}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TableCell>

                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" size="sm">
                                                        <Edit2 className="w-4 h-4" />
                                                        Edit
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onClick={() => updateStatus(row.leaveDate, "Approved")}>{row.leaveDateStatus === "Approved" ? "" : "Approve Request"}</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => updateStatus(row.leaveDate, "Rejected")}>Reject Request</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TooltipProvider>
                </div>
            </div>
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Monthly Leave Type */}
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Leave Distribution</CardTitle>
                        <div className="w-full focus:h-1">
                            <Input placeholder="Filter By Month" value={monthSearch} onChange={(e) => setMonthSearch(e.target.value)} />
                            {monthSearch && <Button variant="ghost" size="icon" onClick={() => setMonthSearch("")} className="absolute right-2 top-1" />}
                        </div>
                    </CardHeader>

                    <CardContent className="h-80 overflow-x-auto">
                        <ResponsiveContainer>
                            <BarChart data={monthlyTypeData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name"
                                    angle={-25}
                                    textAnchor="end"
                                    interval={0} />
                                <YAxis />
                                <ReTooltip />
                                <Legend />

                                <Bar dataKey="PTO" stackId="a" fill={COLORS.pto} maxBarSize={20} />
                                <Bar dataKey="Sick" stackId="a" fill={COLORS.sick} maxBarSize={20} />

                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>


                {/* Employee Leave Utilization */}
                <Card>
                    <CardHeader>
                        <CardTitle>Employee Leave Utilization</CardTitle>
                        <p className="text-xs text-muted-foreground">
                            Used vs Remaining (120 hrs cap per employee)
                        </p>

                        <div className="w-full relative">
                            <Input
                                placeholder="Filter By Employee"
                                value={employeeSearch}
                                onChange={(e) => setEmployeeSearch(e.target.value)}
                            />
                            {employeeSearch && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setEmployeeSearch("")}
                                    className="absolute right-2 top-1"
                                />
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="h-[500px] overflow-y-auto">
                        <ResponsiveContainer width="100%" height={450}>
                            <BarChart
                                data={employeeChartData}
                                margin={{ top: 20, right: 20, left: 10, bottom: 80 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis
                                    dataKey="name"
                                    interval={0}
                                    angle={-35}
                                    textAnchor="end"
                                    height={80}
                                />

                                <YAxis />

                                <ReTooltip
                                    formatter={(value: number, name: string, props: any) => {
                                        const { used, remaining, total, utilization } = props.payload;

                                        if (name === "used") return [`${value} hrs used`, "Used Leave"];
                                        if (name === "remaining") return [`${value} hrs remaining`, "Remaining Leave"];

                                        return [value, name];
                                    }}
                                    labelFormatter={(label) => `Employee: ${label}`}
                                    content={({ active, payload, label }) => {
                                        if (!active || !payload?.length) return null;

                                        const data = payload[0].payload;

                                        return (
                                            <div className="bg-white border rounded-lg p-3 shadow-md text-sm">
                                                <p className="font-semibold mb-2">{data.name}</p>

                                                <p>Total Entitlement:{data.total} hrs</p>
                                                <p>Used:{data.used} hrs</p>
                                                <p>Remaining:{data.remaining} hrs</p>
                                                <p>Utilization:{data.utilization}%</p>
                                            </div>
                                        );
                                    }}
                                />

                                {/* USED */}
                                <Bar
                                    dataKey="used"
                                    stackId="a"
                                    fill={COLORS.pto}
                                    maxBarSize={16}
                                />

                                {/* REMAINING */}
                                <Bar
                                    dataKey="remaining"
                                    stackId="a"
                                    fill={COLORS.remaining}
                                    maxBarSize={16}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}