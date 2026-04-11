"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { FolderOpen, Play, Plus, Square, Users } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge, Clock, Loader, CalendarCheck2, Umbrella, Briefcase, Activity } from "lucide-react";
import { toast, Toaster } from "sonner";
import Link from "next/link";


export default function EmployeeHome() {

    const [attendance, setAttendance] = useState([]);
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [leaveStats, setLeaveStats] = useState(null);


    // get logged in employee from token
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
        if (!user) return;
        // Fetch attendance data for the employee
        const fetchAttendance = async () => {
            try {
                const response = await api.get(`/employee/${user?.employeeId}/attendance`);
                setAttendance(response.data);
            } catch (error) {
                console.error("Error fetching attendance data:", error);
            }
        };

        fetchAttendance();
    }, [user]);

    // fetch employee stats
    useEffect(() => {
      if (!user) return;

      const fetchStats = async () => {
        try {
          const response = await api.get(`/employee/${user?.employeeId}/stats`);
          setStats(response.data);
          console.log(response.data);
        } catch (error) {
          console.error("Error fetching stats:", error);
        }
      };

      fetchStats();
    }, [user]);

    const clockIn = async () => {
        try {
            await api.post("/attendancemp");
            // Refresh attendance data after clocking in
            const response = await api.get(`/employee/${user?.employeeId}/attendance`);
            setAttendance(response.data);
        } catch (error) {
            // console.error("Error clocking in:", error?.response?.data?.message);
            toast.error(`Error clocking in. ${error?.response?.data?.message}`);
        }
    }

    const clockOut = async () => {
        try {
            await api.put("/attendancemp");
            // Refresh attendance data after clocking out
            const response = await api.get(`/employee/${user?.employeeId}/attendance`);
            setAttendance(response.data);
        } catch (error) {
            // console.error("Error clocking out:", error);
            toast.error(`Error clocking out. ${error?.response?.data?.message}`);
        }
    }

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

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthRecords = attendance?.filter(a => {
    const recordDate = new Date(a.workDate);
    return recordDate.getMonth() === currentMonth && 
            recordDate.getFullYear() === currentYear;
    }) || [];

    const lastMonthRecords = attendance?.filter(a => {
    const recordDate = new Date(a.workDate);
    return recordDate.getMonth() === currentMonth - 1 && 
            recordDate.getFullYear() === currentYear;
    }) || [];



    const totalDaysThisMonth = thisMonthRecords.length;
    const totalDaysLastMonth = lastMonthRecords.length;

    
    return (
    <div className="p-6 space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-sm border border-blue-100/50">
        {/* Decorative gradient blob */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br from-blue-200/30 to-transparent blur-2xl" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-gradient-to-tr from-blue-200/20 to-transparent blur-2xl" />
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6 relative z-10">
          {/* Left Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <p className="text-sm font-medium text-blue-600">
                {new Date().toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              Welcome back, {user?.employee?.firstName} <span className="inline-block animate-wave">👋</span>
            </h1>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 w-fit">
                <svg className="h-3.5 w-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                </svg>
                <p className="text-sm text-gray-700">
                </p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
            {/* Time */}
            <div className="px-2 py-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Current Time</p>
              <p className="text-xl font-semibold font-mono text-gray-800">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* Divider */}
            <div className="h-10 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />

            {/* Status */}
            <div className="px-2 py-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</p>
              {attendance[0]?.timeOut === null ? (
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-sm font-semibold text-green-600">Clocked In</p>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-gray-400" />
                  <p className="text-sm font-semibold text-gray-500">Clocked Out</p>
                </div>
              )}
            </div>

            {/* Optional Action */}
            
            <Link href="/employee/attendance">
              <button className="ml-1 px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm hover:shadow-md hover:from-blue-700 hover:to-blue-800 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                View Logs
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Toaster />
    <div className="flex flex-wrap gap-4 mb-6">
          {/* generate cards to hold relevant summaries(like total employees, active projects, attendance etc) */}
        <div className="w-full sm:w-[48%] lg:w-[23%]">
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Attendance Last Month
              </CardTitle>
              <CalendarCheck2 className="w-4 h-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDaysLastMonth}</div>
              <p className="text-xs text-muted-foreground">
                Days Worked Last Month
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full sm:w-[48%] lg:w-[23%]">
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Attendance This Month
              </CardTitle>
              <CalendarCheck2 className="w-4 h-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDaysThisMonth}</div>
              <p className="text-xs text-muted-foreground">
                Days Worked This Month
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full sm:w-[48%] lg:w-[23%]">
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Leave Balance This Year
              </CardTitle>
              <Umbrella className="w-4 h-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold"> {leaveStats ? `${leaveStats.stats["PTO"]?.usedHours || 0}/${leaveStats.stats["PTO"]?.remaining + leaveStats.stats["PTO"]?.usedHours || 0}` : "Loading..."}
              </div>
              <p className="text-xs text-muted-foreground">
                Remaining Leave In Hours
              </p>
            </CardContent>
          </Card>
        </div>
        
         <div className="w-full sm:w-[48%] lg:w-[23%]">
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Project Load
              </CardTitle>
              <Briefcase className="w-4 h-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeProjectCount ?? 0}</div>
              <p className="text-xs text-muted-foreground">
                Active Project Assignments
              </p>
            </CardContent>
          </Card>
        </div> 
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Time Logging Card */}
        <div className="flex-1">
          <Card className="h-full border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Time Logging
              </CardTitle>
              <CardDescription>
                Track your work hours and manage time entries
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Clock In/Out Buttons */}
              <div className="flex gap-3">
                {attendance[0]?.timeOut === null ? (
                  <Button className="flex-1 bg-blue-700" size="lg" onClick={clockIn} disabled>
                    <Loader className="h-4 w-4 mr-2" />
                    Currently Clocked In
                  </Button>
                ) : (
                  <Button className="flex-1" size="lg" onClick={clockIn}>
                    <Play className="h-4 w-4 mr-2" />
                    Clock In
                  </Button>
                )}
                
                <Button variant="outline" className="flex-1" size="lg" onClick={clockOut}>
                  <Square className="h-4 w-4 mr-2" />
                  Clock Out
                </Button>
              </div>

              {/* Current Session */}
              {/* <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Current Session</p>
                <p className="text-2xl font-bold">2h 15m</p>
                <p className="text-xs text-muted-foreground mt-1">Started at 9:30 AM</p>
              </div> */}

              {/* Recent Time Logs */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Recent Entries</h4>
                <div className="space-y-2">
                  {attendance.slice(0, 4).map((log: any, i) => {
                    const date = new Date(log.workDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
                    const timeIn = log.timeIn ? new Date(log.timeIn).toLocaleDateString([], { hour: "2-digit", minute: "2-digit" }) : "--";
                    const timeOut = log.timeOut ? new Date(log.timeOut).toLocaleDateString([], { hour: "2-digit", minute: "2-digit" }) : null;
                    let calculatedHours = "--";
                    if (log.timeIn && log.timeOut) {
                      const diff = new Date(log.timeOut).getTime() - new Date(log.timeIn).getTime();
                      const hours = Math.floor(diff / (1000 * 60 * 60));
                      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                      calculatedHours = `${hours}h ${minutes}m`;
                    } else if (log.timeIn && !log.timeOut) {
                      const diff = new Date().getTime() - new Date(log.timeIn).getTime();
                      const hours = Math.floor(diff / (1000 * 60 * 60));
                      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                      calculatedHours = `${hours}h ${minutes}m`;
                    }
                    const isOngoing = !log.timeOut;

                    return (
                      <div
                        key={i}
                        className="flex justify-between items-center p-2 rounded-xl border hover:bg-muted/50 transition"
                      >
                        <div className="space-y-1">
                          <p className="font-medium text-sm">{date}</p>
                          <p className="text-xs text-muted-foreground">
                            {timeIn} – {timeOut || "Present"}
                          </p>
                        </div>
                        <div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              isOngoing
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {isOngoing ? "Ongoing" : "Completed"}
                          </span>
                          <p className="text-xs text-muted-foreground font-mono pr-2 pt-1 flex justify-end">
                            {calculatedHours}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  <p className="text-xs text-muted-foreground text-right cursor-pointer hover:underline">
                    <Link href="/employee/attendance">
                      View all logs →
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Projects Card */}
        <div className="lg:w-80 xl:w-96">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-primary" />
                Active Projects
              </CardTitle>
              <CardDescription>
                Projects in progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* {[
                { name: "Dashboard Redesign", progress: 75, deadline: "Dec 15", priority: "high", color: "bg-blue-500" },
                { name: "API Integration", progress: 30, deadline: "Dec 20", priority: "medium", color: "bg-yellow-500" },
                { name: "Mobile App", progress: 90, deadline: "Dec 10", priority: "urgent", color: "bg-red-500" },
                { name: "Documentation", progress: 45, deadline: "Dec 18", priority: "low", color: "bg-green-500" }
              ].map((project, i) => (
                <div key={i} className="space-y-2 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">{project.name}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Due {project.deadline}</p>
                    </div>
                    <p className="text-sm font-mono font-medium">{project.progress}%</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`${project.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              ))} */}
              {stats?.activeProjects.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-10">
                  No active projects assigned.
                </p>
              ) : (
                stats?.activeProjects.map((assignment: any, i: number) => {
                  let progress = Math.floor(Math.random() * 100); // Placeholder for actual progress calculation
                  // random color based on list of colors
                  const colors = ["bg-blue-500", "bg-yellow-500", "bg-red-500", "bg-green-500"];
                  const color = colors[i % colors.length];
                  
                  return (
                    <div key={i} className="space-y-2 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm">{assignment.project.projectName}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">Due {new Date(assignment.project.endDate).toLocaleDateString()}</p>
                        </div>
                        <p className="text-sm font-mono font-medium">{progress}%</p>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`${color} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}