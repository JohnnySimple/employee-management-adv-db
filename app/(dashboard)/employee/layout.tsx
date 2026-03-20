import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { EmployeeSidebar } from "@/components/employee-sidebar";


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <EmployeeSidebar />
            <main className="flex-1 p-6">
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    )
}