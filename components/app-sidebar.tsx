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
import { Building2, Clock, DollarSign, FileText, LayoutDashboard, LogOut, Settings, Shield, Users, User, Calendar } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {getLinkClasses}  from "@/components/admin/getLinkClasses/getLinkClasses";
import Logo from "employee-management-adv-db/public/UI_Construction_Logo_No_Words.png";

export function AppSidebar() {

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
                Admin

            </span>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Main</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/admin" className={getLinkClasses("/admin")}>
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    Dashboard
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/admin/employees" className={getLinkClasses("/admin/employees")}>
                                    <Users className="mr-2 h-4 w-4" />
                                    Employees
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                         <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/admin/projects" className={getLinkClasses("/admin/projects")}>
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
                                <Link href="/admin/attendance" className={getLinkClasses("/admin/attendance")}  >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Leave 
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/admin/payroll" className={getLinkClasses("/admin/payroll")}>
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