import { useAppSelector, useAppDispatch } from './store';
import {
    fetchSubscriptionLimits,
    resetSubscriptionStatus
} from '@/store/slices/subscriptionSlice';
import { useCallback } from 'react';

export function useSubscription() {
    const dispatch = useAppDispatch();
    const {
        limits,
        status,
        error,
        initialized
    } = useAppSelector((state) => state.subscription);

    const loadLimits = useCallback(() => {
        return dispatch(fetchSubscriptionLimits());
    }, [dispatch]);

    const clearSubscriptionError = useCallback(() => {
        dispatch(resetSubscriptionStatus());
    }, [dispatch]);

    // Helper to get tier details by tier name
    const getTierDetails = useCallback((tier: string) => {
        return limits.find(limit => limit.tier === tier) || null;
    }, [limits]);

    // Helper to get all tier names
    const getAllTiers = useCallback(() => {
        return limits.map(limit => limit.tier);
    }, [limits]);

    return {
        limits,
        loading: status === 'loading',
        error,
        initialized,
        loadLimits,
        clearError: clearSubscriptionError,
        getTierDetails,
        getAllTiers
    };
}