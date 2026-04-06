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

import {Employee} from "@/types/employee";
import { Card } from "../ui/card";
import EmployeeActionsDropdown from "./employee-actions-dropdown";


 export default function EmployeeTable({ employees }: { employees: Employee[] }) {

    return (
        <Card className="overflow-hidden p-6">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Job Title</TableHead>
                            <TableHead className="text-center">Job Status</TableHead>
                            <TableHead>Account Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employees.map((employee, index) => (
                            <TableRow key={employee.employeeId}
                                className={cn("transition-colors hover:bg-muted/50",
                                    index % 2 === 0 ? "bg-background" : "bg-muted/20"
                                )}>
                                <TableCell className="font-mono text-sm font-medium">{employee.employeeId}</TableCell>
                                <TableCell className="flex items-center gap-3 font-medium">{employee.firstName} {employee.lastName}</TableCell>
                                <TableCell className="text-sm text-muted-foreground hover:text-primary transition-colors">{employee.email}</TableCell>
                                <TableCell className="flex items-center">{employee.department.deptName}</TableCell>
                                <TableCell className="text-sm font-medium">{employee.jobTitle.titleName}</TableCell>
                                <TableCell className="text-center">
                                    {employee.jobStatus}
                                </TableCell>
                                <TableCell>
                                    { employee.user ? (
                                        employee.user.isActive ? (
                                            <span className="text-green-600 font-medium">Active</span>
                                        ) : (
                                            <span className="text-red-600 font-medium">Disabled</span>
                                        )
                                    ) : (
                                        <span className="text-gray-500 font-medium">No Account</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <EmployeeActionsDropdown employee={employee} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    )
 }