import { pool } from '../../config/database';
import { Project, CreateProjectData, UpdateProjectData, DatabaseProject } from '../../types';
import { ProjectModel } from '../models/project.model';

export class ProjectRepository {
    /**
     * Create a new project for a user
     */
    async create(userId: string, projectData: CreateProjectData): Promise<Project> {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Ensure user exists (auto-create if not)
            await client.query(
                'INSERT INTO users (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING',
                [userId]
            );

            const query = `
                INSERT INTO projects (user_id, name, color)
                VALUES ($1, $2, $3)
                RETURNING id, user_id, name, color, created_at
            `;

            const values = [userId, projectData.name.trim(), projectData.color];

            const result = await client.query<DatabaseProject>(query, values);
            if (result.rows.length === 0) {
                throw new Error('Failed to create project');
            }

            await client.query('COMMIT');
            return ProjectModel.fromDatabase(result.rows[0]!);
        } catch (error: any) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Find all projects for a user
     */
    async findByUserId(userId: string): Promise<Project[]> {
        const query = `
            SELECT id, user_id, name, color, created_at
            FROM projects
            WHERE user_id = $1
            ORDER BY created_at DESC
        `;

        const result = await pool.query<DatabaseProject>(query, [userId]);
        return result.rows.map(row => ProjectModel.fromDatabase(row));
    }

    /**
     * Find project by ID and user ID (ensures user owns the project)
     */
    async findByIdAndUserId(id: number, userId: string): Promise<Project | null> {
        const query = `
            SELECT id, user_id, name, color, created_at
            FROM projects
            WHERE id = $1 AND user_id = $2
        `;

        const result = await pool.query<DatabaseProject>(query, [id, userId]);

        if (result.rows.length === 0) {
            return null;
        }

        return ProjectModel.fromDatabase(result.rows[0]!);
    }

    /**
     * Update project information
     */
    async update(id: number, userId: string, updates: UpdateProjectData): Promise<Project | null> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (updates.name !== undefined) {
            fields.push(`name = $${paramCount}`);
            values.push(updates.name.trim());
            paramCount++;
        }

        if (updates.color !== undefined) {
            fields.push(`color = $${paramCount}`);
            values.push(updates.color);
            paramCount++;
        }

        if (fields.length === 0) {
            return this.findByIdAndUserId(id, userId);
        }

        values.push(id, userId);

        const query = `
            UPDATE projects
            SET ${fields.join(', ')}
            WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
            RETURNING id, user_id, name, color, created_at
        `;

        try {
            const result = await pool.query<DatabaseProject>(query, values);

            if (result.rows.length === 0) {
                return null;
            }

            return ProjectModel.fromDatabase(result.rows[0]!);
        } catch (error: any) {
            throw error;
        }
    }

    /**
     * Delete project by ID and user ID (ensures user owns the project)
     */
    async delete(id: number, userId: string): Promise<boolean> {
        const query = `
            DELETE FROM projects
            WHERE id = $1 AND user_id = $2
        `;

        const result = await pool.query(query, [id, userId]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    /**
     * Check if project exists and belongs to user
     */
    async exists(id: number, userId: string): Promise<boolean> {
        const query = `
            SELECT 1
            FROM projects
            WHERE id = $1 AND user_id = $2
        `;

        const result = await pool.query(query, [id, userId]);
        return result.rows.length > 0;
    }

    /**
     * Get project count for a user
     */
    async getCountByUserId(userId: string): Promise<number> {
        const query = `
            SELECT COUNT(*) as count
            FROM projects
            WHERE user_id = $1
        `;

        const result = await pool.query<{ count: string }>(query, [userId]);
        return parseInt(result.rows[0]?.count || '0', 10);
    }
}
