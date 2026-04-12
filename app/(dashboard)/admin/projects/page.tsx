"use client";

import {
    Table,
    TableCell,
    TableHead,
    TableHeader,
    TableBody,
    TableRow
} from "@/components/ui/table";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProjectActionsDropdown from "@/components/admin/project-action-dropdowns";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import AddProjectModal from "@/components/admin/add-project";
import { FolderOpen } from "lucide-react";

interface Project {
    projectId: number;
    projectName: string;
    startDate: string;
    endDate: string;
    location: string;
    status: "ACTIVE" | "INACTIVE";
}

export default function ProjectPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchProjects = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/project");
            const data = await response.json();
            const sortedData = data.sort((a: Project, b: Project) => a.projectId - b.projectId);
            setProjects(sortedData);
        } catch (err) {
            console.error("Failed to fetch projects", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (isLoading) return <div className="p-8 text-sm text-muted-foreground">Loading...</div>;

    return (
    <>
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Projects</h1>
            <div className="mt-2 flex justify-end">
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="mb-4 text-[15px] border rounded-xl px-4 py-4 tracking-widest hover:bg-gray-400 active:bg-gray-500"
                >
                    Add Project
                </button>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:flex-nowrap gap-6 items-start">
            
            <div className="flex-grow w-full overflow-hidden">
                <Card className="overflow-hidden border"> {/* Kept your border here */}
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Project Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>End Date</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projects.map((project, index) => (
                                    <TableRow
                                        key={project.projectId}
                                        className={cn(
                                            "transition-colors hover:bg-muted/50",
                                            index % 2 === 0 ? "bg-background" : "bg-muted/20"
                                        )}
                                    >
                                        <TableCell className="font-mono text-sm font-medium">{project.projectId}</TableCell>
                                        <TableCell className="font-medium">{project.projectName}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{project.location}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{formatDate(project.startDate)}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{formatDate(project.endDate)}</TableCell>
                                        <TableCell className="text-center">
                                            <span className="text-sm font-medium">{project.status}</span>
                                        </TableCell>
                                        <TableCell>
                                            <ProjectActionsDropdown project={project} onSuccess={fetchProjects} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            </div>

            <aside className="w-full lg:w-82 shrink-0">
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3 px-4">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <FolderOpen className="h-5 w-5 text-primary" />
                            Active Projects
                        </CardTitle>
                        <CardDescription>
                            Projects in progress
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 px-4">
                        {projects?.filter((p: any) => p.status !== "INACTIVE").length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-10">
                                No active projects assigned.
                            </p>
                        ) : (
                            projects
                                .filter((p: any) => p.status !== "INACTIVE")
                                .map((assignment: any, i: number) => {
                                    const calculateProgress = (start: string, end: string) => {
                                        const startDate = new Date(start).getTime();
                                        const endDate = new Date(end).getTime();
                                        const now = new Date().getTime();
                                        if (now < startDate) return 0;
                                        if (now > endDate) return 100;
                                        const totalDuration = endDate - startDate;
                                        const elapsed = now - startDate;
                                        const percentage = Math.floor((elapsed / totalDuration) * 100);
                                        return Math.min(Math.max(percentage, 0), 100);
                                    };

                                    const progress = calculateProgress(assignment.startDate, assignment.endDate);
                                    const colors = ["bg-blue-500", "bg-yellow-500", "bg-red-500", "bg-green-500", "bg-purple-500"];
                                    const color = colors[i % colors.length];

                                    return (
                                        <div key={assignment.projectId || i} className="space-y-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm truncate w-32">{assignment.projectName}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Due {assignment.endDate ? new Date(assignment.endDate).toLocaleDateString() : "TBD"}
                                                    </p>
                                                </div>
                                                <p className="text-sm font-mono font-medium">{progress}%</p>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-1.5">
                                                <div 
                                                    className={`${color} h-1.5 rounded-full transition-all duration-300`}
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                        )}
                    </CardContent>
                </Card>
            </aside>
        </div>

        <AddProjectModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={fetchProjects}
        />
    </>
);
}