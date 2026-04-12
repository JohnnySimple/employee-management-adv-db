"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
 } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/lib/api";

const formSchema = z.object({
    leaveId: z.number({ message: "Please select a leave type." }),
    startDate: z.string().min(1, { message: "Start date is required." }),
    endDate: z.string().min(1, { message: "End date is required." }),
});

type FormData = z.infer<typeof formSchema>;

export default function ApplyForLeaveModal({ open, setOpen, leaveTypes, employeeLeave }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get("/me");
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        if (open) fetchUser();
    }, [open]);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema)
    });

   const calculatePTOHours = (startStr: string, endStr: string) => {
        const start = new Date(startStr);
        const end = new Date(endStr);

        const startDay = start.toISOString().split('T')[0];
        const endDay = end.toISOString().split('T')[0];

        if (startDay === endDay) {
            return 8;
        }

        const diffMs = end.getTime() - start.getTime();
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
        
        return days * 8;
};

    const applyForLeave = async (data: FormData) => {
        try {
            const hoursOff = calculatePTOHours(data.startDate, data.endDate);

            // 1. Update the balance first (The PATCH we built)
            await api.patch(`/employeeLeave/employee/${user?.employeeId}`, {
                hoursToSubtract: hoursOff
            });

            const employeeLeave = await api.get(`/employeeLeave/employee/${user?.employeeId}`, {
            });

            // 2. Record the entry in history (The POST)
            const historyPayload = {
                employeeLeaveId: employeeLeave.employeeLeaveId,
                startDate: new Date(data.startDate).toISOString(),
                endDate: new Date(data.endDate).toISOString(),
                leaveId: data.leaveId
                };

            await api.post("/leaveemp", historyPayload);

            toast.success(`Requested ${hoursOff} hours successfully!`);
            setOpen(false);
            reset();
            window.location.reload(); // Refresh to show new data in table/cards

        } catch (error: any) {
            console.error("Error applying for leave:", error);
            const serverError = error.response?.data?.error || "Insufficient balance or server error";
            toast.error(serverError);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Apply for Leave</DialogTitle>
                    <DialogDescription>
                        Requests are rounded and capped at 8 hours per work day.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(applyForLeave)}>
                    <CardContent className="space-y-4 pt-4">
                        <div className="flex flex-row gap-4">
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input id="startDate" type="datetime-local" {...register("startDate")} />
                            </div>
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="endDate">End Date</Label>
                                <Input id="endDate" type="datetime-local" {...register("endDate")} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="leaveId">Leave Type</Label>
                            <Controller 
                                name="leaveId"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={(val) => field.onChange(parseInt(val))} value={field.value?.toString()}>
                                        <SelectTrigger><SelectValue placeholder="Select leave type"/></SelectTrigger>
                                        <SelectContent>
                                            {leaveTypes?.map((leave) => (
                                                <SelectItem key={leave.leaveId} value={leave.leaveId.toString()}>
                                                    {leave.leaveType}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 mt-4">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit">Submit Request</Button>
                    </CardFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}