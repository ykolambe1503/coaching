import React, { useState } from 'react';
import { BookOpen, BarChart2, MessageCircle, LogOut, Menu, X } from 'lucide-react';
import StudentExamList from './StudentExamList';
import PerformanceAnalytics from './PerformanceAnalytics';
import DoubtSolver from './DoubtSolver';
import ExamView from './ExamView';
import type { Exam, AnswerSheet } from '../types/exam';
import { studentExamService } from '../services/studentExamService';

type View = 'exams' | 'analytics' | 'doubts';

const StudentDashboard: React.FC = () => {
    const [currentView, setCurrentView] = useState<View>('exams');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeAnswerSheet, setActiveAnswerSheet] = useState<AnswerSheet | null>(null);

    const handleStartExam = async (exam: Exam) => {
        try {
            const sheet = await studentExamService.startExam(exam.id);
            setActiveAnswerSheet(sheet);
        } catch (error) {
            console.error('Failed to start exam:', error);
            alert('Failed to start exam. Please try again.');
        }
    };

    const menuItems = [
        { id: 'exams', label: 'My Exams', icon: BookOpen },
        { id: 'analytics', label: 'Performance', icon: BarChart2 },
        { id: 'doubts', label: 'Doubt Solver', icon: MessageCircle },
    ];

    const renderContent = () => {
        switch (currentView) {
            case 'exams':
                return <StudentExamList onStartExam={handleStartExam} />;
            case 'analytics':
                return <PerformanceAnalytics />;
            case 'doubts':
                return <DoubtSolver />;
            default:
                return <StudentExamList onStartExam={handleStartExam} />;
        }
    };

    if (activeAnswerSheet) {
        return <ExamView answerSheet={activeAnswerSheet} onClose={() => setActiveAnswerSheet(null)} />;
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-200 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex flex-col h-full">
                    <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-900">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">Student Portal</span>
                        </div>
                        <button
                            className="ml-auto lg:hidden text-slate-400 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <nav className="flex-1 px-3 py-6 space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentView === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setCurrentView(item.id as View);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`
                                        w-full flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200
                                        ${isActive
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                                    `}
                                >
                                    <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-indigo-200' : 'text-slate-500 group-hover:text-white'}`} />
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-slate-800">
                        <button
                            onClick={() => window.location.href = '/login'}
                            className="w-full flex items-center px-4 py-3 text-sm font-medium text-slate-400 rounded-xl hover:bg-slate-800 hover:text-red-400 transition-colors"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="h-16 lg:hidden bg-white border-b border-gray-200 flex items-center px-4">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="ml-4 text-lg font-semibold text-gray-900">
                        {menuItems.find(i => i.id === currentView)?.label}
                    </span>
                </header>

                <div className="flex-1 overflow-auto p-4 lg:p-8">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
