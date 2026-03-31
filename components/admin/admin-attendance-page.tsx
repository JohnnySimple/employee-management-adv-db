"use client";
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
import {useState} from "react";

export default function adminAttendancePage(){
    const[search,setSearch]=useState("");

    const attendanceData = [
        { id: 1, employee: "John Doe", date: "March 24, 2026", checkIn: "10:48 AM", checkOut: "06:48 PM", ot: 2, status: "Present" },
        { id: 2, employee: "Jane Smith", date: "March 24, 2026", checkIn: "11:05 AM", checkOut: "05:27 PM", ot: 0, status: "Late" },
    ];

    const filteredData = attendanceData.filter((row) =>(
        row.employee.toLowerCase().includes(search.toLowerCase())
    ))

    return (
        <div className="space-y-6 p-6">
            <Toaster />
            <h1 className="font-bold tracking-wide text-2xl">Attendance</h1>
            {/* Metrics Cards */}
            <div className="grid grid-cols-3 border rounded-md border-gray-700 md:grid-col-4 lg-grid-cols-6 gap-4">
                {/* Total Hours Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="tracking-widest font-bold">Total Hours</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Clock className="w-6 h-6 text-purple-400" />
                                <span className="text-2xl font-bold">120hrs</span>
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
                            <Play className="w-6 h-6 text-blue-500"/>
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
                            <Clock className="w-6 h-6 text-green-500"/>
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
                            <UserCheck className="w-6 h-6 text-yellow-500"/>
                            <span className="tracking-wide text-xl font-bold">12</span>
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
                            <ClockAlert className="w-6 h-6 text-red-500"/>
                            <span className="tracking-wide text-xl font-bold">5</span>
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
                            <AlertCircle className="w-6 h-6 text-orange-500"/>
                            <span className="tracking-wide text-xl font-bold">4</span>
                        </div>
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
                        {filteredData.map((row)=>(
                            <TableRow key={row.id}>
                                <TableCell>{row.employee}</TableCell>
                                <TableCell>{row.date}</TableCell>
                                <TableCell>{row.checkIn}</TableCell>
                                <TableCell>{row.checkOut}</TableCell>
                                <TableCell>{row.ot}</TableCell>
                                <TableCell>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <span className={row.status=== "Late" ? "text-red-500 border rounded-xl" : "text-green-500"}>
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
                                                <Edit2 className="w-4 h-4"/>
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