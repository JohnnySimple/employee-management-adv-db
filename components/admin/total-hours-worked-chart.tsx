"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";


const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig

export default function TotalHoursWorkedChart({ data }: { data: { date: string, totalHours: number }[] }) {

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Total Hours Worked (Last 7 Days)</CardTitle>
                <CardDescription>Track the total hours worked by employees over the past week.</CardDescription>
            </CardHeader>
            {/* <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                    <LineChart data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis 
                            dataKey="date"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(5)} // Show only MM-DD
                        />
                        <Line type="monotone" dataKey="totalHours" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
                        <ChartTooltip content={<ChartTooltipContent />}/>
                    </LineChart>
                </ChartContainer>
            </CardContent> */}
            <CardContent className="pt-4">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#ccc" />
                            <XAxis 
                                dataKey="date"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tick={{ fontSize: 12, fill: "#6b7280" }}
                                tickFormatter={(value) => value.slice(5)} // Show only MM-DD
                            />
                            <YAxis 
                                tickLine={false}
                                width={30}
                                axisLine={false}
                                tick={{ fontSize: 12, fill: "#9ca3af" }}
                            />

                            <Tooltip
                                cursor={{ stroke: "#d1d5db", strokeWidth: 1 }}
                                contentStyle={{
                                borderRadius: "8px",
                                border: "1px solid #e5e7eb",
                                fontSize: "12px",
                                }}
                            />

                            <defs>
                                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <Area
                                type="monotone"
                                dataKey="totalHours"
                                stroke="none"
                                fill="url(#colorHours)"
                            />

                            <Line
                                type="monotone"
                                dataKey="totalHours"
                                stroke="#2563eb"
                                strokeWidth={2.5}
                                dot={false}
                                activeDot={{ r: 5 }}
                            />
                        </AreaChart>    
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
