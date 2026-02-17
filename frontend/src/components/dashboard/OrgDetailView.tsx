import { useState } from 'react';
import { X, Building2, Mail, Phone, MapPin, Users, GraduationCap } from 'lucide-react';
import type { OrganizationStatus } from '../../types/organization';
import { useOrganizationDetail } from '../../hooks/useOrganizations';
import StatusBadge from './StatusBadge';
import organizationService from '../../services/organizationService';

interface OrgDetailViewProps {
    orgId: string | null;
    onClose: () => void;
    onUpdate: () => void;
}

export default function OrgDetailView({ orgId, onClose, onUpdate }: OrgDetailViewProps) {
    const { organization, loading, error } = useOrganizationDetail(orgId);
    const [updating, setUpdating] = useState(false);

    const handleStatusChange = async (newStatus: OrganizationStatus) => {
        if (!orgId) return;

        try {
            setUpdating(true);
            await organizationService.updateStatus(orgId, { status: newStatus });
            onUpdate();
        } catch (err) {
            alert('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    if (!orgId) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Organization Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                            <p className="mt-4 text-gray-600">Loading organization details...</p>
                        </div>
                    ) : error ? (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                            {error}
                        </div>
                    ) : organization ? (
                        <div className="space-y-6">
                            {/* Organization Info */}
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{organization.name}</h3>
                                        <p className="text-gray-600">{organization.description}</p>
                                    </div>
                                    <StatusBadge status={organization.status} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    {organization.address && (
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Address</p>
                                                <p className="text-sm text-gray-600">{organization.address}</p>
                                            </div>
                                        </div>
                                    )}
                                    {organization.phone && (
                                        <div className="flex items-start gap-3">
                                            <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Phone</p>
                                                <p className="text-sm text-gray-600">{organization.phone}</p>
                                            </div>
                                        </div>
                                    )}
                                    {organization.email && (
                                        <div className="flex items-start gap-3">
                                            <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Email</p>
                                                <p className="text-sm text-gray-600">{organization.email}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-3">
                                        <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Organization ID</p>
                                            <p className="text-sm text-gray-600 font-mono">{organization.orgId}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Admin Contact */}
                            <div className="border-t border-gray-200 pt-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Admin Contact</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Name</p>
                                        <p className="text-sm text-gray-900">{organization.adminContact.fullName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Username</p>
                                        <p className="text-sm text-gray-900">{organization.adminContact.username}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Email</p>
                                        <p className="text-sm text-gray-900">{organization.adminContact.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">User ID</p>
                                        <p className="text-sm text-gray-600 font-mono">{organization.adminContact.userId}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Batches */}
                            <div className="border-t border-gray-200 pt-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                    Batches ({organization.batches.length})
                                </h4>
                                {organization.batches.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No batches created yet</p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {organization.batches.map((batch) => (
                                            <div key={batch.batchId} className="card p-4">
                                                <h5 className="font-semibold text-gray-900 mb-2">{batch.name}</h5>
                                                <p className="text-sm text-gray-600 mb-3">{batch.description}</p>
                                                <div className="flex gap-4 text-sm text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <Users className="w-4 h-4" />
                                                        {batch.studentCount} Students
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <GraduationCap className="w-4 h-4" />
                                                        {batch.facultyCount} Faculty
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Status Management */}
                            <div className="border-t border-gray-200 pt-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Status Management</h4>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleStatusChange('ACTIVE' as OrganizationStatus)}
                                        disabled={updating || organization.status === 'ACTIVE'}
                                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Activate
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange('SUSPENDED' as OrganizationStatus)}
                                        disabled={updating || organization.status === 'SUSPENDED'}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Suspend
                                    </button>
                                </div>
                            </div>

                            {/* Metadata */}
                            <div className="border-t border-gray-200 pt-6">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Created</p>
                                        <p className="text-gray-900">{new Date(organization.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Last Updated</p>
                                        <p className="text-gray-900">{new Date(organization.updatedAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                    <button onClick={onClose} className="btn-secondary">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
