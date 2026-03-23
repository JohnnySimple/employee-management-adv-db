"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import api from "@/lib/api";

const schema = z.object({
  projectName: z.string().min(2),
  location: z.string().min(2),
  startDate: z.string(),
  endDate: z.string()
});

export function ProjectFormModal({ open, onClose, refresh, project }: any) {
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: project || {}
  });

  const onSubmit = async (data: any) => {
    if (project) {
      await api.patch(`/project/${project.projectId}`, data);
    } else {
      await api.post(`/project`, data);
    }

    refresh();
    onClose();
    reset();
  };

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/40 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white p-6 rounded-lg w-[400px] space-y-4"
      >
        <h2 className="font-bold text-lg">
          {project ? "Edit Project" : "Create Project"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input placeholder="Project Name" {...register("projectName")} />
          <Input placeholder="Location" {...register("location")} />
          <Input type="date" {...register("startDate")} />
          <Input type="date" {...register("endDate")} />

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}