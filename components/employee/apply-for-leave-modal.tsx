"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
 } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEmployee } from "../providers/admin-employee-provider";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/lib/api";
import { useEffect } from "react";


const formSchema = z.object({
    leaveId: z.number({ message: "Please select a leave type." }),
    startDate: z.string().min(1, { message: "Start date is required." }),
    endDate: z.string().min(1, { message: "End date is required." }),
});

type FormData = z.infer<typeof formSchema>;

export default function ApplyForLeaveModal({ open, setOpen, leaveTypes }) {

    const [isApplyForLeaveModalOpen, setIsApplyForLeaveModalOpen] = useState(false);

    const {
            register,
            handleSubmit,
            control,
            reset,
            formState: { errors },
        } = useForm<FormData>({
            resolver: zodResolver(formSchema)
        });

    const applyForLeave = async (data: FormData) => {
        console.log(data);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Apply for Leave</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Add leave application details
                </DialogDescription>

                <form onSubmit={handleSubmit(applyForLeave)}>
                    <CardContent className="space-y-4">
                        <div className="flex flex-row gap-4">
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    {...register("startDate")}
                                />
                                {errors.startDate && (
                                    <p className="text-sm text-red-500">{ errors.startDate.message }</p>
                                )}
                            </div>
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="endDate">End Date</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    {...register("endDate")}
                                />
                                {errors.endDate && (
                                    <p className="text-sm text-red-500">{ errors.endDate.message }</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-row gap-4 w-full">
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="leaveId">Leave Type</Label>
                                <Controller 
                                    name="leaveId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select 
                                            onValueChange={(value) => field.onChange(parseInt(value))}
                                            value={field.value?.toString()}
                                        >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select job title"/>
                                        </SelectTrigger>
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
                                {errors.leaveId && (
                                    <p className="text-sm text-red-500">{ errors.leaveId.message }</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="mt-8">
                        <Button type="submit" className="w-full">Apply</Button>
                    </CardFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}