"use client";

import Link from "next/link";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton
} from "@/components/ui/sidebar";
import { Building2, Clock, DollarSign, FileText, LayoutDashboard, LogOut, Settings, TreePalm, Shield, Users, User } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {getLinkClasses}  from "@/components/admin/getLinkClasses/getLinkClasses";

export function EmployeeSidebar() {

    const router = useRouter()

    const handleLogout = async () => {
        await axios.post("/api/auth/logout")
        router.push("/login")
    }

    return (
        <Sidebar>
        <SidebarHeader className="p-4 flex flex-row items-center gap-3">
            <img 
                src="/UI_Construction_Logo_No_Words.png" 
                alt="Logo" 
                className="h-18 w-18 object-contain" 
            />  
            <span className="text-xl font-semibold tracking-tight">
                Employee
            </span>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Main</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/employee" className={getLinkClasses("/employee")}>
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    Dashboard
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/employee/attendance" className={getLinkClasses("/employee/attendance")}>
                                    <Clock className="mr-2 h-4 w-4" />
                                    Attendance
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/employee/payroll" className={getLinkClasses("/employee/payroll")}>
                                    <DollarSign className="mr-2 h-4 w-4" />
                                    Payroll
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/employee/leave" className={getLinkClasses("/employee/leave")}>
                                    <TreePalm className="mr-2 h-4 w-4" />
                                    Leave
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                {/* <SidebarGroup>
                    <SidebarGroupLabel>Analytics</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/employee/reports">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Reports
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup> */}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    {/*<SidebarMenuItem>
                         <SidebarMenuButton asChild>
                            <Link href="/employee/settings">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem> */}
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <button onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </button>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}