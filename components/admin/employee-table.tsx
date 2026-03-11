"use client";

import { 
    Table,
    TableCell,
    TableHead,
    TableHeader,
    TableBody,
    TableRow
 } from "@/components/ui/table";

 import {Employee} from "@/types/employee";


 export default function EmployeeTable({ employees }: { employees: Employee[] }) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Job Title</TableHead>
                        <TableHead>Job Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {employees.map((employee) => (
                        <TableRow key={employee.employeeId}>
                            <TableCell>{employee.employeeId}</TableCell>
                            <TableCell>{employee.firstName} {employee.lastName}</TableCell>
                            <TableCell>{employee.email}</TableCell>
                            <TableCell>{employee.department.deptName}</TableCell>
                            <TableCell>{employee.jobTitle.titleName}</TableCell>
                            <TableCell>{employee.jobStatus}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
 }