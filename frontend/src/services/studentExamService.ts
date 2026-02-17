import axios from 'axios';
import type { Exam, AnswerSheet } from '../types/exam';

const api = axios.create({
    baseURL: '/api/v1/student',
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const studentExamService = {
    async getAvailableExams(): Promise<Exam[]> {
        const response = await api.get('/exams');
        return response.data;
    },

    async getExam(id: string): Promise<Exam> {
        const response = await api.get(`/exams/${id}`);
        return response.data;
    },

    async startExam(id: string): Promise<AnswerSheet> {
        const response = await api.post(`/exams/${id}/start`);
        return response.data;
    },

    async saveAnswer(answerId: string, answerText: string): Promise<void> {
        await api.put(`/answers/${answerId}`, answerText, {
            headers: { 'Content-Type': 'text/plain' } // Backend expects raw string or JSON? Controller says @RequestBody String answerText. Default might be plain text or JSON string. 
            // If @RequestBody String, it accepts the body content as string.
            // Safe to send generic body if configured. Or wrap in object if backend DTO changed.
            // Controller: public ResponseEntity<Answer> saveAnswer(..., @RequestBody String answerText)
        });
    },

    async uploadAnswerImage(answerId: string, imageFile: File): Promise<string> {
        const formData = new FormData();
        formData.append('image', imageFile);
        const response = await api.post(`/answers/${answerId}/upload-image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data; // Assumes returns image URL
    },

    async submitExam(answerSheetId: string): Promise<void> {
        await api.post(`/answer-sheets/${answerSheetId}/submit`);
    }
};
