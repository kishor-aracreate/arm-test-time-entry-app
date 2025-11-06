import { User, UserWithPassword, DatabaseUser } from '../../types';

export class UserModel {
    /**
     * Convert database user record to User interface
     */
    static fromDatabase(dbUser: DatabaseUser): UserWithPassword {
        return {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            passwordHash: dbUser.password_hash,
            createdAt: dbUser.created_at
        };
    }

    /**
     * Convert User to public format (without password hash)
     */
    static toPublic(user: UserWithPassword): User {
        const { passwordHash, ...publicUser } = user;
        return publicUser;
    }

    /**
     * Validate user data for creation
     */
    static validateCreateData(data: any): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
            errors.push('Name is required and must be a non-empty string');
        }

        if (!data.email || typeof data.email !== 'string') {
            errors.push('Email is required and must be a string');
        } else if (!this.isValidEmail(data.email)) {
            errors.push('Email must be a valid email address');
        }

        if (!data.password || typeof data.password !== 'string') {
            errors.push('Password is required and must be a string');
        } else if (data.password.length < 6) {
            errors.push('Password must be at least 6 characters long');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate email format
     */
    private static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}