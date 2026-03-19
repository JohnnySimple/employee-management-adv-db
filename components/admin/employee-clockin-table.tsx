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


export default function EmployeeClockInTable({ clockIns }: { clockIns: CheckedInEmployee[] }) {

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
                        {clockIns?.map((clockIn, index) => (
                            <TableRow key={index}
                                className={cn("transition-colors hover:bg-muted/50",
                                    index % 2 === 0 ? "bg-background" : "bg-muted/20"
                                )}>
                                <TableCell className="text-sm font-medium">{clockIn.employeeId}</TableCell>
                                <TableCell className="">{clockIn.firstName} {clockIn.lastName}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{new Date(clockIn.timeIn).toLocaleTimeString()}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{clockIn.timeOut ? new Date(clockIn.timeOut).toLocaleTimeString() : "Still Clocked In"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    )
 }