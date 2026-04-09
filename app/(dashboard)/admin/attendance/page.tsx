import AdminLeavePage from "@/components/admin/admin-leave-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "EMS | Admin Leave Management",
    description: "Admin dashboard for managing employee leave requests."
}

export default function AdminPage(){
    return (
        <div>
        <AdminLeavePage />
        </div>
    )
}