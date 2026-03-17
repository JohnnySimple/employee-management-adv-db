"use client";

import { Button } from "@/components/ui/button";
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
 } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEmployee } from "../providers/admin-employee-provider";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/lib/api";
import { useEffect } from "react";


const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    password: z.string().min(8, {message: "Password must be at least 8 characters."}),
    role: z.enum(["ADMIN", "MANAGER", "EMPLOYEE"], { message: "Please select a role." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    employeeId: z.number()
    // isActive: z.boolean().default(true)
});

type FormData = z.infer<typeof formSchema>;

export default function CreateUserAccountModal() {

    const { isCreateUserAccountModalOpen, closeCreateUserAccountModal, selectedEmployee } = useEmployee();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema)
    });

    useEffect(() => {
        if (selectedEmployee) {
            reset({
                name: `${selectedEmployee.firstName.toLowerCase()}.${selectedEmployee.lastName.toLowerCase()}`,
                email: selectedEmployee.email,
                employeeId: selectedEmployee.employeeId
            })
        }
    }, [selectedEmployee, reset]);

    const createUserAccount = async (data: FormData) => {
        
        try {
            const response = await api.post("/users", data)
            closeCreateUserAccountModal();
            toast.success("Account added successfully!");
            
        } catch (error) {
            console.error("Error creating employee:", error);
            toast.error("Failed to add employee.");
        }
    }

    return (
        <Dialog open={isCreateUserAccountModalOpen} onOpenChange={closeCreateUserAccountModal}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create User Account</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Add details for user account
                </DialogDescription>

                <form onSubmit={handleSubmit(createUserAccount)}>
                    <CardContent className="space-y-4">
                        <div className="flex flex-row gap-4">
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Thomas"
                                    disabled
                                    {...register("name")}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{ errors.name.message }</p>
                                )}
                            </div>
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    {...register("password")}
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500">{ errors.password.message }</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-row gap-4 w-full">
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="role">Role</Label>
                                <Controller
                                    name="role"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={(value) => field.onChange(value)}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select role"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ADMIN">Admin</SelectItem>
                                                <SelectItem value="MANAGER">Manager</SelectItem>
                                                <SelectItem value="EMPLOYEE">Employee</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.role && (
                                    <p className="text-sm text-red-500">{ errors.role.message }</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="mt-8">
                        <Button type="submit" className="w-full">Create User</Button>
                    </CardFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}