/**
 * Projects Page
 * ---------------------------------------------------------------------------
 * Project management interface for creating, editing, and organizing projects.
 */

import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui';
import { ProjectList, ProjectForm } from '@/components/projects';
import { useAppStore } from '@/store';
import type { Project } from '@/types';

const Projects: React.FC = () => {
    const { fetchProjects, error, clearError } = useAppStore();
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    // Fetch projects on component mount
    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // Check for action=create query parameter
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('action') === 'create') {
            setShowForm(true);
            // Clean up URL
            window.history.replaceState({}, '', window.location.pathname + window.location.hash.split('?')[0]);
        }
    }, []);

    // Clear errors when component unmounts
    useEffect(() => {
        return () => {
            clearError();
        };
    }, [clearError]);

    const handleCreateProject = () => {
        setEditingProject(null);
        setShowForm(true);
    };

    const handleEditProject = (project: Project) => {
        setEditingProject(project);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingProject(null);
    };

    const handleFormSuccess = () => {
        // Refresh projects list after successful create/update
        fetchProjects();
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                    <Button onClick={handleCreateProject}>Add Project</Button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                            <div className="ml-auto pl-3">
                                <button
                                    type="button"
                                    className="text-red-400 hover:text-red-600"
                                    onClick={clearError}
                                >
                                    <span className="sr-only">Dismiss</span>
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <ProjectList
                    onEditProject={handleEditProject}
                    onCreateProject={handleCreateProject}
                />

                {showForm && (
                    <ProjectForm
                        project={editingProject}
                        onClose={handleCloseForm}
                        onSuccess={handleFormSuccess}
                    />
                )}
            </div>
        </Layout>
    );
};

export default Projects;