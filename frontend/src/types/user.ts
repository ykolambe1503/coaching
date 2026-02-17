import type { Role } from './organization';

// User types
export interface User {
    userId: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    role: Role;
    enabled: boolean;
    organizationId: string;
    organizationName: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    password: string;
}

export interface UpdateUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    enabled?: boolean;
}

// Invite types
export type InviteStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED';

export interface Invite {
    inviteId: string;
    email: string;
    role: Role;
    inviteLink: string;
    status: InviteStatus;
    invitedByName: string;
    expiresAt: string;
    createdAt: string;
    acceptedAt?: string;
}

export interface InviteRequest {
    email: string;
    role: Role;
}

export interface SignUpWithInviteRequest {
    firstName: string;
    lastName: string;
    password: string;
}
