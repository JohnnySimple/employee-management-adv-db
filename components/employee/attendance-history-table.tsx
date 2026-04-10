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
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";


export default function AttendanceHistoryTable({ history }: { any }) {

    return (
        <Card className="overflow-hidden p-6">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>DATE</TableHead>
                            <TableHead>CLOCK IN</TableHead>
                            <TableHead>CLOCK OUT</TableHead>
                            <TableHead>OT HOURS</TableHead>
                            <TableHead>ACTION</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">
                                    No attendance history for you now.
                                </TableCell>
                            </TableRow>
                        )}
                        {history?.map((attendance, index) => (
                            <TableRow key={index}
                                className={cn("transition-colors hover:bg-muted/50",
                                    index % 2 === 0 ? "bg-background" : "bg-muted/20"
                                )}>
                                <TableCell className="text-sm font-medium">{new Date(attendance.workDate).toLocaleDateString(undefined,
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    }
                                )}</TableCell>
                                <TableCell className="text-sm font-medium">{new Date(attendance.timeIn).toLocaleTimeString(undefined,
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true
                                    }
                                )}</TableCell>
                                <TableCell className="text-sm font-medium">{new Date(attendance.timeOut).toLocaleTimeString(undefined,
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true
                                    }
                                )}</TableCell>
                                <TableCell className="text-sm font-medium">
                                    { attendance.overtimeHours ? attendance.overtimeHours : (
                                        <span>-</span>
                                    ) }
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    <Button variant="outline" size="sm" className="">
                                        <Pencil />
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    )
 }