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
import { Clock, Play, UserCheck, AlertCircle, Edit2, ClockAlert } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export default function adminAttendancePage() {
    const [search, setSearch] = useState("");

    const attendanceData = [
        { id: 1, employee: "John Doe", date: "March 24, 2026", checkIn: "10:48 AM", checkOut: "06:48 PM", ot: 2, status: "Present" },
        { id: 2, employee: "Jane Smith", date: "March 24, 2026", checkIn: "11:05 AM", checkOut: "05:27 PM", ot: 0, status: "Late" },
    ];

    const presentCount = attendanceData.filter(
        (r) => r.status === "Present"
    ).length;

    const lateCount = attendanceData.filter(
        (r) => r.status === "Late"
    ).length;

    const totalOT = attendanceData.reduce((sum, r) => sum + r.ot, 0);


    const statusData = [
        { name: "Present", value: presentCount },
        { name: "Late", value: lateCount },
    ];

    const hoursData = attendanceData.map((row, index) => ({
        day: `Day ${index + 1}`,
        hours: 8 + row.ot,
    }));

    const otData = [
        { name: "OT Hours", value: totalOT },
        { name: "Regular Hours", value: attendanceData.length * 8 },
    ];

    const filteredData = attendanceData.filter((row) =>
        row.employee.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 p-6">
            <Toaster />
            <h1 className="font-bold tracking-wide text-2xl">Attendance</h1>
            {/* Metrics Cards */}
            <div className="grid grid-cols-3 md:grid-col-4 lg-grid-cols-6 gap-4">
                {/* Total Hours Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="tracking-widest font-bold">Total Hours</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Clock className="w-6 h-6 text-purple-400" />
                            <span className="text-2xl font-bold">{attendanceData.length * 8 + totalOT} hrs</span>
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
                        <CardTitle className="Tracking-widest font-bold">Employees Present</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <UserCheck className="w-6 h-6 text-yellow-500" />
                            <span className="tracking-wide text-xl font-bold">{presentCount}</span>
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
                {/* Late employees Arrival Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="Tracking-widest font-bold">Late Employees</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-6 h-6 text-orange-500" />
                            <span className="tracking-wide text-xl font-bold">{lateCount}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {/* Line chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="tracking-widest font-bold">Hours Trend</CardTitle>
                        </CardHeader>
                        <CardContent className="h-100">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={hoursData}>
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <ReTooltip />
                                    <Line type="monotone" dataKey="hours" strokeWidth={2} />
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
                                    <Pie data={statusData} dataKey="value" nameKey="name" label>
                                        {statusData.map((_, i) => (
                                            <Cell key={i} />
                                        ))}
                                    </Pie>
                                    <ReTooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Bar Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>OT vs Regular Hours</CardTitle>
                    </CardHeader>
                    <CardContent className="h-100">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={otData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <ReTooltip />
                                <Bar dataKey="value" />
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
                            <TableHead>Date</TableHead>
                            <TableHead>Check In</TableHead>
                            <TableHead>Check Out</TableHead>
                            <TableHead>OT Hours</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.employee}</TableCell>
                                <TableCell>{row.date}</TableCell>
                                <TableCell>{row.checkIn}</TableCell>
                                <TableCell>{row.checkOut}</TableCell>
                                <TableCell>{row.ot}</TableCell>
                                <TableCell>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <span className={row.status === "Late" ? "text-red-500 border rounded-xl" : "text-green-500"}>
                                                {row.status}
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{row.status === "Late" ? "Employee Checked-in late" : "Employee On time"}</p>
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
                                            <DropdownMenuItem>Edit Attendance</DropdownMenuItem>
                                            <DropdownMenuItem>Mark OT</DropdownMenuItem>
                                            <DropdownMenuItem>Change Status</DropdownMenuItem>
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