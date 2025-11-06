import { UserRepository } from '../repositories/user.repository';
import { UserModel } from '../models/user.model';
import { PasswordUtils } from '../../utils/password';
import { JWTUtils } from '../../utils/jwt';
import {
    CreateUserData,
    LoginCredentials,
    AuthResponse,
    User,
    UserWithPassword,
    JWTPayload
} from '../../types';

export class AuthService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    /**
     * Register a new user
     */
    async signup(userData: CreateUserData): Promise<AuthResponse> {
        // Validate user data
        const validation = UserModel.validateCreateData(userData);
        if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }

        // Validate password strength
        const passwordValidation = PasswordUtils.validatePassword(userData.password);
        if (!passwordValidation.isValid) {
            throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
        }

        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Hash password
        const passwordHash = await PasswordUtils.hash(userData.password);

        // Create user
        const userWithPassword = await this.userRepository.create(userData, passwordHash);
        const user = UserModel.toPublic(userWithPassword);

        // Generate JWT token
        const payload: JWTPayload = {
            userId: user.id,
            email: user.email
        };
        const token = JWTUtils.generateToken(payload);

        return {
            user,
            token
        };
    }

    /**
     * Authenticate user login
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        // Validate input
        if (!credentials.email || !credentials.password) {
            throw new Error('Email and password are required');
        }

        // Find user by email
        const userWithPassword = await this.userRepository.findByEmail(credentials.email);
        if (!userWithPassword) {
            throw new Error('Invalid email or password');
        }

        // Verify password
        const isPasswordValid = await PasswordUtils.compare(credentials.password, userWithPassword.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        // Convert to public user format
        const user = UserModel.toPublic(userWithPassword);

        // Generate JWT token
        const payload: JWTPayload = {
            userId: user.id,
            email: user.email
        };
        const token = JWTUtils.generateToken(payload);

        return {
            user,
            token
        };
    }

    /**
     * Get user profile by ID
     */
    async getProfile(userId: number): Promise<User> {
        const userWithPassword = await this.userRepository.findById(userId);
        if (!userWithPassword) {
            throw new Error('User not found');
        }

        return UserModel.toPublic(userWithPassword);
    }

    /**
     * Update user profile
     */
    async updateProfile(userId: number, updates: Partial<CreateUserData>): Promise<User> {
        // Remove password from updates if present (use separate method for password updates)
        const { password, ...profileUpdates } = updates;

        if (Object.keys(profileUpdates).length === 0) {
            return this.getProfile(userId);
        }

        // Validate updates
        if (profileUpdates.name !== undefined) {
            if (!profileUpdates.name || typeof profileUpdates.name !== 'string' || profileUpdates.name.trim().length === 0) {
                throw new Error('Name must be a non-empty string');
            }
        }

        if (profileUpdates.email !== undefined) {
            if (!profileUpdates.email || typeof profileUpdates.email !== 'string') {
                throw new Error('Email must be a valid string');
            }
            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(profileUpdates.email)) {
                throw new Error('Email must be a valid email address');
            }
        }

        const updatedUserWithPassword = await this.userRepository.update(userId, profileUpdates);
        if (!updatedUserWithPassword) {
            throw new Error('User not found');
        }

        return UserModel.toPublic(updatedUserWithPassword);
    }

    /**
     * Change user password
     */
    async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
        // Get user with password
        const userWithPassword = await this.userRepository.findById(userId);
        if (!userWithPassword) {
            throw new Error('User not found');
        }

        // Verify current password
        const isCurrentPasswordValid = await PasswordUtils.compare(currentPassword, userWithPassword.passwordHash);
        if (!isCurrentPasswordValid) {
            throw new Error('Current password is incorrect');
        }

        // Validate new password
        const passwordValidation = PasswordUtils.validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
        }

        // Hash new password
        const newPasswordHash = await PasswordUtils.hash(newPassword);

        // Update password
        const success = await this.userRepository.updatePassword(userId, newPasswordHash);
        if (!success) {
            throw new Error('Failed to update password');
        }
    }

    /**
     * Verify JWT token and return user info
     */
    async verifyToken(token: string): Promise<User> {
        const payload = JWTUtils.verifyToken(token);
        return this.getProfile(payload.userId);
    }
}