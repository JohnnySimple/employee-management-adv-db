"use client";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip as ReTooltip,
    ResponsiveContainer,
    PieChart,
    BarChart,
    Bar,
    Pie,
    Cell
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
import { Clock, Play, UserCheck, AlertCircle, Edit2, ClockAlert, Loader } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

import { getAttendanceRecords } from "./attendancerecords/getAttendanceRecords";
import { toast } from "sonner";
import api from "@/lib/api";

// Design an Interface which matches the attendance record structure\
interface AttendanceRecord {
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
    muted: "#94a3b8"     // slate
};


export default function AdminAttendancePage() {
    const [search, setSearch] = useState("");
    const [leaveData, setLeaveData] = useState<AttendanceRecord[]>([]); //pass the attendance interface as a generic
    const [loading, setLoading] = useState(false);

    const [updatingId, setUpdatingId] = useState<number | null>(null);

async function updateStatus(leaveDate: number, status: string) {
    try {
        setUpdatingId(leaveDate);

        // Send PATCH request with correct field names
        const payload = {
            leaveDateId: Number(leaveDate), // backend still expects leaveDateId
            status,
        };

        console.log("Sending PATCH request with payload:", payload);

        const res = await api.patch("/leave", payload);

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
                const data = await getAttendanceRecords();
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

    const approvedCount = leaveData.filter((r) => r.leaveDateStatus === "Approved").length;
    const pendingCount = leaveData.filter((r) => r.leaveDateStatus === "Pending").length;
    const rejectedCount = leaveData.filter((r) => r.leaveDateStatus === "Rejected").length;

    const totalHoursOff = leaveData.reduce(
        (sum, r) => sum + (r.hoursOff || 0),
        0
    );


    const statusData = [
        { name: "Approved", value: approvedCount },
        { name: "Pending", value: pendingCount },
        { name: "Rejected", value: rejectedCount },
    ];

    const hoursData = leaveData.map((row, index) => ({
        day: `Leave ${index + 1}`,
        hours: row.hoursOff || 0,
    }));

    const otData = [
        { name: "Hours Off", value: totalHoursOff },
        { name: "Working Hours (Est)", value: leaveData.length * 8 },
    ];


    const filteredData = leaveData.filter((row) =>
        (row.employeeName ?? "").toLowerCase().includes(search.toLowerCase())
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
            <h1 className="font-bold tracking-wide text-2xl">Attendance</h1>
            {/* Metrics Cards */}
            <div className="grid grid-cols-3 md:grid-col-4 lg-grid-cols-6 gap-6">
                {/* Total Hours Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="tracking-widest font-bold">Total Hours</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Clock className="w-6 h-6 text-purple-400" />
                            <span className="text-2xl font-bold">{totalHoursOff} hrs</span>
                        </div>
                    </CardContent>
                </Card>
                {/* Avg Check-In Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="Tracking-widest font-bold">Avg Check-In</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Play className="w-6 h-6 text-blue-500" />
                            <span className="tracking-wide text-xl font-bold">9:12am</span>
                        </div>
                    </CardContent>
                </Card>
                {/* Avg Check-out Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="Tracking-widest font-bold">Avg Check-out</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Clock className="w-6 h-6 text-green-500" />
                            <span className="tracking-wide text-xl font-bold">5:45pm</span>
                        </div>
                    </CardContent>
                </Card>
                {/* Employees Present Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="Tracking-widest font-bold">Approved Count</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <UserCheck className="w-6 h-6 text-yellow-500" />
                            <span className="tracking-wide text-xl font-bold">{approvedCount}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="Tracking-widest font-bold">Pending Leave Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-6 h-6 text-yellow-500" />
                            <span className="tracking-wide text-xl font-bold">{pendingCount}</span>
                        </div>
                    </CardContent>
                </Card>
                {/* Employees OverTime Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="Tracking-widest font-bold">Employees OT</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <ClockAlert className="w-6 h-6 text-red-500" />
                            <span className="tracking-wide text-xl font-bold">{otData.length}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Charts */}
                {/* Line chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="tracking-widest font-bold">Hours Trend</CardTitle>
                    </CardHeader>
                    <CardContent className="h-100">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={hoursData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                                <XAxis
                                    dataKey="day"
                                    tick={{ fontSize: 12 }}
                                    stroke="#94a3b8"
                                />
                                <YAxis
                                    tick={{ fontSize: 12 }}
                                    stroke="#94a3b8"
                                />

                                <ReTooltip
                                    contentStyle={{
                                        borderRadius: "10px",
                                        border: "none",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                                    }}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="hours"
                                    stroke={COLORS.primary}
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                {/* Pie Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="tracking-widest font-bold">Attendance Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-100">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={statusData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={3}>
                                    {statusData.map((entry, index) => {
                                        const color =
                                            entry.name === "Approved"
                                                ? COLORS.approved
                                                : entry.name === "Pending"
                                                    ? COLORS.pending
                                                    : COLORS.rejected;
                                        return <Cell key={`cell-${index}`} fill={color} />;
                                    })}
                                </Pie>
                                <ReTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Bar Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>OT vs Regular Hours</CardTitle>
                    </CardHeader>
                    <CardContent className="h-100">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={otData} margin={{ top: 10, right: 20, left: -10 }}>
                                <XAxis stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />

                                <ReTooltip
                                    contentStyle={{
                                        borderRadius: "10px",
                                        border: "none",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                                    }}
                                />

                                <Bar
                                    dataKey="value"
                                    radius={[8, 8, 0, 0]}
                                    fill={COLORS.primary}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
            {/* Filters */}
            <div className="flex gap-4">
                <Input type="text" placeholder="Search Employee" value={search} onChange={(e) => setSearch(e.target.value)} className="input" />
            </div>

            {/* Attendance Table */}
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
                                            <DropdownMenuItem onClick={()=>updateStatus(row.leaveDate,"Approved")}>{row.leaveDateStatus === "Approved" ? "" : "Approve Request"}</DropdownMenuItem>
                                            <DropdownMenuItem onClick={()=>updateStatus(row.leaveDate,"Rejected")}>Reject Request</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TooltipProvider>
        </div>
    )
}