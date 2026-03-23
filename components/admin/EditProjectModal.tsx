"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Modal } from "../ui/modal";
import api from "@/lib/api";

export function EditProjectModal({ open, onClose, project, refresh }: any) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (project) setName(project.projectName);
  }, [project]);

  const handleSave = async () => {
    if (!name) return;
    try {
      await api.patch(`/project/${project.projectId}`, { projectName: name });
      refresh();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Edit Project</h2>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </Modal>
  );
}

export function ConfirmModal({ open, onClose, onConfirm, title, description }: any) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p>{description}</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Confirm</Button>
        </div>
      </div>
    </Modal>
  );
}