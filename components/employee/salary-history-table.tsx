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


export default function SalaryHistoryTable({ history }: { any }) {

    const fmt = (n: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

    return (
        <Card className="overflow-hidden p-6">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">
                                    No payroll history for you now.
                                </TableCell>
                            </TableRow>
                        )}
                        {history?.map((pay, index) => (
                            <TableRow key={index}
                                className={cn("transition-colors hover:bg-muted/50",
                                    index % 2 === 0 ? "bg-background" : "bg-muted/20"
                                )}>
                                <TableCell className="text-sm font-medium">{new Date(pay.salaryDate).toLocaleDateString(undefined,
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    }
                                )}</TableCell>
                                <TableCell className="">{ fmt(pay.amount) }</TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    <Button variant="outline" size="sm" className="">
                                        <Proportions />
                                        Get Invoice
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