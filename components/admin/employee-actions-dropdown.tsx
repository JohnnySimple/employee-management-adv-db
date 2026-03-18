"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useState } from "react";
import { useEmployee } from "../providers/admin-employee-provider";
import { Employee } from "@/types/employee";

export default function EmployeeActionsDropdown({ employee }: { employee: Employee }) {

    const { openEditEmployeeModal, openCreateUserAccountModal, openResetPasswordModal } = useEmployee();

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
                <DropdownMenuItem>
                    Disable Account
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}