import bcrypt from 'bcryptjs';
import { prisma } from './prisma'; // Assuming you have a prisma client instance exported from here
import { Role } from '@prisma/client';

export type { Role };
export type User = {
    id: string;
    email: string;
    passwordHash: string;
    name: string | null;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
};

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
        const user = await prisma.user.findUnique({
            where: { email },
        });
        return user;
    } catch (error) {
        console.error('Error getting user by email:', error);
        return null;
    }
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<User | null> {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
        });
        return user;
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
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                name,
                role: 'USER',
            },
        });
        return user;
    } catch (error) {
        console.error('Error creating user:', error);
        return null;
    }
}

/**
 * Update user role
 */
export async function updateUserRole(userId: string, role: Role): Promise<boolean> {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role },
        });
        return true;
    } catch (error) {
        console.error('Error updating user role:', error);
        return false;
    }
}

/**
 * Delete user
 */
export async function deleteUser(userId: string): Promise<boolean> {
    try {
        await prisma.user.delete({
            where: { id: userId },
        });
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
        return await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
        });
    } catch (error) {
        console.error('Error getting all users:', error);
        return [];
    }
}

/**
 * Update user password
 */
export async function updateUserPassword(userId: string, newPassword: string): Promise<boolean> {
    try {
        const passwordHash = await hashPassword(newPassword);
        await prisma.user.update({
            where: { id: userId },
            data: { passwordHash },
        });
        return true;
    } catch (error) {
        console.error('Error updating password:', error);
        return false;
    }
}
