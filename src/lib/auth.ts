import bcrypt from 'bcryptjs';
import { sql } from './db';

export interface User {
    id: number;
    email: string;
    password_hash: string;
    name: string | null;
    role: 'ADMIN' | 'USER';
    created_at: Date;
    updated_at: Date;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
    try {
        const result = await sql<User>`
            SELECT * FROM users WHERE email = ${email} LIMIT 1
        `;
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error getting user by email:', error);
        return null;
    }
}

/**
 * Get user by ID
 */
export async function getUserById(id: number): Promise<User | null> {
    try {
        const result = await sql<User>`
            SELECT * FROM users WHERE id = ${id} LIMIT 1
        `;
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error getting user by ID:', error);
        return null;
    }
}

/**
 * Create a new user
 */
export async function createUser(
    email: string,
    password: string,
    name?: string
): Promise<User | null> {
    try {
        const passwordHash = await hashPassword(password);
        const result = await sql<User>`
            INSERT INTO users (email, password_hash, name, role)
            VALUES (${email}, ${passwordHash}, ${name || null}, 'USER')
            RETURNING *
        `;
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error creating user:', error);
        return null;
    }
}

/**
 * Update user role
 */
export async function updateUserRole(userId: number, role: 'ADMIN' | 'USER'): Promise<boolean> {
    try {
        await sql`
            UPDATE users 
            SET role = ${role}, updated_at = NOW()
            WHERE id = ${userId}
        `;
        return true;
    } catch (error) {
        console.error('Error updating user role:', error);
        return false;
    }
}

/**
 * Delete user
 */
export async function deleteUser(userId: number): Promise<boolean> {
    try {
        await sql`DELETE FROM users WHERE id = ${userId}`;
        return true;
    } catch (error) {
        console.error('Error deleting user:', error);
        return false;
    }
}

/**
 * Get all users (for admin dashboard)
 */
export async function getAllUsers(): Promise<User[]> {
    try {
        const result = await sql<User>`
            SELECT * FROM users ORDER BY created_at DESC
        `;
        return result.rows;
    } catch (error) {
        console.error('Error getting all users:', error);
        return [];
    }
}

/**
 * Update user password
 */
export async function updateUserPassword(userId: number, newPassword: string): Promise<boolean> {
    try {
        const passwordHash = await hashPassword(newPassword);
        await sql`
            UPDATE users 
            SET password_hash = ${passwordHash}, updated_at = NOW()
            WHERE id = ${userId}
        `;
        return true;
    } catch (error) {
        console.error('Error updating password:', error);
        return false;
    }
}
