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
import { Building2, Clock, DollarSign, FileText, LayoutDashboard, LogOut, Settings, Shield, Users, User } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export function AppSidebar() {

    const router = useRouter()

    const handleLogout = async () => {
        await axios.post("/api/auth/logout")
        router.push("/login")
    }

    return (
        <Sidebar>
            <SidebarHeader className="p-4 text-lg font-semibold">
                Admin
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Main</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/admin">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    Dashboard
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/admin/employees">
                                    <Users className="mr-2 h-4 w-4" />
                                    Employees
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                         <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/admin/projects">
                                    <Building2 className="mr-2 h-4 w-4" />
                                    Projects
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem> 
                    </SidebarMenu>



                    <SidebarMenu>
                        {/* <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/admin/roles">
                                    <Shield className="mr-2 h-4 w-4" />
                                    Roles & Permissions
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem> */}
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/admin/attendance">
                                    <Clock className="mr-2 h-4 w-4" />
                                    Attendance
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/admin/payroll">
                                    <DollarSign className="mr-2 h-4 w-4" />
                                    Payroll
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        {/* <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/admin/user-accounts">
                                    <User className="mr-2 h-4 w-4" />
                                    User Accounts
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem> */}
                    </SidebarMenu>
                </SidebarGroup>

                {/* <SidebarGroup>
                    <SidebarGroupLabel>Analytics</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/admin/reports">
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
                    {/* <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/admin/settings">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem> /*/}
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