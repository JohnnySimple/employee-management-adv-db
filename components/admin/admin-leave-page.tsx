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
    const upcomingApprovals = leaveData.filter((r) => r.leaveDateStatus === "Approved" && new Date(r.startDate) > today).length;
    const pendingCount = leaveData.filter((r) => r.leaveDateStatus === "Pending").length;

    const totalHoursOff = leaveData.reduce(
        (sum, r) => sum + (r.hoursOff || 0),
        0
    );

    // Chart Data 1. Leave type distribution
    const leaveTypeMap: Record<string, number> = {};
    leaveData.forEach((r) => {
        leaveTypeMap[r.leaveType] = (leaveTypeMap[r.leaveType] || 0) + 1;
    });

    const leaveTypeData = Object.keys(leaveTypeMap).map((key) => ({
        name: key,
        value: leaveTypeMap[key],
    }));

    // Leaves per employee
    const employeeLeaveMap: Record<string, number> = {};
    leaveData.forEach((r) => {
        employeeLeaveMap[r.employeeName] = (employeeLeaveMap[r.employeeName] || 0) + 1;
    });

    const employeeLeaveData = Object.keys(employeeLeaveMap).map((key) => ({
        name: key,
        value: employeeLeaveMap[key],
    }))




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
            <div className="grid grid-cols-1 md:grid-col-3 lg-grid-cols-4 gap-6">
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
                        <CardTitle className="Tracking-widest font-bold">Upcoming Leave | Scheduled Leave</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <UserCheck className="w-6 h-6 text-yellow-500" />
                            <span className="tracking-wide text-xl font-bold">{upcomingApprovals}</span>
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
                {/* Search Filters */}

                {/* Attendance Table */}
                <div className="flex gap-4">
                    <Input type="text" placeholder="Search Employee" value={search} onChange={(e) => setSearch(e.target.value)} className="input" />
                </div>
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
                {/* Charts */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Leave Type Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-bold tracking-widest">Leave Type Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="h-75">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={leaveTypeData}
                                        dataKey="value"
                                        nameKey="name"
                                        outerRadius={100}
                                    >
                                        {leaveTypeData.map((_, i) => (
                                            <Cell
                                                key={i}
                                                fill={
                                                    i % 3 === 0
                                                        ? COLORS.approved
                                                        : i % 3 === 1
                                                            ? COLORS.pending
                                                            : COLORS.rejected
                                                }
                                            />
                                        ))}
                                    </Pie>
                                    <ReTooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Leaves per Employee */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-bold tracking-widest">Leaves Per Employee</CardTitle>
                        </CardHeader>
                        <CardContent className="h-75">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={employeeLeaveData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <ReTooltip />
                                    <Bar dataKey="value" fill={COLORS.primary} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}