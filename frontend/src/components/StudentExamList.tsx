import React, { useEffect, useState } from 'react';
import { Clock, ChevronRight, AlertCircle } from 'lucide-react';
import type { Exam } from '../types/exam';
import { studentExamService } from '../services/studentExamService';

interface StudentExamListProps {
    onStartExam?: (exam: Exam) => void;
}

const StudentExamList: React.FC<StudentExamListProps> = ({ onStartExam }) => {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'available' | 'upcoming' | 'history'>('available');

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const data = await studentExamService.getAvailableExams();
                setExams(data);
            } catch (error) {
                console.error('Failed to fetch exams:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, []);

    const getStatusBadge = (status: string) => {
        const styles = {
            PUBLISHED: 'bg-green-100 text-green-800',
            DRAFT: 'bg-gray-100 text-gray-800',
            COMPLETED: 'bg-blue-100 text-blue-800',
        };
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.DRAFT}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">My Exams</h1>
                <p className="mt-1 text-sm text-gray-500">View and attempt your scheduled examinations</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    {['available', 'upcoming', 'history'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`
                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize
                                ${activeTab === tab
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                            `}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {exams.map((exam) => (
                        <div key={exam.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{exam.title}</h3>
                                    {getStatusBadge(exam.status)}
                                </div>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{exam.description || 'No description provided.'}</p>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Clock className="w-4 h-4 mr-2" />
                                        {exam.durationMinutes} mins
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <AlertCircle className="w-4 h-4 mr-2" />
                                        {exam.totalPoints} Marks
                                    </div>
                                </div>

                                <button
                                    onClick={() => onStartExam?.(exam)}
                                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Start Exam
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentExamList;
