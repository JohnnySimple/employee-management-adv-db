"use client";

import EmployeeTable from "@/components/admin/employee-table";

import { Button } from "@/components/ui/button";

import { Toaster } from "@/components/ui/sonner";
import EditEmployeeModal from "@/components/admin/edit-employee-modal";
import { useEmployee } from "@/components/providers/admin-employee-provider";
import AddEmployeeModal from "@/components/admin/add-employee-modal";
import CreateUserAccountModal from "@/components/admin/create-user-account-modal";
import ResetPasswordModal from "@/components/admin/reset-password-modal";

export default function AdminEmployees() {

    const { employees, openAddEmployeeModal } = useEmployee();

    return (
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
            <AddEmployeeModal />

            {/* Edit employee modal */}
            <EditEmployeeModal />

            {/* Create user account modal */}
            <CreateUserAccountModal />

            {/* Reset password modal */}
            <ResetPasswordModal />
        </div>
    )
}