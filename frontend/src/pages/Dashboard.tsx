import { useState } from 'react';
import { 
  Plus, 
  Building2, 
  Users, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  TrendingUp,
  CheckCircle, 
  Clock,
  AlertCircle
} from 'lucide-react';
import { useOrganizations } from '../hooks/useOrganizations';
import OrganizationTable from '../components/dashboard/OrganizationTable';
import CreateOrgModal from '../components/dashboard/CreateOrgModal';
import OrgDetailView from '../components/dashboard/OrgDetailView';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { StatsCard } from '../components/ui/StatsCard';
import { Sidebar, Navigation } from '../components/ui/Navigation';
import { LoadingSpinner, LoadingOverlay } from '../components/ui/LoadingSpinner';
import type { Organization } from '../types/organization';

export default function Dashboard() {
    const { organizations, loading, error, refetch } = useOrganizations();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleViewDetails = (org: Organization) => {
        setSelectedOrgId(org.orgId);
    };

    const handleCreateSuccess = () => {
        refetch();
    };

    const handleUpdateSuccess = () => {
        refetch();
    };

    const navigationItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            active: true,
        },
        {
            id: 'organizations',
            label: 'Organizations',
            icon: Building2,
            badge: organizations.length,
        },
        {
            id: 'settings',
            label: 'App Settings',
            icon: Settings,
        },
    ];

    const footerContent = (
        <Button
            variant="danger"
            className="w-full justify-start"
            icon={<LogOut className="w-5 h-5" />}
        >
            Sign Out
        </Button>
    );

    const stats = [
        {
            title: 'Total Organizations',
            value: organizations.length,
            icon: Building2,
            color: 'primary' as const,
            trend: {
                value: 12,
                label: 'vs last month',
                direction: 'up' as const,
            },
        },
        {
            title: 'Active Organizations',
            value: organizations.filter((org) => org.status === 'ACTIVE').length,
            icon: CheckCircle,
            color: 'success' as const,
            trend: {
                value: 8,
                label: 'vs last month',
                direction: 'up' as const,
            },
        },
        {
            title: 'Total Batches',
            value: organizations.reduce((sum, org) => sum + org.batchCount, 0),
            icon: Users,
            color: 'warning' as const,
            trend: {
                value: 15,
                label: 'vs last month',
                direction: 'up' as const,
            },
        },
        {
            title: 'Pending Reviews',
            value: organizations.filter((org) => org.status === 'PENDING').length,
            icon: Clock,
            color: 'neutral' as const,
            trend: {
                value: 3,
                label: 'vs last month',
                direction: 'down' as const,
            },
        },
    ];

    return (
        <div className="flex h-screen bg-neutral-50 overflow-hidden">
            {/* Sidebar */}
            <div className={`
                fixed lg:static inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <Sidebar
                    title="AdminPortal"
                    subtitle="System Management"
                    logo={
                        <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                            <Building2 className="w-7 h-7 text-white" />
                        </div>
                    }
                    navigation={navigationItems}
                    footer={footerContent}
                />
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white border-b border-neutral-200/50 flex items-center justify-between px-6 shrink-0 shadow-soft">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden"
                            icon={<Menu className="w-6 h-6" />}
                        />
                        <div>
                            <h1 className="text-3xl font-display font-bold text-neutral-900 tracking-tight">
                                Global Overview
                            </h1>
                            <p className="text-neutral-500 font-medium">
                                System metrics and organization management
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="shadow-glow hover:shadow-glow-lg"
                        icon={<Plus className="w-5 h-5" />}
                    >
                        <span className="hidden sm:inline">Add Organization</span>
                        <span className="sm:hidden">Add</span>
                    </Button>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="space-y-8 animate-in">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <div
                                    key={stat.title}
                                    className="animate-slide-up"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <StatsCard {...stat} />
                                </div>
                            ))}
                        </div>

                        {/* Organizations Section */}
                        <Card className="shadow-medium border-0">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl">Organization Directory</CardTitle>
                                        <CardDescription className="text-base">
                                            Manage and monitor all organizations in the system
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 bg-neutral-100 rounded-full text-sm font-semibold text-neutral-600">
                                            {organizations.length} Total
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <LoadingOverlay isLoading={loading} text="Loading organizations...">
                                    {error ? (
                                        <Card className="border-error-200 bg-error-50">
                                            <CardContent className="text-center py-12">
                                                <AlertCircle className="w-12 h-12 text-error-500 mx-auto mb-4" />
                                                <h3 className="text-lg font-semibold text-error-900 mb-2">
                                                    Connection Error
                                                </h3>
                                                <p className="text-error-700 mb-6">{error}</p>
                                                <Button
                                                    variant="danger"
                                                    onClick={refetch}
                                                    className="shadow-medium"
                                                >
                                                    Retry Connection
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <div className="rounded-2xl border border-neutral-200/50 overflow-hidden">
                                            <OrganizationTable
                                                organizations={organizations}
                                                onViewDetails={handleViewDetails}
                                            />
                                        </div>
                                    )}
                                </LoadingOverlay>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>

            {/* Modals */}
            <CreateOrgModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            <OrgDetailView
                orgId={selectedOrgId}
                onClose={() => setSelectedOrgId(null)}
                onUpdate={handleUpdateSuccess}
            />
        </div>
    );
}

