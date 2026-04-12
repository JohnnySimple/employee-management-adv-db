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
import { Proportions } from "lucide-react";




export default function SalaryHistoryTable({ history, attendance }: any) {
    const fmt = (n: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

    const sortedHistory = [...(history || [])].sort((a, b) => 
        new Date(b.salaryDate).getTime() - new Date(a.salaryDate).getTime()
    );

    return (
        <Card className="overflow-hidden p-6">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Hours</TableHead>
                            <TableHead>Overtime Hours</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedHistory.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">
                                    No payroll history for you now.
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedHistory.map((pay, index) => {
                                const currentPayDate = new Date(pay.salaryDate);
                                

                                const prevPayDate = sortedHistory[index + 1] 
                                    ? new Date(sortedHistory[index + 1].salaryDate) 
                                    : new Date(currentPayDate.getTime() - 30 * 24 * 60 * 60 * 1000);

                                const recordsForThisPeriod = attendance?.filter((a: any) => {
                                    const workDate = new Date(a.workDate);
                                    return workDate > prevPayDate && workDate <= currentPayDate;
                                }) || [];

                                const regularHours = recordsForThisPeriod.reduce((sum: number, a: any) => 
                                    sum + (Number(a.hoursWorked) || 0), 0);
                                const otHours = recordsForThisPeriod.reduce((sum: number, a: any) => 
                                    sum + (Number(a.overtimeHours) || 0), 0);

                                return (
                                    <TableRow key={index} className="transition-colors hover:bg-muted/50">
                                        <TableCell className="text-sm">
                                            {currentPayDate.toLocaleDateString(undefined, {
                                                year: "numeric", month: "long", day: "numeric"
                                            })}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {fmt(pay.amount)}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {regularHours.toFixed(1)} hrs
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {otHours > 0 ? `${otHours.toFixed(1)} hrs` : "-"}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}