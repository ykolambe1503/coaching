import { useState, useEffect } from 'react';
import userManagementService from '../services/userManagementService';
import type { User, Invite } from '../types/user';

export function useUsers(role: 'FACULTY' | 'STUDENT') {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = role === 'FACULTY'
                ? await userManagementService.getFaculty()
                : await userManagementService.getStudents();
            setUsers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [role]);

    return { users, loading, error, refetch: fetchUsers };
}

export function useInvites() {
    const [invites, setInvites] = useState<Invite[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInvites = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await userManagementService.getInvites();
            setInvites(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load invites');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvites();
    }, []);

    return { invites, loading, error, refetch: fetchInvites };
}
