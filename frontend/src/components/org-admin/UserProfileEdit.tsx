import { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Key, Save } from 'lucide-react';
import type { User, UpdateUserRequest } from '../../types/user';
import userManagementService from '../../services/userManagementService';

interface UserProfileEditProps {
    userId: string;
}

export default function UserProfileEdit({ userId }: UserProfileEditProps) {
    const [user, setUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<UpdateUserRequest>({
        firstName: '',
        lastName: '',
        email: '',
        enabled: true,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchUser();
    }, [userId]);

    const fetchUser = async () => {
        try {
            setLoading(true);
            const data = await userManagementService.getUserById(userId);
            setUser(data);
            setFormData({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                enabled: data.enabled,
            });
        } catch (err) {
            setError('Failed to load user profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            await userManagementService.updateUser(userId, formData);
            setSuccess(true);
            await fetchUser();
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center text-red-600">
                    <p>Failed to load user profile</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-3">
                        <UserIcon className="w-8 h-8 text-primary-600" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
                            <p className="text-sm text-gray-500">Edit user information</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="card p-4 bg-red-50 border border-red-200">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="card p-4 bg-green-50 border border-green-200">
                            <p className="text-green-700">Profile updated successfully!</p>
                        </div>
                    )}

                    {/* Basic Information */}
                    <div className="card p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Information */}
                    <div className="card p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                                <input
                                    type="text"
                                    disabled
                                    value={user.username}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                />
                                <p className="mt-1 text-sm text-gray-500">Username cannot be changed</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-lg border border-primary-200">
                                    <Key className="w-4 h-4 text-primary-600" />
                                    <span className="font-medium text-primary-700">{user.role}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="enabled"
                                    checked={formData.enabled}
                                    onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                />
                                <label htmlFor="enabled" className="text-sm font-medium text-gray-700">
                                    Account Enabled
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Organization */}
                    <div className="card p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization</h2>
                        <div>
                            <p className="text-sm text-gray-500">Organization Name</p>
                            <p className="text-lg font-medium text-gray-900">{user.organizationName}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
