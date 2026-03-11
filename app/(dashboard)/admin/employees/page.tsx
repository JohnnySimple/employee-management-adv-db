"use client";

import { useState, useEffect } from "react";
import EmployeeTable from "@/components/admin/employee-table";

import api from "@/lib/api";

export default function AdminEmployees() {

    const [employees, setEmployees] = useState([]);

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
    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">
                Employees
            </h1>


            <EmployeeTable employees={employees} />
        </div>
    )
}