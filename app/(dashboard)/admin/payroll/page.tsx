"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Clock, Search, Users } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import api from "@/lib/api";
import { AdminStats } from "@/types/AdminStats";



// ─── Types ────────────────────────────────────────────────────────────────────

interface SalaryRecord {
  salaryId: number;
  employeeId: number;
  amount: number;   
  date: string;     
}

interface AttendanceRecord {
  employeeId: number;
  timeIn: string;
  timeOut: string | null;
}

interface ChartEntry {
  label: string;        
  totalPaid: number;
  hoursWorked: number;
}

interface EmployeeRow {
  id: number;
  name: string;
  latestSalary: number;       
  annualizedSalary: number;   
  hoursThisMonth: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

function mtdTotal(records: SalaryRecord[]): number {
  const now = new Date();
  return records
    .filter((r) => {
      const d = new Date(r.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, r) => sum + r.amount, 0);
}

function lastMonthTotal(records: SalaryRecord[]): number {
  const now = new Date();
  const lm = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
  const ly = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  return records
    .filter((r) => {
      const d = new Date(r.date);
      return d.getMonth() === lm && d.getFullYear() === ly;
    })
    .reduce((sum, r) => sum + r.amount, 0);
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-zinc-200 rounded-lg shadow-md px-4 py-3 text-sm">
      <p className="font-semibold text-zinc-700 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name === "totalPaid" ? "Total Paid" : "Hours Worked"}:{" "}
          <span className="font-medium">
            {p.name === "totalPaid" ? fmt(p.value) : `${p.value}h`}
          </span>
        </p>
      ))}
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminPayroll() {

  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [allSalary, setAllSalary] = useState<SalaryRecord[]>([]);
  const [allAttendance, setAllAttendance] = useState<AttendanceRecord[]>([]);
  const [employeeRows, setEmployeeRows] = useState<EmployeeRow[]>([]);
  const [chartData, setChartData] = useState<ChartEntry[]>([]);

  const [filterMode, setFilterMode] = useState<"overall" | "employee">("overall");
  const [selectedEmployee, setSelectedEmployee] = useState<{ id: number; name: string } | null>(null);
  const [employeeIdInput, setEmployeeIdInput] = useState("");
  const [filterError, setFilterError] = useState("");
  const [filterLoading, setFilterLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [averageSalary, setAverageSalary] = useState(0);
  const [totalHoursThisMonth, setTotalHoursThisMonth] = useState(0);
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [totalPayrollMonth, setTotalPayrollMonth] = useState(0);
  const [payrollList, setPayrollList] = useState<any[]>([]);

  const [attendance, setAttendance] = useState([]);
  const [activeChartId, setActiveChartId] = useState<number | null>(null);
  const [salary, setSalary] = useState<Salary[]>([]);
  

 useEffect(() => {
  const fetchAll = async () => {

    
    try {
      const [salaryRes, attendanceRes, jobTitleRes] = await Promise.all([
        api.get("/salary"),
        api.get("/attendance"),
        api.get("/jobTitle")
      ]);

      const salary: SalaryRecord[] = salaryRes.data;
      const attendance = attendanceRes.data;
      const jobTitle = jobTitleRes.data;

      setAttendance(attendance);

    const totalAmount = salary.reduce((sum, item) => sum + item.amount, 0);

    setAverageSalary(Math.round(totalAmount / salary.length));

    const now = new Date();
    const currentMonth = now.getMonth(); 
    const currentYear = now.getFullYear();


    const monthlyTotal = attendance.reduce((sum: number, item: any) => {
      const itemDate = new Date(item.workDate);
      
      if (itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear) {
        return sum + (item.hoursWorked || 0);
      }
      return sum;
    }, 0);

    setTotalHoursThisMonth(monthlyTotal);

    const monthlyOvertimeTotal = attendance.reduce((sum: number, item: any) => {
      const itemDate = new Date(item.workDate);
      
      if (itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear) {
        return sum + (item.overtimeHours || 0);
      }
      return sum;
    }, 0);

    setOvertimeHours(monthlyOvertimeTotal);


// 1. Create a quick lookup map from the nested array
// Based on your data: {"jobTitles": [...]}
const rateMap = new Map<number, number>(
  (jobTitle?.jobTitles || []).map((j: any) => [
    Number(j.jobTitleId), 
    Number(j.payRate)
  ])
);

const totalPayroll = attendance.reduce((acc: number, record: any) => {
  const itemDate = new Date(record.workDate);
  
  if (itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear) {
    
    // 1. Get the Job Title ID
    const jobId = record.employee?.jobTitleId;
    
    // 2. Look up the rate (Note: rateMap.get returns number | undefined)
    const hourlyRate = rateMap.get(jobId);
    
    // 3. FIX: Ensure hourlyRate is a number before doing arithmetic
    if (typeof hourlyRate === 'number') {
      const overtimeRate = hourlyRate * 1.5; // Error ts(2362) gone!

      const regularPay = (record.hoursWorked || 0) * hourlyRate;
      const overtimePay = (record.overtimeHours || 0) * overtimeRate;

      return acc + regularPay + overtimePay;
    }
  }
  return acc;
}, 0);

setTotalPayrollMonth(totalPayroll.toFixed(2));


const twoWeeksAgo = new Date();
twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

const employeeMap = new Map();

attendance.forEach((record: any) => {
  const workDate = new Date(record.workDate);
  

  // Only process if it's within the last 14 days
  if (workDate >= twoWeeksAgo) {
    const id = record.employeeId;
    
    if (!employeeMap.has(id)) {
      employeeMap.set(id, {
        id: id,
        name: `${record.employee.firstName} ${record.employee.lastName}`,
        jobTitle: record.employee.jobTitleId,
        totalHours: 0,
        totalOvertime: 0
      });
    }

    const current = employeeMap.get(id);
    current.totalHours += (record.hoursWorked || 0);
    current.totalOvertime += (record.overtimeHours || 0);
  }
});

const finalPayroll = Array.from(employeeMap.values()).map((emp) => {
const salaryRecord = salary.find((s: any) => s.employeeId === emp.id);
const hourlyRate: number = rateMap.get(Number(emp.jobTitle)) ?? 0;

  const earnings = (emp.totalHours * hourlyRate) + (emp.totalOvertime * (hourlyRate * 1.5));

  return {
    id: emp.id,
    name: emp.name,
    hours: emp.totalHours,
    overtime: emp.totalOvertime,
    rate: hourlyRate,
    annual: salaryRecord ? salaryRecord.amount : 0,
    earnings: earnings
  };
});

finalPayroll.sort((a, b) => a.id - b.id);

setPayrollList(finalPayroll);

    } catch (err) {
      console.error("Error fetching payroll data:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchAll();
}, []);


interface MonthBucket {
  label: string;
  month: number;
  year: number;
  totalPaid: number;
}

interface Salary {
  salaryId: number;
  employeeId: number;
  salaryDate: string;
  amount: number;
}

const payrollChartData = useMemo(() => {
  const months: MonthBucket[] = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (11 - i));
    return {
      label: d.toLocaleString('default', { month: 'short' }),
      month: d.getMonth(),
      year: d.getFullYear(),
      totalPaid: 0,
    };
  });

  const filtered = activeChartId 
    ? attendance.filter((a: any) => Number(a.employeeId) === Number(activeChartId))
    : attendance;

  filtered.forEach((record: any) => {
    // Force the date to be parsed correctly
    const rDate = new Date(record.workDate);
    const rMonth = rDate.getUTCMonth(); // Use UTC to avoid timezone shifting
    const rYear = rDate.getUTCFullYear();

    let bucket = months.find(m => m.month === rMonth && m.year === rYear);

    if (bucket) {

      const payrollEntry = payrollList.find(p => Number(p.id) === Number(record.employeeId));

      const hourlyRate = payrollEntry ? payrollEntry.rate : 0;
      const hours = Number(record.hoursWorked) || 0;
      const ot = Number(record.overtimeHours) || 0;
      
      const earnings = (hours * hourlyRate) + (ot * hourlyRate * 1.5);
      
      bucket.totalPaid += earnings;
    }
  });

  return months;
}, [attendance, salary, activeChartId]);

const handleFilter = () => {
  const id = parseInt(employeeIdInput.trim());
  
  if (isNaN(id)) {
    setFilterError("Please enter a valid numeric employee ID.");
    return;
  }

  setFilterError("");

  const exists = payrollList.find((e) => e.id === id);

  if (exists) {
    setActiveChartId(id); 
    
    setSelectedEmployee({ id: exists.id, name: exists.name });
    setFilterMode("employee");
  } else {
    setFilterError(`Employee ID ${id} not found in the current payroll.`);
  }
};

const handleClear = () => {
  setEmployeeIdInput("");
  setActiveChartId(null);
  setSelectedEmployee(null);
  setFilterError("");
  setFilterMode("overall");
};

  const payrollMTD = mtdTotal(allSalary);
  const payrollLastMonth = lastMonthTotal(allSalary);
  const mtdVsLast = payrollLastMonth > 0
    ? ((payrollMTD - payrollLastMonth) / payrollLastMonth * 100).toFixed(1)
    : null;

  if (loading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading payroll data…</div>;
  }

  return (
    <div className="p-6 space-y-6">

      {/* ── Top Stats ── */}
      <div className="flex flex-wrap gap-4 mb-6">

        <div className="w-full sm:w-[48%] lg:w-[23%]">
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Payroll MTD</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Number(totalPayrollMonth).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                })}</div>
              <p className="text-xs text-muted-foreground">
                {mtdVsLast !== null ? (
                  <span className={Number(mtdVsLast) >= 0 ? "text-green-600" : "text-red-500"}>
                    {Number(mtdVsLast) >= 0 ? "▲" : "▼"} {Math.abs(Number(mtdVsLast))}% vs last month
                  </span>
                ) : "Current month to date"}
              </p>
            </CardContent>
          </Card>
        </div>


        <div className="w-full sm:w-[48%] lg:w-[23%]">
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Hours (MTD)</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHoursThisMonth.toFixed(2)}h</div>
              <p className="text-xs text-muted-foreground">Across all employees</p>
            </CardContent>
          </Card>
        </div>

        <div className="w-full sm:w-[48%] lg:w-[23%]">
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Overtime Hours (MTD)</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overtimeHours}</div>
              <p className="text-xs text-muted-foreground">Current month to date</p>
            </CardContent>
          </Card>
        </div>

        <div className="w-full sm:w-[48%] lg:w-[23%]">
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Avg. Annual Salary</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${averageSalary.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">For all employees</p>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* ── Bottom: Chart + Table ── */}
      <div className="flex flex-wrap gap-4 w-full items-stretch">

        {/* Chart */}
        <div className="flex-[2] min-w-[300px]">
          <Card className="h-[500px] flex flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <CardTitle>
                    {filterMode === "employee" && selectedEmployee
                      ? `Payroll — ${selectedEmployee.name}`
                      : "Overall Payroll"}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {filterMode === "employee"
                      ? `Pay periods & hours for employee ID ${selectedEmployee?.id}`
                      : "Total paid & hours worked per pay period"}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="number"
                      placeholder="Employee ID"
                      value={employeeIdInput}
                      onChange={(e) => setEmployeeIdInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleFilter()}
                      className="pl-8 pr-3 py-1.5 text-sm border border-zinc-200 rounded-md w-36 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                    />
                  </div>
                  <button
                    onClick={handleFilter}
                    disabled={filterLoading}
                    className="px-3 py-1.5 text-sm bg-zinc-900 text-white rounded-md hover:bg-zinc-700 disabled:opacity-50 transition-colors"
                  >
                    {filterLoading ? "…" : "Filter"}
                  </button>
                  {filterMode === "employee" && (
                    <button
                      onClick={handleClear}
                      className="px-3 py-1.5 text-sm border border-zinc-200 rounded-md hover:bg-zinc-50 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {filterError && <p className="text-xs text-red-500 mt-1">{filterError}</p>}
            </CardHeader>

            <CardContent className="flex-1 pb-6">
            <div className="w-full h-[350px]">
                {payrollChartData.some(d => d.totalPaid > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={payrollChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                        dataKey="label" 
                        fontSize={11} 
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: '#888' }} 
                    />
                    <YAxis 
                        fontSize={11} 
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: '#888' }}
                        tickFormatter={(value) => `$${value >= 1000 ? `${(value/1000).toFixed(1)}k` : value}`}
                    />
                    <Tooltip 
                        cursor={{ fill: '#f8f8f8' }}
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', fontSize: '12px' }}
                        formatter={(value: number) => [`$${value.toLocaleString(undefined, {minimumFractionDigits: 2})}`, 'Total Paid']}
                    />
                    <Bar 
                        dataKey="totalPaid" 
                        fill="#18181b" 
                        radius={[4, 4, 0, 0]} 
                        barSize={32} 
                    />
                    </BarChart>
                </ResponsiveContainer>
                ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground border border-dashed rounded-lg bg-zinc-50/50">
                    <p className="text-sm font-medium">No pay records for this period</p>
                    <p className="text-[10px]">Verify attendance is logged for {new Date().getFullYear()}.</p>
                </div>
                )}
            </div>
            </CardContent>
          </Card>
        </div>

        {/* Employee table */}
        <div className="flex-1 min-w-[350px]">
          <Card className="h-[500px] flex flex-col">
            <CardHeader className="flex shrink-0">
                <div>
              <CardTitle>Employee Payroll</CardTitle>
              <p className="text-xs text-muted-foreground">Latest pay period & hours this month</p>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pt-0 custom-scrollbar">
              {payrollList.length === 0 ? (
                <p className="px-6 py-4 text-sm text-muted-foreground">No records found.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr className="border-b border-zinc-100">
                      <th className="text-left px-6 py-2 text-xs font-medium text-muted-foreground">ID</th>
                      <th className="text-left px-2 py-2 text-xs font-medium text-muted-foreground">Name</th>
                      <th className="text-right px-2 py-2 text-xs font-medium text-muted-foreground">Bi-weekly</th>
                      <th className="text-right px-6 py-2 text-xs font-medium text-muted-foreground">Hrs This Pay Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrollList.map((emp) => (
                      <tr
                        key={emp.id}
                        className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors cursor-pointer"
                        onClick={() => {
                          setEmployeeIdInput(String(emp.id));
                        }}
                      >
                        <td className="px-6 py-3 text-muted-foreground">{emp.id}</td>
                        <td className="px-2 py-3">
                          <div className="font-medium text-zinc-800">{emp.name}</div>
                          <div className="text-xs text-muted-foreground">{fmt(emp.annual)}/yr</div>
                        </td>
                        <td className="px-2 py-3 text-right font-medium">{fmt(emp.earnings)}</td>
                        <td className="px-6 py-3 text-right text-zinc-600">{(emp.hours + emp.overtime).toFixed(2)}hrs</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}