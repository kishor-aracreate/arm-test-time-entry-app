import bcrypt from 'bcrypt';

/**
 * Password hashing utilities using bcrypt
 */
export class PasswordUtils {
    private static readonly SALT_ROUNDS = 12;

    /**
     * Hash a plain text password
     */
    static async hash(password: string): Promise<string> {
        try {
            return await bcrypt.hash(password, this.SALT_ROUNDS);
        } catch (error) {
            throw new Error('Failed to hash password');
        }
    }

    /**
     * Compare a plain text password with a hashed password
     */
    static async compare(password: string, hashedPassword: string): Promise<boolean> {
        try {
            return await bcrypt.compare(password, hashedPassword);
        } catch (error) {
            throw new Error('Failed to compare passwords');
        }
    }

    /**
     * Validate password strength
     */
    static validatePassword(password: string): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!password || typeof password !== 'string') {
            errors.push('Password is required');
            return { isValid: false, errors };
        }

        if (password.length < 6) {
            errors.push('Password must be at least 6 characters long');
        }

        if (password.length > 128) {
            errors.push('Password must be less than 128 characters long');
        }

        // Check for at least one letter and one number
        if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
            errors.push('Password must contain at least one letter and one number');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}