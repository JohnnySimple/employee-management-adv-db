"use client";

import { useState, useEffect } from "react";
import EmployeeTable from "@/components/admin/employee-table";

import api from "@/lib/api";
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
import EditEmployeeModal from "@/components/admin/edit-employee-modal";
import { AdminEmployeeProvider } from "@/components/providers/admin-employee-provider";

const formSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required." }),
    lastName: z.string().min(1, { message: "Last name is required." }),
    dob: z.string().min(1, { message: "Date of birth is required." }),
    hireDate: z.string().min(1, { message: "Hire date is required." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    phone: z.string().min(1, { message: "Phone number is required." }),
    jobStatus: z.enum(["ACTIVE", "INACTIVE"], { message: "Please select a job status." }),
    deptId: z.number({ message: "Please select a department." }),
    jobTitleId: z.number({ message: "Please select a job title." })
});

type FormData = z.infer<typeof formSchema>;

export default function AdminEmployees() {

    const [employees, setEmployees] = useState([]);
    const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
    // const [isEditEmployeeModalOpen, setIsEditEmployeeModalOpen] = useState(false);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await api.get("/employee");
                setEmployees(response.data.employees);
            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        }

        fetchEmployees();
    }, [])

    const openAddEmployeeModal = () => {
        setIsAddEmployeeModalOpen(true);
    }

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema)
    });

    const createNewEmployee = async (data: FormData) => {
        
        try {
            const addResponse =await axios.post("/api/employee", data);
            setIsAddEmployeeModalOpen(false);
            
            if (addResponse.status === 201) {
                // Refresh employee list after adding new employee
                const response = await api.get("/employee");
                setEmployees(response.data.employees);
                reset();
                toast.success("Employee added successfully!");
            } else {
                toast.error("Failed to add employee.");
            }
            
        } catch (error) {
            console.error("Error creating employee:", error);
            toast.error("Failed to add employee.");
        }
    }

    return (
        <AdminEmployeeProvider>
        <div className="p-6">
            <Toaster />
            <h1 className="text-2xl font-semibold mb-6">
                Employees
            </h1>

            <div className="flex justify-end">
                <Button variant="outline" size="sm" className="mb-4" onClick={openAddEmployeeModal}>
                    Add Employee
                </Button>
            </div>
            <EmployeeTable employees={employees} />


            {/* Add Employee Modal */}
            <Dialog open={isAddEmployeeModalOpen} onOpenChange={setIsAddEmployeeModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Add Employee</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        Fill in the details for the new employee.
                    </DialogDescription>

                    <form onSubmit={handleSubmit(createNewEmployee)}>
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
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit employee modal */}
            <EditEmployeeModal />
        </div>
        </AdminEmployeeProvider>
    )
}