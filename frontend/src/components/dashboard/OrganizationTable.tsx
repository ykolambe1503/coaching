import { useState } from 'react';
import { Eye, Edit, Users } from 'lucide-react';
import type { Organization } from '../../types/organization';
import StatusBadge from './StatusBadge';

interface OrganizationTableProps {
    organizations: Organization[];
    onViewDetails: (org: Organization) => void;
    onEdit?: (org: Organization) => void;
}

export default function OrganizationTable({
    organizations,
    onViewDetails,
    onEdit,
}: OrganizationTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filteredOrganizations = organizations.filter((org) => {
        const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            org.adminName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || org.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="card p-6">
            {/* Header with filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search organizations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>
                <div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="SUSPENDED">Suspended</option>
                        <option value="PENDING">Pending</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Organization
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Admin Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Batches
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrganizations.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                    No organizations found
                                </td>
                            </tr>
                        ) : (
                            filteredOrganizations.map((org) => (
                                <tr
                                    key={org.orgId}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                    onClick={() => onViewDetails(org)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{org.name}</div>
                                        <div className="text-sm text-gray-500">{org.description}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{org.adminName}</div>
                                        <div className="text-sm text-gray-500">{org.adminEmail}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={org.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-sm text-gray-900">
                                            <Users className="w-4 h-4 mr-1 text-gray-400" />
                                            {org.batchCount}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(org.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onViewDetails(org);
                                            }}
                                            className="text-primary-600 hover:text-primary-900 mr-4"
                                            title="View Details"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                        {onEdit && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEdit(org);
                                                }}
                                                className="text-gray-600 hover:text-gray-900"
                                                title="Edit"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-gray-500">
                Showing {filteredOrganizations.length} of {organizations.length} organizations
            </div>
        </div>
    );
}
