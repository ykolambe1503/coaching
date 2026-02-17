import type { OrganizationStatus } from '../../types/organization';

interface StatusBadgeProps {
    status: OrganizationStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const getStatusStyles = () => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'SUSPENDED':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles()}`}
        >
            {status}
        </span>
    );
}
