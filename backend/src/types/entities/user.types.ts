/**
 * User Entity Types
 * ---------------------------------------------------------------------------
 * Type definitions for user-related entities and operations.
 */

// Current schema (UUID-based, minimal user info)
export interface User {
    userId: string; // UUID
    createdAt: Date;
}

export interface CreateUserData {
    userId: string; // UUID
}

export interface DatabaseUser {
    user_id: string; // UUID
    created_at: Date;
}

// Legacy types (for backward compatibility with existing code)
// TODO: Remove these once user authentication is fully migrated to UUID-only
export interface LegacyUser {
    id: number;
    name: string;
    email: string;
    createdAt: Date;
}

export interface UserWithPassword extends LegacyUser {
    passwordHash: string;
}

export interface LegacyCreateUserData {
    name: string;
    email: string;
    password: string;
}

export interface LegacyDatabaseUser {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    created_at: Date;
}
