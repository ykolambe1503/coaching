import { useState } from 'react';
import { Plus, Building2, Users, LayoutDashboard, Settings, LogOut, Menu, X, ArrowUpRight, CheckCircle, Clock } from 'lucide-react';
import { useOrganizations } from '../hooks/useOrganizations';
import OrganizationTable from '../components/dashboard/OrganizationTable';
import CreateOrgModal from '../components/dashboard/CreateOrgModal';
import OrgDetailView from '../components/dashboard/OrgDetailView';
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

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-900/20">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">AdminPortal</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 space-y-2 py-4">
                        <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary-600/10 text-primary-400 rounded-xl font-medium transition-all group">
                            <LayoutDashboard className="w-5 h-5" />
                            Dashboard
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-all group">
                            <Building2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Organizations
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-all group">
                            <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                            App Settings
                        </button>
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-slate-800">
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl font-medium transition-all group">
                            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Topbar */}
                <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 lg:hidden text-slate-500 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Global Overview</h1>
                            <p className="text-sm text-gray-500">System metrics and organization management</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary-600/20 transition-all hover:-translate-y-0.5"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="hidden sm:inline">Add Organization</span>
                        </button>
                    </div>
                </header>

                {/* Content Container */}
                <main className="flex-1 overflow-y-auto p-8">
                    {/* Stats Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {/* Stat Card 1 */}
                        <div className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-4 bg-primary-50 text-primary-600 rounded-2xl group-hover:scale-110 transition-transform">
                                    <Building2 className="w-7 h-7" />
                                </div>
                                <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold">
                                    <ArrowUpRight className="w-3 h-3" />
                                    12%
                                </span>
                            </div>
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Organizations</p>
                            <p className="text-4xl font-extrabold text-gray-900">{organizations.length}</p>
                        </div>

                        {/* Stat Card 2 */}
                        <div className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-4 bg-green-50 text-green-600 rounded-2xl group-hover:scale-110 transition-transform">
                                    <CheckCircle className="w-7 h-7" />
                                </div>
                                <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold">
                                    Online
                                </span>
                            </div>
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Active Orgs</p>
                            <p className="text-4xl font-extrabold text-gray-900">
                                {organizations.filter((org) => org.status === 'ACTIVE').length}
                            </p>
                        </div>

                        {/* Stat Card 3 */}
                        <div className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                                    <Users className="w-7 h-7" />
                                </div>
                                <div className="h-2 w-16 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[75%]" />
                                </div>
                            </div>
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Batches</p>
                            <p className="text-4xl font-extrabold text-gray-900">
                                {organizations.reduce((sum, org) => sum + org.batchCount, 0)}
                            </p>
                        </div>
                    </div>

                    {/* Page Content Table Area */}
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                Organization Directory
                                <span className="px-2 py-0.5 bg-gray-100 rounded-md text-xs font-medium text-gray-500">{organizations.length} Total</span>
                            </h2>
                        </div>

                        {loading ? (
                            <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 border-dashed">
                                <div className="inline-block animate-spin rounded-full h-14 w-14 border-[4px] border-primary-100 border-t-primary-600 mb-6"></div>
                                <p className="text-gray-500 font-medium text-lg">Optimizing your view...</p>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 p-8 rounded-3xl border border-red-100 text-center">
                                <p className="text-red-700 font-bold mb-4">Connection interrupted</p>
                                <p className="text-red-600/80 mb-6">{error}</p>
                                <button
                                    onClick={refetch}
                                    className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                                >
                                    Retry Connection
                                </button>
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                <OrganizationTable
                                    organizations={organizations}
                                    onViewDetails={handleViewDetails}
                                />
                            </div>
                        )}
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

