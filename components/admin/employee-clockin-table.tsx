"use client";

import { 
    Table,
    TableCell,
    TableHead,
    TableHeader,
    TableBody,
    TableRow
 } from "@/components/ui/table";
 import { cn } from "@/lib/utils";

import { Card } from "../ui/card";
import { AdminStats, CheckedInEmployee } from "@/types/AdminStats";


export default function EmployeeClockInTable({ clockIns }: { clockIns: AdminStats["employeesClockedInToday"] }) {

    console.log(clockIns);

    return (
        <Card className="overflow-hidden p-6">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Time In</TableHead>
                            <TableHead>Time Out</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clockIns?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">
                                    No employees currently clocked in.
                                </TableCell>
                            </TableRow>
                        )}
                        {clockIns?.map((clockIn, index) => (
                            <TableRow key={index}
                                className={cn("transition-colors hover:bg-muted/50",
                                    index % 2 === 0 ? "bg-background" : "bg-muted/20"
                                )}>
                                <TableCell className="text-sm font-medium">{clockIn.employeeId}</TableCell>
                                <TableCell className="">{clockIn.firstName} {clockIn.lastName}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{clockIn.attendance.length > 0 ? new Date(clockIn.attendance[0]?.timeIn).toLocaleTimeString() : "N/A"}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {(() => {
                                        if (clockIn.attendance.length === 0) return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">Absent</span>;
                                        const timeOut = clockIn.attendance[0]?.timeOut;
                                        return timeOut ? <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">{new Date(timeOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span> : <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">Still Clocked In</span>;
                                    })()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    )
 }