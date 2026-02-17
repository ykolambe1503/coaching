import React, { useState } from 'react';
import { FileText, Plus } from 'lucide-react';
import { useExams } from '../../hooks/useFacultyData';
import { ExamCreatorModal } from './ExamCreatorModal';

export const ExamList: React.FC = () => {
    const { exams, loading, error, refetch } = useExams();
    const [isCreating, setIsCreating] = useState(false);

    if (loading) {
        return <div className="text-center py-12">Loading exams...</div>;
    }

    if (error) {
        return <div className="text-center py-12 text-red-600">{error}</div>;
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">My Exams</h2>
                    <p className="mt-1 text-sm text-gray-600">Create and manage your exams</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 flex items-center"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Exam
                </button>
            </div>

            {exams.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No exams created</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating your first exam.</p>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700"
                    >
                        Create Exam
                    </button>
                </div>
            ) : (
                <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Batch
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Questions
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {exams.map((exam) => (
                                <tr key={exam.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{exam.title}</div>
                                        <div className="text-sm text-gray-500">{exam.durationMinutes} mins</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {exam.batchName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {exam.questionCount} questions ({exam.totalPoints} pts)
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${exam.status === 'PUBLISHED'
                                                    ? 'bg-green-100 text-green-800'
                                                    : exam.status === 'DRAFT'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}
                                        >
                                            {exam.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                                        <button className="text-gray-600 hover:text-gray-900">View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isCreating && (
                <ExamCreatorModal
                    onClose={() => setIsCreating(false)}
                    onSuccess={() => {
                        setIsCreating(false);
                        refetch();
                    }}
                />
            )}
        </div>
    );
};
