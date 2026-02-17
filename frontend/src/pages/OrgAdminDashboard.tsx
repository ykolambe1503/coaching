import { useState } from 'react';
import { Users, UserPlus, Mail } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import UserTable from '../components/org-admin/UserTable';
import CreateUserModal from '../components/org-admin/CreateUserModal';
import EditUserModal from '../components/org-admin/EditUserModal';
import InviteUserModal from '../components/org-admin/InviteUserModal';
import userManagementService from '../services/userManagementService';
import type { User } from '../types/user';

export default function OrgAdminDashboard() {
    const [activeTab, setActiveTab] = useState<'FACULTY' | 'STUDENT'>('FACULTY');
    const { users: faculty, loading: loadingFaculty, refetch: refetchFaculty } = useUsers('FACULTY');
    const { users: students, loading: loadingStudents, refetch: refetchStudents } = useUsers('STUDENT');

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const currentUsers = activeTab === 'FACULTY' ? faculty : students;
    const loading = activeTab === 'FACULTY' ? loadingFaculty : loadingStudents;

    const handleRefetch = () => {
        refetchFaculty();
        refetchStudents();
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (userId: string) => {
        try {
            await userManagementService.deleteUser(userId);
            handleRefetch();
        } catch (error) {
            alert('Failed to delete user');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Users className="w-8 h-8 text-primary-600" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                                <p className="text-sm text-gray-500">Manage faculty and students</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsInviteModalOpen(true)}
                                className="btn-secondary flex items-center gap-2"
                            >
                                <Mail className="w-4 h-4" />
                                Invite User
                            </button>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="btn-primary flex items-center gap-2"
                            >
                                <UserPlus className="w-4 h-4" />
                                Create User
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Faculty</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{faculty.length}</p>
                            </div>
                            <div className="p-3 bg-primary-100 rounded-lg">
                                <Users className="w-8 h-8 text-primary-600" />
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Students</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{students.length}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Users className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="card">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveTab('FACULTY')}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'FACULTY'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Faculty ({faculty.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('STUDENT')}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'STUDENT'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Students ({students.length})
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                                <p className="text-gray-600">Loading users...</p>
                            </div>
                        ) : (
                            <UserTable
                                users={currentUsers}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        )}
                    </div>
                </div>
            </main>

            {/* Modals */}
            <CreateUserModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleRefetch}
                roleType={activeTab}
            />

            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedUser(null);
                }}
                onSuccess={handleRefetch}
                user={selectedUser}
            />

            <InviteUserModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onSuccess={handleRefetch}
                roleFilter={activeTab}
            />
        </div>
    );
}
