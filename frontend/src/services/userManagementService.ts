import axios from 'axios';
import type { User, CreateUserRequest, UpdateUserRequest, Invite, InviteRequest, SignUpWithInviteRequest } from '../types/user';

const API_BASE_URL = 'http://localhost:8080/api/v1/org-admin';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Add organization ID header
    const orgId = localStorage.getItem('org_id');
    if (orgId) {
        config.headers['X-Organization-Id'] = orgId;
    }

    return config;
});

export const userManagementService = {
    // Get faculty
    async getFaculty(): Promise<User[]> {
        const response = await api.get('/users/faculty');
        return response.data;
    },

    // Get students
    async getStudents(): Promise<User[]> {
        const response = await api.get('/users/students');
        return response.data;
    },

    // Create user
    async createUser(data: CreateUserRequest): Promise<User> {
        const response = await api.post('/users', data);
        return response.data;
    },

    // Get user by ID
    async getUserById(userId: string): Promise<User> {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    },

    // Update user
    async updateUser(userId: string, data: UpdateUserRequest): Promise<User> {
        const response = await api.put(`/users/${userId}`, data);
        return response.data;
    },

    // Delete user
    async deleteUser(userId: string): Promise<void> {
        await api.delete(`/users/${userId}`);
    },

    // Create invite
    async createInvite(data: InviteRequest): Promise<Invite> {
        const response = await api.post('/invites', data);
        return response.data;
    },

    // Get invites
    async getInvites(): Promise<Invite[]> {
        const response = await api.get('/invites');
        return response.data;
    },

    // Resend invite
    async resendInvite(inviteId: string): Promise<Invite> {
        const response = await api.post(`/invites/${inviteId}/resend`);
        return response.data;
    },

    // Sign up with invite
    async signUpWithInvite(token: string, data: SignUpWithInviteRequest): Promise<any> {
        const response = await axios.post(
            `http://localhost:8080/api/auth/signup/invite/${token}`,
            data
        );
        return response.data;
    },
};

export default userManagementService;
