import { useState, useEffect } from 'react';
import organizationService from '../services/organizationService';
import type { Organization, OrganizationDetail } from '../types/organization';

export function useOrganizations() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrganizations = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await organizationService.getAll();
            setOrganizations(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch organizations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    return {
        organizations,
        loading,
        error,
        refetch: fetchOrganizations,
    };
}

export function useOrganizationDetail(orgId: string | null) {
    const [organization, setOrganization] = useState<OrganizationDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!orgId) {
            setOrganization(null);
            return;
        }

        const fetchOrganization = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await organizationService.getById(orgId);
                setOrganization(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch organization');
            } finally {
                setLoading(false);
            }
        };

        fetchOrganization();
    }, [orgId]);

    return { organization, loading, error };
}
