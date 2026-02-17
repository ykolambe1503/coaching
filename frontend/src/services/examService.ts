import axios from 'axios';
import type {
    Exam,
    CreateExamRequest,
    QuestionRequest,
    BatchSummary,
    AnswerSheet,
    GradeRequest,
} from '../types/exam';

const api = axios.create({
    baseURL: '/api/v1/faculty',
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const examService = {
    // Batch Management
    async getMyBatches(): Promise<BatchSummary[]> {
        const response = await api.get('/batches');
        return response.data;
    },

    // Exam Management
    async getMyExams(): Promise<Exam[]> {
        const response = await api.get('/exams');
        return response.data;
    },

    async createExam(request: CreateExamRequest): Promise<Exam> {
        const response = await api.post('/exams', request);
        return response.data;
    },

    async getExam(id: string): Promise<Exam> {
        const response = await api.get(`/exams/${id}`);
        return response.data;
    },

    async publishExam(id: string): Promise<void> {
        await api.post(`/exams/${id}/publish`);
    },

    async addQuestion(examId: string, question: QuestionRequest): Promise<void> {
        await api.post(`/exams/${examId}/questions`, question);
    },

    async deleteQuestion(questionId: string): Promise<void> {
        await api.delete(`/questions/${questionId}`);
    },

    // Grading
    async getEvaluationQueue(): Promise<AnswerSheet[]> {
        const response = await api.get('/evaluation-queue');
        return response.data;
    },

    async getAnswerSheet(id: string): Promise<AnswerSheet> {
        const response = await api.get(`/answer-sheets/${id}`);
        return response.data;
    },

    async gradeAnswer(answerId: string, grade: GradeRequest): Promise<void> {
        await api.put(`/answers/${answerId}/grade`, grade);
    },

    async submitGrading(answerSheetId: string): Promise<void> {
        await api.post(`/answer-sheets/${answerSheetId}/submit-grading`);
    },

    async autoGrade(answerSheetId: string): Promise<void> {
        await api.post(`/answer-sheets/${answerSheetId}/auto-grade`);
    },
};
