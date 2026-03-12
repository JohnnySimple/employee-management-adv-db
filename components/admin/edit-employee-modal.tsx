"use client";

import { Button } from "@/components/ui/button";
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
 } from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as z from "zod";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useEmployee } from "../providers/admin-employee-provider";


export default function EditEmployeeModal() {

    const {isEditEmployeeModalOpen, closeEditEmployeeModal, selectedEmployee} = useEmployee();

    if (!selectedEmployee) return null;
    return (
        <Dialog open={isEditEmployeeModalOpen} onOpenChange={closeEditEmployeeModal}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Employee</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Updating employee {selectedEmployee.firstName} {selectedEmployee.lastName}
                </DialogDescription>

                {/* <form onSubmit={handleSubmit(createNewEmployee)}>
                    <CardContent className="space-y-4">
                        <div className="flex flex-row gap-4">
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    placeholder="Thomas"
                                    {...register("firstName")}
                                />
                                {errors.firstName && (
                                    <p className="text-sm text-red-500">{ errors.firstName.message }</p>
                                )}
                            </div>
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    placeholder="Gyeera"
                                    {...register("lastName")}
                                />
                                {errors.lastName && (
                                    <p className="text-sm text-red-500">{ errors.lastName.message }</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-row gap-4">
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Input
                                    id="dob"
                                    type="date"
                                    {...register("dob")}
                                />
                                {errors.dob && (
                                    <p className="text-sm text-red-500">{ errors.dob.message }</p>
                                )}
                            </div>
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="hireDate">Hire Date</Label>
                                <Input
                                    id="hireDate"
                                    type="date"
                                    {...register("hireDate")}
                                />
                                {errors.hireDate && (
                                    <p className="text-sm text-red-500">{ errors.hireDate.message }</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-row gap-4">
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{ errors.email.message }</p>
                                )}
                            </div>
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    type="text"
                                    placeholder="123-456-7890"
                                    {...register("phone")}
                                />
                                {errors.phone && (
                                    <p className="text-sm text-red-500">{ errors.phone.message }</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-row gap-4 w-full">
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="jobStatus">Job Status</Label>
                                <Controller
                                    name="jobStatus"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={(value) => field.onChange(value)}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select status"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ACTIVE">Active</SelectItem>
                                                <SelectItem value="INACTIVE">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.jobStatus && (
                                    <p className="text-sm text-red-500">{ errors.jobStatus.message }</p>
                                )}
                            </div>
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="deptId">Department</Label>
                                <Controller
                                    name="deptId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={(value) => field.onChange(parseInt(value))}
                                            value={field.value?.toString()}
                                        >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select department"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">HR</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    )}
                                />
                                {errors.deptId && (
                                    <p className="text-sm text-red-500">{ errors.deptId.message }</p>
                                )}
                            </div>
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="jobTitleId">Job Title</Label>
                                <Controller 
                                    name="jobTitleId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select 
                                            onValueChange={(value) => field.onChange(parseInt(value))}
                                            value={field.value?.toString()}
                                        >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select job title"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">HR Lead</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    )}
                                />
                                {errors.jobTitleId && (
                                    <p className="text-sm text-red-500">{ errors.jobTitleId.message }</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="mt-8">
                        <Button type="submit" className="w-full">Add Employee</Button>
                    </CardFooter>
                </form> */}
            </DialogContent>
        </Dialog>
    )
}