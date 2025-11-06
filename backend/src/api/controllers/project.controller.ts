import { Request, Response } from 'express';
import { ProjectService } from '../services/project.service';
import { CreateProjectData, UpdateProjectData, ApiResponse, Project } from '../../types';

export class ProjectController {
    private projectService: ProjectService;

    constructor() {
        this.projectService = new ProjectService();
    }

    /**
     * GET /api/projects
     * Get all projects for the authenticated user
     */
    getProjects = async (req: Request, res: Response<ApiResponse<Project[]>>): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: {
                        message: 'Authentication required',
                        code: 'AUTH_REQUIRED'
                    }
                });
                return;
            }

            const projects = await this.projectService.getUserProjects(req.user.id);

            res.status(200).json({
                success: true,
                data: projects
            });
        } catch (error: any) {
            console.error('Get projects error:', error);

            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to fetch projects',
                    code: 'FETCH_PROJECTS_ERROR',
                    details: error.message
                }
            });
        }
    };

    /**
     * POST /api/projects
     * Create a new project
     */
    createProject = async (req: Request, res: Response<ApiResponse<Project>>): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: {
                        message: 'Authentication required',
                        code: 'AUTH_REQUIRED'
                    }
                });
                return;
            }

            const projectData: CreateProjectData = req.body;

            const project = await this.projectService.createProject(req.user.id, projectData);

            res.status(201).json({
                success: true,
                data: project
            });
        } catch (error: any) {
            console.error('Create project error:', error);

            if (error.message.includes('Validation failed')) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: error.message,
                        code: 'VALIDATION_ERROR'
                    }
                });
                return;
            }

            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to create project',
                    code: 'CREATE_PROJECT_ERROR',
                    details: error.message
                }
            });
        }
    };

    /**
     * GET /api/projects/:id
     * Get a specific project by ID
     */
    getProject = async (req: Request, res: Response<ApiResponse<Project>>): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: {
                        message: 'Authentication required',
                        code: 'AUTH_REQUIRED'
                    }
                });
                return;
            }

            const projectIdParam = req.params.id;
            if (!projectIdParam) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'Project ID is required',
                        code: 'MISSING_PROJECT_ID'
                    }
                });
                return;
            }

            const projectId = parseInt(projectIdParam, 10);
            if (isNaN(projectId)) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'Invalid project ID',
                        code: 'INVALID_PROJECT_ID'
                    }
                });
                return;
            }

            const project = await this.projectService.getProjectById(projectId, req.user.id);

            res.status(200).json({
                success: true,
                data: project
            });
        } catch (error: any) {
            console.error('Get project error:', error);

            if (error.message.includes('not found') || error.message.includes('access denied')) {
                res.status(404).json({
                    success: false,
                    error: {
                        message: 'Project not found',
                        code: 'PROJECT_NOT_FOUND'
                    }
                });
                return;
            }

            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to fetch project',
                    code: 'FETCH_PROJECT_ERROR',
                    details: error.message
                }
            });
        }
    };

    /**
     * PUT /api/projects/:id
     * Update a project
     */
    updateProject = async (req: Request, res: Response<ApiResponse<Project>>): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: {
                        message: 'Authentication required',
                        code: 'AUTH_REQUIRED'
                    }
                });
                return;
            }

            const projectIdParam = req.params.id;
            if (!projectIdParam) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'Project ID is required',
                        code: 'MISSING_PROJECT_ID'
                    }
                });
                return;
            }

            const projectId = parseInt(projectIdParam, 10);
            if (isNaN(projectId)) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'Invalid project ID',
                        code: 'INVALID_PROJECT_ID'
                    }
                });
                return;
            }

            const updates: UpdateProjectData = req.body;

            const project = await this.projectService.updateProject(projectId, req.user.id, updates);

            res.status(200).json({
                success: true,
                data: project
            });
        } catch (error: any) {
            console.error('Update project error:', error);

            if (error.message.includes('not found') || error.message.includes('access denied')) {
                res.status(404).json({
                    success: false,
                    error: {
                        message: 'Project not found',
                        code: 'PROJECT_NOT_FOUND'
                    }
                });
                return;
            }

            if (error.message.includes('Validation failed')) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: error.message,
                        code: 'VALIDATION_ERROR'
                    }
                });
                return;
            }

            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to update project',
                    code: 'UPDATE_PROJECT_ERROR',
                    details: error.message
                }
            });
        }
    };

    /**
     * DELETE /api/projects/:id
     * Delete a project
     */
    deleteProject = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: {
                        message: 'Authentication required',
                        code: 'AUTH_REQUIRED'
                    }
                });
                return;
            }

            const projectIdParam = req.params.id;
            if (!projectIdParam) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'Project ID is required',
                        code: 'MISSING_PROJECT_ID'
                    }
                });
                return;
            }

            const projectId = parseInt(projectIdParam, 10);
            if (isNaN(projectId)) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'Invalid project ID',
                        code: 'INVALID_PROJECT_ID'
                    }
                });
                return;
            }

            await this.projectService.deleteProject(projectId, req.user.id);

            res.status(200).json({
                success: true,
                data: {
                    message: 'Project deleted successfully'
                }
            });
        } catch (error: any) {
            console.error('Delete project error:', error);

            if (error.message.includes('not found') || error.message.includes('access denied')) {
                res.status(404).json({
                    success: false,
                    error: {
                        message: 'Project not found',
                        code: 'PROJECT_NOT_FOUND'
                    }
                });
                return;
            }

            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to delete project',
                    code: 'DELETE_PROJECT_ERROR',
                    details: error.message
                }
            });
        }
    };
}