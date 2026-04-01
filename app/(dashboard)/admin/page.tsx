"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import api from "@/lib/api";
import { AdminStats } from "@/types/AdminStats";
import TestChart from "@/components/admin/test-chart";
import EmployeeClockInTable from "@/components/admin/employee-clockin-table";
import TotalHoursWorkedChart from "@/components/admin/total-hours-worked-chart";


export default function AdminHome() {

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [hoursWorkedData, setHoursWorkedData] = useState<{ date: string, totalHours: number }[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/protected/admin/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchHoursWorked = async () => {
      try {
        const response = await api.get("/protected/admin/stats/hours-worked?days=7");
        setHoursWorkedData(response.data);
      } catch (error) {
        console.error("Error fetching hours worked data:", error);
      }
    };

    fetchHoursWorked();
  }, []);

  return (
    // <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
    //   Admin home dashboard
    // </div>
    <div className="p-6 space-y-6">
      {/* top stats */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* generate cards to hold relevant summaries(like total employees, active projects, attendance etc) */}
        <div className="w-full sm:w-[48%] lg:w-[23%]">
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Total Employees
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.employeesCount?.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.employeesCount?.active} Active, {stats?.employeesCount?.inactive} Inactive
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="w-full sm:w-[48%] lg:w-[23%]">
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Projects
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.projects.length}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.projectCount.inactive} Inactive
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="w-full sm:w-[48%] lg:w-[23%]">
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Departments
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.departmentCount}</div>
              <p className="text-xs text-muted-foreground">
                All Inclusive
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="w-full sm:w-[48%] lg:w-[23%]">
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Clocked In Today
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.checkedInEmployeeCount}</div>
              <p className="text-xs text-muted-foreground">
                Live Attendance
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* bottom */}
      <div className="flex flex-wrap gap-4 w-full">
        {/* generate cards to hold relevant charts on left side and maybe clocked in employees on the right */}
        <div className="flex-1 min-w=[300px]">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>
                Employee Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* <TestChart /> */}
                <TotalHoursWorkedChart data={hoursWorkedData} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 min-w-[250px] max-w-[400px]">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>
                Clocked In Employees
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <EmployeeClockInTable clockIns={stats?.employeesClockedInToday ?? []} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}