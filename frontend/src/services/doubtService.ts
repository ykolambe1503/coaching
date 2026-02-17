import axios from 'axios';

const api = axios.create({
    baseURL: '/api/v1/student/doubts',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export interface Doubt {
    id: string;
    question: string;
    aiResponse: string;
    askedAt: string;
}

export const doubtService = {
    async askDoubt(question: string, context?: string): Promise<Doubt> {
        const response = await api.post('', { question, context });
        return response.data;
    },

    async getHistory(): Promise<Doubt[]> {
        const response = await api.get('');
        return response.data;
    },

    async deleteDoubt(id: string): Promise<void> {
        await api.delete(`/${id}`);
    }
};
