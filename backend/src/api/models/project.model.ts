import { Project, CreateProjectData, UpdateProjectData, DatabaseProject } from '../../types';

export class ProjectModel {
    /**
     * Convert database project record to Project interface
     */
    static fromDatabase(dbProject: DatabaseProject): Project {
        return {
            id: dbProject.id,
            userId: dbProject.user_id,
            name: dbProject.name,
            color: dbProject.color,
            createdAt: dbProject.created_at
        };
    }

    /**
     * Validate project data for creation
     */
    static validateCreateData(data: any): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
            errors.push('Name is required and must be a non-empty string');
        }

        if (!data.color || typeof data.color !== 'string') {
            errors.push('Color is required and must be a string');
        } else if (!this.isValidHexColor(data.color)) {
            errors.push('Color must be a valid hex color code (e.g., #FF5733)');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate project data for update
     */
    static validateUpdateData(data: any): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (data.name !== undefined) {
            if (typeof data.name !== 'string' || data.name.trim().length === 0) {
                errors.push('Name must be a non-empty string');
            }
        }

        if (data.color !== undefined) {
            if (typeof data.color !== 'string') {
                errors.push('Color must be a string');
            } else if (!this.isValidHexColor(data.color)) {
                errors.push('Color must be a valid hex color code (e.g., #FF5733)');
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate hex color format
     */
    private static isValidHexColor(color: string): boolean {
        const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
        return hexColorRegex.test(color);
    }
}