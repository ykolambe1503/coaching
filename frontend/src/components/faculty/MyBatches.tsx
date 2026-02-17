import React from 'react';
import { Users, FileText, ArrowRight, UserPlus, GraduationCap } from 'lucide-react';
import { useBatches } from '../../hooks/useFacultyData';

export const MyBatches: React.FC = () => {
    const { batches, loading, error } = useBatches();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading assigned batches...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-rose-50 p-8 rounded-3xl border border-rose-100 text-center">
                <p className="text-rose-700 font-bold mb-2">Unable to load batches</p>
                <p className="text-rose-600/70 text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {batches.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <Users className="h-10 w-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">No Assignments Yet</h3>
                    <p className="mt-2 text-gray-500 max-w-sm">
                        You haven't been assigned to any student batches for the current academic session.
                    </p>
                    <button className="mt-8 flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all">
                        Contact Administrator <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
                    {batches.map((batch) => (
                        <div
                            key={batch.id}
                            className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 overflow-hidden flex flex-col hover:-translate-y-1"
                        >
                            <div className="p-8 pb-4">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">
                                        <GraduationCap className="h-7 w-7" />
                                    </div>
                                    <div className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-100">
                                        In Progress
                                    </div>
                                </div>

                                <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">{batch.name}</h3>
                                <p className="text-sm text-gray-400 font-medium line-clamp-2 mb-6">Advanced certification course for current academic session students.</p>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center text-gray-500 font-semibold">
                                            <Users className="h-4 w-4 mr-2.5 text-indigo-400/60" />
                                            Active Students
                                        </div>
                                        <span className="text-gray-900 font-bold">{batch.studentCount}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center text-gray-500 font-semibold">
                                            <FileText className="h-4 w-4 mr-2.5 text-rose-400/60" />
                                            Scheduled Exams
                                        </div>
                                        <span className="text-gray-900 font-bold">{batch.examCount}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto p-8 pt-6 border-t border-gray-50 bg-gray-50/30">
                                <button
                                    className="w-full bg-white border border-gray-200 text-gray-700 px-4 py-3.5 rounded-2xl text-sm font-bold hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all flex items-center justify-center gap-2 group/btn shadow-sm"
                                >
                                    Manage Batch
                                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Ghost card for adding new (placeholder UI) */}
                    <div className="border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center p-8 text-center bg-gray-50/30 opacity-60 hover:opacity-100 transition-opacity cursor-pointer group">
                        <div className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center mb-4 text-gray-400 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all">
                            <UserPlus className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-gray-500">Request New Batch</p>
                    </div>
                </div>
            )}
        </div>
    );
};

