import React, { useState } from 'react';
import { Users, FileText, ClipboardCheck } from 'lucide-react';
import { MyBatches } from '../components/faculty/MyBatches';
import { ExamList } from '../components/faculty/ExamList';
import { EvaluationQueue } from '../components/faculty/EvaluationQueue';

type Tab = 'batches' | 'exams' | 'evaluation';

export const FacultyDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('batches');

    const tabs = [
        { id: 'batches' as Tab, label: 'My Batches', icon: Users },
        { id: 'exams' as Tab, label: 'Exams', icon: FileText },
        { id: 'evaluation' as Tab, label: 'Evaluation Queue', icon: ClipboardCheck },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">Faculty Dashboard</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Manage your batches, create exams, and evaluate student submissions
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                    group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }
                  `}
                                >
                                    <Icon
                                        className={`-ml-0.5 mr-2 h-5 w-5 ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                                            }`}
                                    />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-6 pb-12">
                    {activeTab === 'batches' && <MyBatches />}
                    {activeTab === 'exams' && <ExamList />}
                    {activeTab === 'evaluation' && <EvaluationQueue />}
                </div>
            </div>
        </div>
    );
};
