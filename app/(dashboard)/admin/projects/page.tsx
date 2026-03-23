"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectTable } from "@/components/admin/ProjectTable";
import { ProjectStatusChart } from "@/components/admin/ProjectStatusChart";
import { ProjectFormModal } from "@/components/admin/ProjectFormModel";

export default function projectPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchProjects = async () => {
    const res = await api.get(`/project?status=${filter}`);
    setProjects(res.data);
  };

  useEffect(() => {
    fetchProjects();
  }, [filter]);

  const filteredProjects = projects.filter(p =>
    p.projectName.toLowerCase().includes(search.toLowerCase())
  );

  const active = filteredProjects.filter(p => p.status === "ACTIVE").length;
  const inactive = filteredProjects.filter(p => p.status === "INACTIVE").length;

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-sm"
        />

        <Button onClick={() => setModalOpen(true)}>
          Create Project
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4">Total: {filteredProjects.length}</CardContent></Card>
        <Card><CardContent className="p-4">Active: {active}</CardContent></Card>
        <Card><CardContent className="p-4">Inactive: {inactive}</CardContent></Card>
      </div>

      {/* Main */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[400px]">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Projects</CardTitle>
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="border px-2 py-1 rounded text-sm"
              >
                <option value="ALL">All</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </CardHeader>

            <CardContent>
              <ProjectTable
                projects={filteredProjects}
                refresh={fetchProjects}
                onSelect={setSelected}
              />
            </CardContent>
          </Card>
        </div>

        <div className="w-full sm:w-[300px]">
          <Card>
            <CardHeader><CardTitle>Status</CardTitle></CardHeader>
            <CardContent>
              <ProjectStatusChart data={{ active, inactive }} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal */}
      <ProjectFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        refresh={fetchProjects}
      />
    </div>
  );
}
