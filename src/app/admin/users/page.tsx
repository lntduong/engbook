'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Shield, Trash2, ArrowLeft, UserCheck, User } from 'lucide-react';

interface User {
    id: number;
    email: string;
    name: string | null;
    role: 'ADMIN' | 'USER';
    created_at: string;
}

export default function AdminUsersPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
            router.push('/');
        } else if (status === 'authenticated') {
            fetchUsers();
        }
    }, [status, session, router]);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: number, newRole: 'ADMIN' | 'USER') => {
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role: newRole }),
            });

            if (res.ok) {
                fetchUsers();
            } else {
                alert('Failed to update user role');
            }
        } catch (error) {
            console.error('Failed to update role:', error);
            alert('An error occurred');
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const res = await fetch(`/api/admin/users?userId=${userId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchUsers();
            } else {
                alert('Failed to delete user');
            }
        } catch (error) {
            console.error('Failed to delete user:', error);
            alert('An error occurred');
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push('/')}
                            className="hover:bg-white/50"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                <Shield className="text-purple-600" size={32} />
                                Admin Dashboard
                            </h1>
                            <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/50 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Users</p>
                                <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                            </div>
                            <User className="text-blue-600" size={40} />
                        </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/50 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Admins</p>
                                <p className="text-3xl font-bold text-purple-600">
                                    {users.filter(u => u.role === 'ADMIN').length}
                                </p>
                            </div>
                            <Shield className="text-purple-600" size={40} />
                        </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/50 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Regular Users</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {users.filter(u => u.role === 'USER').length}
                                </p>
                            </div>
                            <UserCheck className="text-green-600" size={40} />
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-white/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-purple-100 to-blue-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Joined</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-purple-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold">
                                                    {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                                                </div>
                                                <span className="font-medium text-gray-900">
                                                    {user.name || 'No name'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value as 'ADMIN' | 'USER')}
                                                disabled={user.id.toString() === session?.user?.id}
                                                className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${user.role === 'ADMIN'
                                                    ? 'bg-purple-100 text-purple-700 border-purple-300'
                                                    : 'bg-green-100 text-green-700 border-green-300'
                                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                <option value="USER">USER</option>
                                                <option value="ADMIN">ADMIN</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 text-sm">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteUser(user.id)}
                                                disabled={user.id.toString() === session?.user?.id}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Info */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        <strong>Note:</strong> You cannot change your own role or delete your own account.
                        New users register with USER role by default. Only ADMINs can manage content (Add/Edit/Delete).
                    </p>
                </div>
            </main>
        </div>
    );
}
