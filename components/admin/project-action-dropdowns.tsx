"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import EditProjectModal from "@/components/admin/edit-project";

interface Project {
    projectId: number;
    projectName: string;
    startDate: string;
    endDate: string;
    location: string;
    status: "ACTIVE" | "INACTIVE";
}

interface Props {
    project: Project;
    onSuccess: () => void;
}



export default function ProjectActionsDropdown({ project, onSuccess }: Props) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleDelete = async () => {
    try {
        const response = await fetch(`/api/project/${project.projectId}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete project");
        toast.success("Project deleted successfully.");
        onSuccess();
    } catch (error) {
        console.error(error);
        toast.error("Failed to delete project.");
    }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded-md hover:bg-muted transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                        Edit Project
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={handleDelete}
                        className="text-red-500 focus:text-red-500"
                    >
                        Set to Inactive
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <EditProjectModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={onSuccess}
                project={project}
            />
        </>
    );
}