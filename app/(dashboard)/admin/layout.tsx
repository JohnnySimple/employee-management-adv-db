import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AdminEmployeeProvider } from "@/components/providers/admin-employee-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <AdminEmployeeProvider>
            <SidebarProvider>
                <AppSidebar />
                <main className="flex-1 p-6">
                    <SidebarTrigger />
                    {children}
                </main>
            </SidebarProvider>
        </AdminEmployeeProvider>
    )
}