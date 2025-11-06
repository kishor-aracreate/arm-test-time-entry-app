import { pool } from '../../config/database';
import { User, UserWithPassword, CreateUserData, DatabaseUser } from '../../types';
import { UserModel } from '../models/user.model';

export class UserRepository {
    /**
     * Create a new user
     */
    async create(userData: CreateUserData, passwordHash: string): Promise<UserWithPassword> {
        const query = `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, password_hash, created_at
    `;

        const values = [userData.name, userData.email, passwordHash];

        try {
            const result = await pool.query<DatabaseUser>(query, values);
            if (result.rows.length === 0) {
                throw new Error('Failed to create user');
            }
            return UserModel.fromDatabase(result.rows[0]!);
        } catch (error: any) {
            if (error.code === '23505') { // Unique constraint violation
                throw new Error('User with this email already exists');
            }
            throw error;
        }
    }

    /**
     * Find user by email
     */
    async findByEmail(email: string): Promise<UserWithPassword | null> {
        const query = `
      SELECT id, name, email, password_hash, created_at
      FROM users
      WHERE email = $1
    `;

        const result = await pool.query<DatabaseUser>(query, [email]);

        if (result.rows.length === 0) {
            return null;
        }

        return UserModel.fromDatabase(result.rows[0]!);
    }

    /**
     * Find user by ID
     */
    async findById(id: number): Promise<UserWithPassword | null> {
        const query = `
      SELECT id, name, email, password_hash, created_at
      FROM users
      WHERE id = $1
    `;

        const result = await pool.query<DatabaseUser>(query, [id]);

        if (result.rows.length === 0) {
            return null;
        }

        return UserModel.fromDatabase(result.rows[0]!);
    }

    /**
     * Update user information
     */
    async update(id: number, updates: Partial<CreateUserData>): Promise<UserWithPassword | null> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (updates.name !== undefined) {
            fields.push(`name = $${paramCount}`);
            values.push(updates.name);
            paramCount++;
        }

        if (updates.email !== undefined) {
            fields.push(`email = $${paramCount}`);
            values.push(updates.email);
            paramCount++;
        }

        if (fields.length === 0) {
            return this.findById(id);
        }

        values.push(id);

        const query = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, name, email, password_hash, created_at
    `;

        try {
            const result = await pool.query<DatabaseUser>(query, values);

            if (result.rows.length === 0) {
                return null;
            }

            return UserModel.fromDatabase(result.rows[0]!);
        } catch (error: any) {
            if (error.code === '23505') { // Unique constraint violation
                throw new Error('User with this email already exists');
            }
            throw error;
        }
    }

    /**
     * Delete user by ID
     */
    async delete(id: number): Promise<boolean> {
        const query = `
      DELETE FROM users
      WHERE id = $1
    `;

        const result = await pool.query(query, [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    /**
     * Update user password
     */
    async updatePassword(id: number, passwordHash: string): Promise<boolean> {
        const query = `
      UPDATE users
      SET password_hash = $1
      WHERE id = $2
    `;

        const result = await pool.query(query, [passwordHash, id]);
        return result.rowCount !== null && result.rowCount > 0;
    }
}