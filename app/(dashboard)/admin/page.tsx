"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function AdminHome() {
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
              <Users className="w-4 h-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">120</div>
              <p className="text-xs text-muted-foreground">
                +5 this month
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
              <Users className="w-4 h-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">
                1 Inactive
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
              <Users className="w-4 h-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
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
              <Users className="w-4 h-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92</div>
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
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                Chart here
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
              Table here
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}