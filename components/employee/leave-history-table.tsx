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


export default function LeaveHistoryTable({ history }: { any }) {

    return (
        <Card className="overflow-hidden p-6">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>LEAVE TYPE</TableHead>
                            <TableHead>START DATE</TableHead>
                            <TableHead>END DATE</TableHead>
                            <TableHead>STATUS</TableHead>
                            <TableHead>ACTION</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">
                                    No leave history for you now.
                                </TableCell>
                            </TableRow>
                        )}
                        {history?.map((leave, index) => (
                            <TableRow key={index}
                                className={cn("transition-colors hover:bg-muted/50",
                                    index % 2 === 0 ? "bg-background" : "bg-muted/20"
                                )}>
                                <TableCell className="text-sm font-medium">{ leave.leaveType }</TableCell>
                                <TableCell className="text-sm font-medium">{new Date(leave.startDate).toLocaleDateString(undefined,
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    }
                                )}</TableCell>
                                <TableCell className="text-sm font-medium">{new Date(leave.endDate).toLocaleDateString(undefined,
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    }
                                )}</TableCell>
                                <TableCell>
                                    { leave.dateStatus === "Approved" ? (
                                        <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-700">
                                            { leave.dateStatus }
                                        </span>
                                    ) : (
                                        <span className="text-xs px-2 py-1 rounded-full font-medium bg-orange-100 text-orange-700">
                                            { leave.dateStatus }
                                        </span>
                                    ) }
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    Action
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    )
 }