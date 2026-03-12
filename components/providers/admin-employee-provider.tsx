"use client";

import { Employee } from "@/types/employee";
import { createContext, useContext, useState, ReactNode } from "react";

const AdminEmployeeContext = createContext<any>(null);

export function AdminEmployeeProvider({ children }: { children: ReactNode }) {
    const [isEditEmployeeModalOpen, setIsEditEmployeeModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    function openEditEmployeeModal(employee: Employee) {
        setSelectedEmployee(employee);
        setIsEditEmployeeModalOpen(true);
    }

    function closeEditEmployeeModal() {
        setIsEditEmployeeModalOpen(false);
        setSelectedEmployee(null);
    }

    return (
        <AdminEmployeeContext.Provider value={{isEditEmployeeModalOpen, selectedEmployee, openEditEmployeeModal, closeEditEmployeeModal}}>
            { children }
        </AdminEmployeeContext.Provider>
    )
}

export function useEmployee() {
    return useContext(AdminEmployeeContext);
}