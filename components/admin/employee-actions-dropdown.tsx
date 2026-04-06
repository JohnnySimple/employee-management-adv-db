"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useState } from "react";
import { useEmployee } from "../providers/admin-employee-provider";
import { Employee } from "@/types/employee";
import { toast } from "sonner";
import api from "@/lib/api";


export default function EmployeeActionsDropdown({ employee }: { employee: Employee }) {

    const { openEditEmployeeModal, openCreateUserAccountModal, openResetPasswordModal } = useEmployee();

    const toggleAccountStatus = async (employee: Employee) => {
        
        try {
            const response = await api.post("/protected/admin/toggle-account-status", employee);
            toast.success("Account status updated successfully!");
            
        } catch (error) {
            toast.error("Failed to update account status.");
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    <MoreHorizontal />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => openEditEmployeeModal(employee)}>
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openCreateUserAccountModal(employee)}>
                    Create Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openResetPasswordModal(employee)}>
                    Reset Password
                </DropdownMenuItem>

                {employee.user?.isActive ? (
                    <DropdownMenuItem onClick={() => toggleAccountStatus(employee)}>
                        Disable Account
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem onClick={() => toggleAccountStatus(employee)}>
                        Enable Account
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}