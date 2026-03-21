"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { FolderOpen, Play, Plus, Square, Users } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge, Clock, Loader } from "lucide-react";
import { toast, Toaster } from "sonner";


export default function EmployeeHome() {

    const [attendance, setAttendance] = useState([]);
    const [user, setUser] = useState(null);

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

    const clockIn = async () => {
        try {
            await api.post("/attendancemp");
            // Refresh attendance data after clocking in
            const response = await api.get(`/employee/${user?.employeeId}/attendance`);
            setAttendance(response.data);
        } catch (error) {
            console.error("Error clocking in:", error);
            toast.error("Error clocking in.");
        }
    }

    const clockOut = async () => {
        try {
            await api.put("/attendancemp");
            // Refresh attendance data after clocking out
            const response = await api.get(`/employee/${user?.employeeId}/attendance`);
            setAttendance(response.data);
        } catch (error) {
            console.error("Error clocking out:", error);
        }
    }
    
    return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap gap-4 mb-6">
        <Toaster />
        {/* generate cards to hold relevant summaries(like total employees, active projects, attendance etc) */}
        <div className="w-full sm:w-[48%] lg:w-[23%]">
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Attendance Rate
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">
                from last month
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full sm:w-[48%] lg:w-[23%]">
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Leave Balance
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">14 days</div>
              <p className="text-xs text-muted-foreground">
                Remaining annual leave
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
              <Users className="w-4 h-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                Active project assignments
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full sm:w-[48%] lg:w-[23%]">
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Item 4
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                some info
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
                    View all logs →
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Projects Card */}
        <div className="lg:w-80 xl:w-96">
          <Card className="h-full border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-primary" />
                Active Projects
              </CardTitle>
              <CardDescription>
                projects in progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
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
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}