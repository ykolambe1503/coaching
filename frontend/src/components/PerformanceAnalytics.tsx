import React, { useEffect, useState } from 'react';
import { Trophy, Target, TrendingUp, AlertCircle } from 'lucide-react';
import { performanceService, type PerformanceData } from '../services/performanceService';

const PerformanceAnalytics: React.FC = () => {
    const [data, setData] = useState<PerformanceData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const performanceData = await performanceService.getPerformance();
                setData(performanceData);
            } catch (error) {
                console.error('Failed to fetch performance data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No performance data available</h3>
                <p className="mt-2 text-gray-500">Complete some exams to see your analytics.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
                <p className="text-gray-500 text-sm mt-1">Track your progress and exam history</p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 group">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Overall Score</p>
                            <p className="text-3xl font-bold text-indigo-600 mt-2 group-hover:scale-105 transition-transform origin-left">{data.overallPercentage}%</p>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
                            <TrendingUp className="w-6 h-6 text-indigo-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 group">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Exams Attempted</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2 group-hover:scale-105 transition-transform origin-left">{data.examsAttempted}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
                            <Target className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 group">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Average Rank</p>
                            <p className="text-3xl font-bold text-amber-600 mt-2 group-hover:scale-105 transition-transform origin-left">
                                #{Math.round(data.metrics.reduce((acc, curr) => acc + curr.rank, 0) / (data.metrics.length || 1))}
                            </p>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-xl group-hover:bg-amber-100 transition-colors">
                            <Trophy className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Chart & Recent Exams */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Score vs Batch Average */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Performance Comparison</h2>
                    <div className="space-y-6">
                        {data.metrics.map((metric) => (
                            <div key={metric.examId} className="group">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">{metric.examTitle}</span>
                                    <span className="text-gray-500">{new Date(metric.calculatedAt).toLocaleDateString()}</span>
                                </div>
                                <div className="relative pt-1">
                                    <div className="flex mb-2 items-center justify-between">
                                        <div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-md text-indigo-600 bg-indigo-50 border border-indigo-100">
                                            You: {metric.percentage}%
                                        </div>
                                        <div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-md text-gray-600 bg-gray-50 border border-gray-200">
                                            Batch Avg: {metric.batchAverage}%
                                        </div>
                                    </div>
                                    <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gray-100 shadow-inner">
                                        <div
                                            style={{ width: `${metric.percentage}%` }}
                                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-1000 ease-out"
                                        ></div>
                                        <div
                                            style={{ width: `${Math.max(0, metric.batchAverage - metric.percentage)}%`, marginLeft: metric.percentage < metric.batchAverage ? 0 : `-${metric.percentage - metric.batchAverage}%`, opacity: 0.3 }}
                                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gray-400"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Exams</h2>
                    <div className="overflow-hidden rounded-xl border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.metrics.map((metric) => (
                                    <tr key={metric.examId} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {metric.examTitle}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className={`font-semibold ${metric.percentage >= 75 ? 'text-green-600' : metric.percentage >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                                                {metric.percentage}%
                                            </span>
                                            <span className="text-gray-400 text-xs ml-1">
                                                ({metric.obtainedPoints}/{metric.totalPoints})
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                #{metric.rank}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerformanceAnalytics;
