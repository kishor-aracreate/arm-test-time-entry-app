/**
 * ProjectForm Component
 * ---------------------------------------------------------------------------
 * Form for creating and editing projects with color picker and validation.
 */

import React, { useState } from "react";
import { Card, Button, Input } from "@/components/ui";
import { useAppWithToast } from "@/hooks/useAppWithToast";
import type { Project, CreateProjectData } from "@/store/types";

interface ProjectFormProps {
  project?: Project | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const DEFAULT_COLORS = [
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#F97316", // Orange
  "#6B7280", // Gray
];

const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  onClose,
  onSuccess,
}) => {
  const { createProject, updateProject, isLoading, error } = useAppWithToast();
  const [formData, setFormData] = useState<CreateProjectData>(() => ({
    name: project?.name || "",
    color: project?.color || DEFAULT_COLORS[0],
  }));
  const [formErrors, setFormErrors] = useState<{ name?: string }>({});

  const validateForm = (): boolean => {
    const errors: { name?: string } = {};

    if (!formData.name.trim()) {
      errors.name = "Project name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Project name must be at least 2 characters";
    } else if (formData.name.trim().length > 50) {
      errors.name = "Project name must be less than 50 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (project) {
        await updateProject(project.id, formData);
      } else {
        await createProject(formData);
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to save project:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleColorSelect = (color: string) => {
    setFormData((prev) => ({ ...prev, color }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card
        className="w-full max-w-md max-h-[90vh] overflow-y-auto"
        padding="none"
      >
        <form onSubmit={handleSubmit} className="space-y-6 bg-bg text-text p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {project ? "Edit Project" : "Create Project"}
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className=" hover:text-gray-600 p-1"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="text-text">
            <Input
              label="Project Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={formErrors.name}
              placeholder="Enter project name"
              disabled={isLoading}
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium  mb-3">
              Project Color
            </label>
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {DEFAULT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`
                                        w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-200 shadow-sm
                                        ${
                                          formData.color === color
                                            ? "border-gray-900 scale-110 shadow-md"
                                            : "border-gray-300 hover:border-gray-400 hover:scale-105"
                                        }
                                    `}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                  disabled={isLoading}
                />
              ))}
            </div>
            <div className="mt-4 flex items-center space-x-3">
              <label className="text-sm font-medium">Custom:</label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => handleColorSelect(e.target.value)}
                disabled={isLoading}
                className="h-8 w-16 rounded border border-gray-300 cursor-pointer disabled:cursor-not-allowed"
              />
              <span className="text-sm text-gray-500 font-mono">
                {formData.color}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 ">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {project ? "Update Project" : "Create Project"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProjectForm;
