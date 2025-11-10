import { ProjectRepository } from '../repositories/project.repository';
import { ProjectModel } from '../models/project.model';
import {
    Project,
    CreateProjectData,
    UpdateProjectData
} from '../../types';

export class ProjectService {
    private projectRepository: ProjectRepository;

    constructor() {
        this.projectRepository = new ProjectRepository();
    }

    /**
     * Create a new project for a user
     */
    async createProject(userId: string, projectData: CreateProjectData): Promise<Project> {
        // Validate project data
        const validation = ProjectModel.validateCreateData(projectData);
        if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }

        // Create project
        const project = await this.projectRepository.create(userId, projectData);
        return project;
    }

    /**
     * Get all projects for a user
     */
    async getUserProjects(userId: string): Promise<Project[]> {
        return await this.projectRepository.findByUserId(userId);
    }

    /**
     * Get a specific project by ID (ensures user owns the project)
     */
    async getProjectById(projectId: number, userId: string): Promise<Project> {
        const project = await this.projectRepository.findByIdAndUserId(projectId, userId);
        if (!project) {
            throw new Error('Project not found or access denied');
        }
        return project;
    }

    /**
     * Update a project (ensures user owns the project)
     */
    async updateProject(projectId: number, userId: string, updates: UpdateProjectData): Promise<Project> {
        // Validate update data
        const validation = ProjectModel.validateUpdateData(updates);
        if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }

        // Check if there are any actual updates
        if (Object.keys(updates).length === 0) {
            return await this.getProjectById(projectId, userId);
        }

        // Update project
        const updatedProject = await this.projectRepository.update(projectId, userId, updates);
        if (!updatedProject) {
            throw new Error('Project not found or access denied');
        }

        return updatedProject;
    }

    /**
     * Delete a project (ensures user owns the project)
     */
    async deleteProject(projectId: number, userId: string): Promise<void> {
        const success = await this.projectRepository.delete(projectId, userId);
        if (!success) {
            throw new Error('Project not found or access denied');
        }
    }

    /**
     * Check if a project exists and belongs to the user
     */
    async validateProjectAccess(projectId: number, userId: string): Promise<boolean> {
        return await this.projectRepository.exists(projectId, userId);
    }

    /**
     * Get project statistics for a user
     */
    async getProjectStats(userId: string): Promise<{ totalProjects: number }> {
        const totalProjects = await this.projectRepository.getCountByUserId(userId);
        return { totalProjects };
    }
}
