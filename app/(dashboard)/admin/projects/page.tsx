"use client";

import { 
    Table,
    TableCell,
    TableHead,
    TableHeader,
    TableBody,
    TableRow
 } from "@/components/ui/table";

import { Card } from "@/components/ui/card";
import ProjectActionsDropdown from "@/components/admin/project-action-dropdowns";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import AddProjectModal from "@/components/admin/add-project";

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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Projects</h1>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-1.5 text-sm border rounded-md hover:bg-muted/50 transition-colors"
                >
                    Add Project
                </button>
            </div>

            <Card className="overflow-hidden">
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
                                    <TableCell className="text-sm text-muted-foreground">{formatDate(project.startDate)}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{formatDate(project.endDate)}</TableCell>
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

            <AddProjectModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchProjects}
            />
        </>
    );
}