"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartBar, Pill } from "lucide-react";
import api from "@/lib/api";
import { TreePalm } from "lucide-react";
import LeaveHistoryTable from "@/components/employee/leave-history-table";
import { Button } from "@/components/ui/button";
import ApplyForLeaveModal from "@/components/employee/apply-for-leave-modal";
import { Toaster } from "sonner";

export default function EmployeeLeave() {

    const [user, setUser] = useState(null);
    const [leaveHistory, setLeaveHistory] = useState(null);
    const [employeeLeave, setEmployeeLeave] = useState(null);
    const [leaveTypes, setLeaveTypes] = useState(null);
    const [leaveStats, setLeaveStats] = useState(null);
    const [openApplyForLeaveModal, setOpenApplyForLeaveModal] = useState(false);

     useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get("/me");
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchLeaveHistory = async () => {
            try {
                const response = await api.get("/leaveemp");
                setLeaveHistory(response.data);
            } catch (error) {
                console.error("Error fetching user leave history:", error);
            }
        };

        fetchLeaveHistory();
    }, [])

    useEffect(() => {
        const fetchLeaveTypes = async () => {
            try {
                const response = await api.get("/leaveType");
                setLeaveTypes(response.data.leaveTypes);
            } catch (error) {
                console.error("Error fetching job titles:", error);
            }
        }

        fetchLeaveTypes();
    }, [])

    useEffect(() => {

        const fetchLeaveStats = async () => {
            try {
                const response = await api.get(`/leaveemp/stats`);
                setLeaveStats(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching leave stats:", error);
            }
        };

        fetchLeaveStats();
    }, []);

    useEffect(() => {
    const fetchEmployeeLeave = async () => {
        if (!user || !user.employeeId) 
            return;

        try {
            const response = await api.get(`/employeeLeave/employee/${user.employeeId}`);
            setEmployeeLeave(response.data);
        } catch (error) {
            console.error("Failed to fetch leave:", error);
        }
    };

        fetchEmployeeLeave();
    }, [user]);


    if (!employeeLeave || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="ml-4">Loading your profile...</p>
            </div>
        );
    }

    const totalRemaining = employeeLeave.totalRemaining;
 return (
    <div className="p-6 space-y-6">
        <Toaster /> {/* Good to have this here for the success/error messages */}
        
        <div className="flex flex-col lg:flex-row gap-6 w-full items-start">
            <div className="flex-1">
                <Card className="h-full border-0 shadow-sm">
                    <CardHeader className="pb-3 flex flex-row justify-between items-start">
                        <div>
                            <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                Leave Request History
                            </CardTitle>
                            <CardDescription>
                                View leave request history
                            </CardDescription>
                        </div>

                        <Button 
                            variant="outline" 
                            className="rounded-xl px-6 py-6 text-[15px] tracking-widest hover:bg-gray-400 active:bg-gray-500" 
                            onClick={() => setOpenApplyForLeaveModal(true)}
                        >
                            Apply for Leave
                        </Button>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                        <LeaveHistoryTable history={leaveHistory} />
                    </CardContent>
                </Card>
            </div>

            <div className="lg:w-80 xl:w-96">
                <Card className="border-0 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center">
                            <ChartBar className="w-4 h-4 mr-2 text-muted-foreground"/>
                            <CardTitle className="text-sm font-medium">
                                Leave Time Remaining This Year
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {`${employeeLeave.totalRemaining} hours / ${employeeLeave.totalLeaveHours} hours`}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

        {/* THIS WAS THE MISSING PIECE: */}
        <ApplyForLeaveModal 
            open={openApplyForLeaveModal} 
            setOpen={setOpenApplyForLeaveModal} 
            leaveTypes={leaveTypes} 
        />
    </div>
 )};