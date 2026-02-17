import axios from 'axios';
import type {
    Organization,
    OrganizationDetail,
    CreateOrganizationRequest,
    UpdateOrganizationRequest,
    UpdateStatusRequest,
} from '../types/organization';

const API_BASE_URL = 'http://localhost:8080/api/v1/admin';

// Create axios instance with interceptors for auth
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
    return config;
});

export const organizationService = {
    /**
     * Get all organizations
     */
    async getAll(): Promise<Organization[]> {
        const response = await api.get<Organization[]>('/organizations');
        return response.data;
    },

    /**
     * Get organization by ID with details
     */
    async getById(orgId: string): Promise<OrganizationDetail> {
        const response = await api.get<OrganizationDetail>(`/organizations/${orgId}`);
        return response.data;
    },

    /**
     * Create a new organization
     */
    async create(data: CreateOrganizationRequest): Promise<Organization> {
        const response = await api.post<Organization>('/organizations', data);
        return response.data;
    },

    /**
     * Update organization details
     */
    async update(orgId: string, data: UpdateOrganizationRequest): Promise<Organization> {
        const response = await api.put<Organization>(`/organizations/${orgId}`, data);
        return response.data;
    },

    /**
     * Update organization status
     */
    async updateStatus(orgId: string, data: UpdateStatusRequest): Promise<Organization> {
        const response = await api.patch<Organization>(`/organizations/${orgId}/status`, data);
        return response.data;
    },

    /**
     * Delete (suspend) organization
     */
    async delete(orgId: string): Promise<void> {
        await api.delete(`/organizations/${orgId}`);
    },
};

export default organizationService;
