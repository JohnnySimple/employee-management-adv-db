"use client";

import { motion } from "framer-motion";
import api from "@/lib/api";
import { Button } from "../ui/button";
import { Edit, Trash2 } from "lucide-react"; // For modern icons

export function ProjectTable({ projects, refresh }: any) {
  const handleDeactivate = async (id: number) => {
    try {
      await api.delete(`/project/${id}`);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (id: number) => {
    const newName = prompt("Enter new project name");
    if (!newName) return;

    try {
      await api.patch(`/project/${id}`, { projectName: newName });
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b text-muted-foreground">
            <th className="py-2">Project</th>
            <th>Location</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((p: any, index: number) => {
            const daysRemaining = Math.ceil(
              (new Date(p.endDate).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            );

            return (
              <motion.tr
                key={p.projectId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b hover:bg-gray-50"
              >
                <td className="py-2 font-medium">{p.projectName}</td>
                <td>{p.location}</td>
                <td>{new Date(p.startDate).toLocaleDateString()}</td>
                <td>
                  {new Date(p.endDate).toLocaleDateString()}
                  <div className="text-xs text-muted-foreground">
                    {daysRemaining >= 0
                      ? `${daysRemaining} days left`
                      : "Completed"}
                  </div>
                </td>

                <td>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      p.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>

                <td className="flex space-x-2">
                  {/* Modern Edit Button */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={() => handleEdit(p.projectId)}
                  >
                    <Edit size={16} /> Edit
                  </Button>

                  {/* Modern Deactivate Button */}
                  {p.status === "ACTIVE" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex items-center gap-1"
                      onClick={() => handleDeactivate(p.projectId)}
                    >
                      <Trash2 size={16} /> Deactivate
                    </Button>
                  )}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>

      {projects.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          No projects found
        </div>
      )}
    </div>
  );
}