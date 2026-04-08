"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const formSchema = z.object({
    projectName: z.string().min(1, { message: "Project name is required." }),
    location: z.string().min(1, { message: "Location is required." }),
    startDate: z.string().min(1, { message: "Start date is required." }),
    endDate: z.string().min(1, { message: "End date is required." }),
    status: z.enum(["ACTIVE", "INACTIVE"], {
        message: "Please select a status."
    }),
});

type FormData = z.infer<typeof formSchema>;

interface AddProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddProjectModal({ isOpen, onClose, onSuccess }: AddProjectModalProps) {

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema)
    });

    const onSubmit = async (data: FormData) => {
    try {
        const addOneDay = (dateStr: string) => {
            const date = new Date(dateStr);
            date.setDate(date.getDate() + 1);
            return date.toISOString().split("T")[0];
        };

        const adjustedData = {
            ...data,
            startDate: addOneDay(data.startDate),
            endDate: addOneDay(data.endDate),
        };

        const response = await fetch("/api/project", { // or /api/project/${id} for edit
            method: "POST", // or PATCH for edit
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(adjustedData),
        });
        if (!response.ok) throw new Error("Failed to save project");
        toast.success("Project saved successfully!");
        reset();
        onClose();
        onSuccess();
    } catch (error) {
        console.error(error);
        toast.error("Failed to save project.");
    }
};

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add Project</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the new project.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4 py-2">
                        <div className="flex flex-row gap-4">
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="projectName">Project Name</Label>
                                <Input
                                    id="projectName"
                                    type="text"
                                    placeholder="Downtown Bridge Repair"
                                    {...register("projectName")}
                                />
                                {errors.projectName && (
                                    <p className="text-sm text-red-500">{errors.projectName.message}</p>
                                )}
                            </div>
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    type="text"
                                    placeholder="New York, NY"
                                    {...register("location")}
                                />
                                {errors.location && (
                                    <p className="text-sm text-red-500">{errors.location.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-row gap-4">
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    {...register("startDate")}
                                />
                                {errors.startDate && (
                                    <p className="text-sm text-red-500">{errors.startDate.message}</p>
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
                                    <p className="text-sm text-red-500">{errors.endDate.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-row gap-4">
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="status">Status</Label>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                                                <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.status && (
                                    <p className="text-sm text-red-500">{errors.status.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t">
                        <Button type="submit" className="w-full">Add Project</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}