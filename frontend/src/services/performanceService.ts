import axios from 'axios';

const api = axios.create({
    baseURL: '/api/v1/student/performance',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export interface PerformanceMetric {
    examId: string;
    examTitle: string;
    totalPoints: number;
    obtainedPoints: number;
    percentage: number;
    rank: number;
    batchAverage: number;
    calculatedAt: string;
}

export interface PerformanceData {
    studentName: string;
    overallPercentage: number;
    examsAttempted: number;
    metrics: PerformanceMetric[];
}

export const performanceService = {
    async getPerformance(): Promise<PerformanceData> {
        const response = await api.get('');
        return response.data;
    }
};
