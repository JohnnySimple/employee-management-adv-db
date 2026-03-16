"use client";

import api from "@/lib/api";
import { Employee } from "@/types/employee";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const AdminEmployeeContext = createContext<any>(null);

export function AdminEmployeeProvider({ children }: { children: ReactNode }) {

    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [jobTitles, setJobTitles] = useState([]);
    const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
    const [isEditEmployeeModalOpen, setIsEditEmployeeModalOpen] = useState(false);
    const [isCreateUserAccountModalOpen, setIsCreateUserAccountModalOpen] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    function openAddEmployeeModal() {
        setIsAddEmployeeModalOpen(true);
    }

    function closeAddEmployeeModal() {
        setIsAddEmployeeModalOpen(false);
    }


    function openEditEmployeeModal(employee: Employee) {
        setSelectedEmployee(employee);
        setIsEditEmployeeModalOpen(true);
    }

    function closeEditEmployeeModal() {
        setIsEditEmployeeModalOpen(false);
        setSelectedEmployee(null);
    }

    function openCreateUserAccountModal(employee: Employee) {
        setSelectedEmployee(employee);
        setIsCreateUserAccountModalOpen(true);
    }

    function closeCreateUserAccountModal() {
        setIsCreateUserAccountModalOpen(false);
        setSelectedEmployee(null);
    }

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

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await api.get("/department");
                setDepartments(response.data.departments);
            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        }

        fetchDepartments();
    }, [])

    useEffect(() => {
        const fetchJobTitles = async () => {
            try {
                const response = await api.get("/jobTitle");
                setJobTitles(response.data.jobTitles);
            } catch (error) {
                console.error("Error fetching job titles:", error);
            }
        }

        fetchJobTitles();
    }, [])

    return (
        <AdminEmployeeContext.Provider value={{
            isAddEmployeeModalOpen, employees, openAddEmployeeModal, closeAddEmployeeModal, setEmployees,
            isEditEmployeeModalOpen, selectedEmployee, openEditEmployeeModal, closeEditEmployeeModal,
            isCreateUserAccountModalOpen, openCreateUserAccountModal, closeCreateUserAccountModal,
            departments, jobTitles
        }}>
            { children }
        </AdminEmployeeContext.Provider>
    )
}

export function useEmployee() {
    return useContext(AdminEmployeeContext);
}