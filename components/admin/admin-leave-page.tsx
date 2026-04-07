"use client";
import {
    XAxis,
    YAxis,
    Tooltip as ReTooltip,
    ResponsiveContainer,
    PieChart,
    BarChart,
    Bar,
    Pie,
    Cell,
    AreaChart,
    Area,
    CartesianGrid
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
import { Clock, UserCheck, AlertCircle, Edit2, Loader, User, Calendar } from "lucide-react";
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
    approved: "#22c55e", // green
    pending: "#f59e0b",  // yellow
    rejected: "#ef4444", // red
    primary: "#6366f1",  // indigo
    secondary: "#3b82f6", // blue
    gradientStart: "#6366f1",
    gradientEnd: "#a5b4fc"

};


export default function AdminLeavePage() {
    const [search, setSearch] = useState("");
    const [leaveData, setLeaveData] = useState<LeaveRecord[]>([]); //pass the attendance interface as a generic
    const [loading, setLoading] = useState(false);

    const [updatingId, setUpdatingId] = useState<number | null>(null);

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
    const rejectedCount = leaveData.filter((r) => r.leaveDateStatus === "Rejected").length;
    //Upcoming Leaves
    const upcomingLeaves = leaveData.filter((r) => r.leaveDateStatus === "Approved" && new Date(r.startDate) > today).length;
    // Employees on Leave Today
    const onLeaveToday = leaveData.filter((r) => new Date(r.startDate) <= today && new Date(r.endDate) >= today).length;

    const totalHoursOff = leaveData.reduce((sum, r) => sum + (r.hoursOff || 0), 0);
    const avgHoursOff = leaveData.length ? (totalHoursOff / leaveData.length).toFixed(1) : 0;

    // Most common Leave Type
    const typeMap: Record<string, number> = {};
    leaveData.forEach((r) => {
        typeMap[r.leaveType] = (typeMap[r.leaveType] || 0) + 1;
    });

    // find the most common leave type
    const mostCommonLeaveType = Object.entries(typeMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    // Status Pie Chart Data
    const statusData = [
        { name: "Approved", value: approvedCount },
        { name: "Pending", value: pendingCount },
        { name: "Rejected", value: rejectedCount }
    ];

    // Monthly Leave Trends (Leaves per month)
    const monthlyMap: Record<string, number> = {};
    leaveData.forEach((r) => {
        const month = new Date(r.startDate).toLocaleString("default", { month: "short" });
        monthlyMap[month] = (monthlyMap[month] || 0) + 1;
    })

    const monthlyData = Object.keys(monthlyMap).map(key => ({
        name: key,
        value: monthlyMap[key]
    }));

    // Top Employees with most leaves
    const empMap: Record<string, number> = {};
    leaveData.forEach(r => {
        empMap[r.employeeName] = (empMap[r.employeeName] || 0) + r.hoursOff;
    });

    const topEmployees = Object.keys(empMap)
        .map(key => ({ name: key, value: empMap[key] }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

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
            <h1 className="font-bold tracking-wide text-2xl">Leave Management</h1>
            {/* Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-col-3 lg-grid-cols-4 gap-6">
                {/* Total Hours Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="tracking-widest font-bold">Total Leave Hours</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Clock className="w-6 h-6 text-purple-400" />
                            <span className="text-2xl font-bold">{totalHoursOff} hrs</span>
                        </div>
                    </CardContent>
                </Card>
                {/* Upcoming Leave / Scheduled LeavePresent Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="Tracking-widest font-bold">Pending Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <UserCheck className="w-6 h-6 text-yellow-500" />
                            <span className="tracking-wide text-xl font-bold">{pendingCount}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="Tracking-widest font-bold">Rejected Leave Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-6 h-6 text-yellow-500" />
                            <span className="tracking-wide text-xl font-bold">{rejectedCount}</span>
                        </div>
                    </CardContent>
                </Card>
                {/* Appproved Leaves Count */}
                <Card>
                    <CardHeader>
                        <CardTitle className="Tracking-widest font-bold">Approved Leaves</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <UserCheck className="w-6 h-6 text-blue-500" />
                            <span className="tracking-wide text-xl font-bold">{approvedCount}</span>
                        </div>
                    </CardContent>
                </Card>
                {/* On Leave Today */}
                <Card>
                    <CardHeader>
                        <CardTitle className="Tracking-widest font-bold">On Leave Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <User className="w-6 h-6 text-green-500" />
                            <span className="tracking-wide text-xl font-bold">{onLeaveToday}</span>
                        </div>
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
                    </CardContent>
                </Card>
                {/* Average Hours Off */}
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
                </Card>
                {/* Most Common Leave Type */}
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
                </Card>
            </div>
            {/* Search Filters */}
            <div className="w-full">
                <Input type="text" placeholder="Search Employee" value={search} onChange={(e) => setSearch(e.target.value)} className="input" />
            </div>
            {/* Attendance Table */}
            <div className="border rounded-lg overflow-hidden">
                <div className="max-h-[400px] overflow-y-auto">
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
            <div className="grid grid-cols-1 gap-4">
                <Card>
                    <CardHeader><CardTitle>Status Breakdown</CardTitle></CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={statusData} dataKey="value" outerRadius={120} innerRadius={60} paddingAngle={5} cornerRadius={8}>
                                    <Cell fill={COLORS.approved} />
                                    <Cell fill={COLORS.pending} />
                                    <Cell fill={COLORS.rejected} />
                                </Pie>
                                <ReTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* BAR */}
                <Card>
                    <CardHeader><CardTitle>Monthly Leaves</CardTitle></CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData} margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <ReTooltip />
                                <Bar dataKey="value" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* TOP EMPLOYEES */}
                <Card>
                    <CardHeader><CardTitle>Top Employees</CardTitle></CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topEmployees} layout="vertical" margin={{ left: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="name" />
                                <ReTooltip />
                                <Bar dataKey="value" fill={COLORS.secondary} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* AREA CHART */}
                <Card>
                    <CardHeader><CardTitle>Monthly Leave Trend</CardTitle></CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLORS.gradientStart} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={COLORS.gradientEnd} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <ReTooltip />
                                <Area type="monotone" dataKey="value" stroke={COLORS.primary} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}