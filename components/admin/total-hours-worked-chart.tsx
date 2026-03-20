"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
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
            <CardContent>
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
            </CardContent>
        </Card>
    )
}
