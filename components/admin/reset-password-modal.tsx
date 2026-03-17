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
    employeeId: z.number(),
    newPassword: z.string().min(8, {message: "Password must be at least 8 characters."})
});

type FormData = z.infer<typeof formSchema>;

export default function ResetPasswordModal() {

    const { isResetPasswordModalOpen, closeResetPasswordModal, selectedEmployee } = useEmployee();

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
                employeeId: selectedEmployee.employeeId
            })
        }
    }, [selectedEmployee, reset]);

    const resetPassword = async (data: FormData) => {
        
        try {
            const response = await api.post("/protected/admin/reset-password", data);
            closeResetPasswordModal();
            toast.success("Password reset successfully!");
            
        } catch (error) {
            toast.error("Failed to reset password employee.");
        }
    }

    return (
        <Dialog open={isResetPasswordModalOpen} onOpenChange={closeResetPasswordModal}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create User Account</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Add details for user account
                </DialogDescription>

                <form onSubmit={handleSubmit(resetPassword)}>
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
                                <Label htmlFor="newPassword">Password</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    {...register("newPassword")}
                                />
                                {errors.newPassword && (
                                    <p className="text-sm text-red-500">{ errors.newPassword.message }</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="mt-8">
                        <Button type="submit" className="w-full">Reset Password</Button>
                    </CardFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}