// Organization types
export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'FACULTY' | 'STUDENT';

export interface Organization {
    orgId: string;
    name: string;
    description?: string;
    status: OrganizationStatus;
    address?: string;
    phone?: string;
    email?: string;
    adminId: string;
    adminName: string;
    adminEmail: string;
    batchCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface OrganizationDetail extends Organization {
    adminContact: AdminContact;
    batches: BatchSummary[];
}

export interface AdminContact {
    userId: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
}

export interface BatchSummary {
    batchId: string;
    name: string;
    description?: string;
    studentCount: number;
    facultyCount: number;
}

export type OrganizationStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING';

export interface CreateOrganizationRequest {
    name: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    adminName: string;
    adminEmail: string;
    adminPassword: string;
}

export interface UpdateOrganizationRequest {
    name: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    adminName: string;
    adminEmail: string;
    adminPassword: string;
}

export interface UpdateStatusRequest {
    status: OrganizationStatus;
}
