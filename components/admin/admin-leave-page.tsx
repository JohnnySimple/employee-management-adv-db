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
    primary: "#111827",
    secondary: "#374151",
    tertiary: "#6b7280",

    barPalette: [
        "#2563eb", // blue
        "#f97316", // orange
        "#10b981", // green
        "#ef4444", // red
        "#a855f7"  // purple
    ]
};

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

    const cutoffDate = new Date(today);
    cutoffDate.setDate(today.getDate() - 90);


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

      const approvedRecentCount = leaveData.filter(r => {
        const start = new Date(r.startDate);
        return (
            r.leaveDateStatus === "Approved" &&
            start >= cutoffDate &&
            start <= today
        );
    }).length;


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
      const monthlyTypeMap: Record<string, Record<string, number>> = {};

    leaveData.forEach(r => {
        const month = new Date(r.startDate).toLocaleString("default", {
            month: "short"
        });

        if (r.leaveDateStatus === "Approved") {
            if (!monthlyTypeMap[month]) monthlyTypeMap[month] = {};
            if (!monthlyTypeMap[month][r.leaveType]) {
                monthlyTypeMap[month][r.leaveType] = 0;
            }
            monthlyTypeMap[month][r.leaveType]++;
        }
    });

    let monthlyTypeData = Object.keys(monthlyTypeMap).map(month => ({
        name: month,
        ...monthlyTypeMap[month]
    }));

    if (monthSearch) {
        monthlyTypeData = monthlyTypeData.filter(m =>
            m.name.toLowerCase().includes(monthSearch.toLowerCase())
        );
    }

     const leaveTypes = Array.from(
        new Set(leaveData.map(r => r.leaveType))
    );
    // const monthlyMap: Record<string, number> = {};
    // leaveData.forEach((r) => {
    //     const month = new Date(r.startDate).toLocaleString("default", { month: "short" });
    //     monthlyMap[month] = (monthlyMap[month] || 0) + 1;
    // })

    // const monthlyData = Object.keys(monthlyMap).map(key => ({
    //     name: key,
    //     value: monthlyMap[key]
    // }));

    // Top Employees with most leaves
   const empMap: Record<string, number> = {};

    leaveData.forEach(r => {
        if (r.leaveDateStatus === "Approved") {
            empMap[r.employeeName] =
                (empMap[r.employeeName] || 0) + 1;
        }
    });

    let employeeChartData = Object.entries(empMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
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
                        <p className="text-sm text-muted-foreground">Planned leave in the next 30 days</p>
                    </CardContent>
                </Card>
                {/* Appproved Leaves Count */}
                <Card>
                    <CardHeader>
                        <CardTitle className="Tracking-widest font-bold">YTD (Last 90 days)</CardTitle>
                        
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <UserCheck className="w-6 h-6 text-blue-500" />
                            <span className="tracking-wide text-xl font-bold">{approvedRecentCount}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Recent leave activity</p>
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
                <Card className="border border-gray-300 rounded-md">
                    <CardHeader><CardTitle className="tracking-widest font-bold">Monthly Leave Distribution</CardTitle>
                        <p className="tracking-wide text-gray-500">Leave type breakdown per month data</p>
                        <div className="mt-2 flex items-center gap-2">
                            <Input placeholder="Filter by month" value={monthSearch} onChange={(e) => setMonthSearch(e.target.value)} className="input" />
                            {monthSearch && <Button size="sm" onClick={() => setMonthSearch("")}>Clear</Button>}
                        </div>
                    </CardHeader>
                    <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyTypeData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <ReTooltip />
                                <Legend />
                                {leaveTypes.map((type, idx) => (
                                    <Bar key={type} dataKey={type} stackId="a" fill={COLORS.barPalette[idx % COLORS.barPalette.length]} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Merged Top Employees & Duration */}
                    <Card>
                    <CardHeader>
                        <CardTitle className="font-bold tracking-widest">Top Employees (Approved Leaves)</CardTitle>
                        <p className="text-xs text-muted-foreground">
                            Employees with highest leave frequency
                        </p>
                        <div className="mt-2 flex w-full items-center gap-2">
                            <Input placeholder="Search Employee" value={employeeSearch} onChange={(e) => setEmployeeSearch(e.target.value)} className="input" />
                            {employeeSearch && <Button size="sm" onClick={() => setEmployeeSearch("")}>Clear</Button>}
                        </div>
                    </CardHeader>

                    <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={employeeChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <ReTooltip />

                                <Bar
                                    dataKey="count"
                                    fill={COLORS.barPalette[0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}