/**
 * ProjectList Component
 * ---------------------------------------------------------------------------
 * Displays a list of user projects with options to edit and delete.
 */

import React from "react";
import { Card, Button } from "@/components/ui";
import { useAppWithToast } from "@/hooks/useAppWithToast";
import type { Project } from "@/types";

interface ProjectListProps {
  onEditProject: (project: Project) => void;
  onCreateProject: () => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  onEditProject,
  onCreateProject,
}) => {
  const { projects, deleteProject, isLoading } = useAppWithToast();

  const handleDeleteProject = async (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    ) {
      try {
        await deleteProject(id);
      } catch (error) {
        console.error("Failed to delete project:", error);
      }
    }
  };

  if (projects.length === 0) {
    return (
      <Card className="col-span-full" padding="none">
        <div className="text-center py-12 bg-bg text-text p-6">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No projects yet
          </h3>
          <p className="text-gray-500 mb-4">
            Create your first project to organize your time entries.
          </p>
          <Button onClick={onCreateProject}>Create Project</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {projects.map((project) => (
        <Card key={project.id} className="relative" hover padding="none">
          <div className="space-y-4 bg-bg text-text p-6">
            <div className="flex items-center space-x-3">
              <div
                className="w-5 h-5 rounded-full flex-shrink-0 shadow-sm"
                style={{ backgroundColor: project.color }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold  truncate">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditProject(project)}
                disabled={isLoading}
                className="flex-1 justify-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteProject(project.id)}
                disabled={isLoading}
                className="flex-1 justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProjectList;
