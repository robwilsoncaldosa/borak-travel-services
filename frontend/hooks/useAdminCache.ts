import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/cache/query-client';

// API imports
import { packageApi, Package } from '@/lib/backend_api/package';
import { bookingsApi } from '@/lib/backend_api/bookings';
import { reviewApi, Review } from '@/lib/backend_api/review';
import { userApi, User } from '@/lib/backend_api/user';
import { chatApi } from '@/lib/backend_api/chat';
import { getDashboardStats } from '@/app/admin/dashboard/lib/server-api';

// Generic hook for cached data with mutations
export function useCachedData<T>(
    queryKey: readonly string[],
    queryFn: () => Promise<T[]>,
    options?: {
        staleTime?: number;
        enabled?: boolean;
    }
) {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey,
        queryFn,
        staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes default
        enabled: options?.enabled ?? true,
    });

    const invalidateCache = () => {
        queryClient.invalidateQueries({ queryKey });
    };

    const updateCache = (updater: (oldData: T[] | undefined) => T[]) => {
        queryClient.setQueryData(queryKey, updater);
    };

    const refreshData = () => {
        return queryClient.refetchQueries({ queryKey });
    };

    return {
        ...query,
        invalidateCache,
        updateCache,
        refreshData,
    };
}

// Specific hooks for each data type
export function usePackagesCache(initialData?: Package[]) {
    const queryClient = useQueryClient();

    // Set initial data if provided
    if (initialData && !queryClient.getQueryData(queryKeys.packages)) {
        queryClient.setQueryData(queryKeys.packages, initialData);
    }

    const packagesQuery = useCachedData(
        queryKeys.packages,
        packageApi.getAllPackages
    );

    const createPackageMutation = useMutation({
        mutationFn: packageApi.createPackage,
        onSuccess: (newPackage) => {
            packagesQuery.updateCache((old) => [...(old || []), newPackage]);
            toast.success('Package created successfully');
        },
        onError: () => {
            toast.error('Failed to create package');
        },
    });

    const updatePackageMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            packageApi.updatePackage(id, data),
        onSuccess: (updatedPackage) => {
            packagesQuery.updateCache((old) =>
                old?.map((pkg) => (pkg._id === updatedPackage._id ? updatedPackage : pkg)) || []
            );
            toast.success('Package updated successfully');
        },
        onError: () => {
            toast.error('Failed to update package');
        },
    });

    const deletePackageMutation = useMutation({
        mutationFn: packageApi.deletePackage,
        onSuccess: (_, deletedId) => {
            packagesQuery.updateCache((old) =>
                old?.filter((pkg) => pkg._id !== deletedId) || []
            );
            toast.success('Package deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete package');
        },
    });

    return {
        ...packagesQuery,
        createPackage: createPackageMutation.mutateAsync,
        updatePackage: updatePackageMutation.mutateAsync,
        deletePackage: deletePackageMutation.mutateAsync,
        isCreating: createPackageMutation.isPending,
        isUpdating: updatePackageMutation.isPending,
        isDeleting: deletePackageMutation.isPending,
    };
}

export function useBookingsCache(initialData?: any[]) {
    const queryClient = useQueryClient();

    if (initialData && !queryClient.getQueryData(queryKeys.bookings)) {
        queryClient.setQueryData(queryKeys.bookings, initialData);
    }

    const bookingsQuery = useCachedData(
        queryKeys.bookings,
        bookingsApi.getAllBookings,
        { staleTime: 2 * 60 * 1000 } // 2 minutes for more frequent updates
    );

    const updateBookingMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            bookingsApi.updateBooking(id, data),
        onSuccess: (updatedBooking) => {
            bookingsQuery.updateCache((old) =>
                old?.map((booking: any) => (booking._id === updatedBooking._id ? updatedBooking : booking)) || []
            );
            toast.success('Booking updated successfully');
        },
        onError: () => {
            toast.error('Failed to update booking');
        },
    });

    const deleteBookingMutation = useMutation({
        mutationFn: bookingsApi.deleteBooking,
        onSuccess: (_, deletedId) => {
            bookingsQuery.updateCache((old) =>
                old?.filter((booking: any) => booking._id !== deletedId) || []
            );
            toast.success('Booking deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete booking');
        },
    });

    return {
        ...bookingsQuery,
        updateBooking: updateBookingMutation.mutateAsync,
        deleteBooking: deleteBookingMutation.mutateAsync,
        isUpdating: updateBookingMutation.isPending,
        isDeleting: deleteBookingMutation.isPending,
    };
}

export function useReviewsCache(initialData?: Review[]) {
    const queryClient = useQueryClient();

    if (initialData && !queryClient.getQueryData(queryKeys.reviews)) {
        queryClient.setQueryData(queryKeys.reviews, initialData);
    }

    const reviewsQuery = useCachedData(
        queryKeys.reviews,
        reviewApi.getAllReviews
    );

    const updateReviewMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Omit<Review, '_id' | 'created_at' | 'updated_at'> }) =>
            reviewApi.updateReview(id, data),
        onSuccess: (updatedReview) => {
            reviewsQuery.updateCache((old) =>
                old?.map((review) => (review._id === updatedReview._id ? updatedReview : review)) || []
            );
            toast.success('Review updated successfully');
        },
        onError: () => {
            toast.error('Failed to update review');
        },
    });

    const deleteReviewMutation = useMutation({
        mutationFn: reviewApi.deleteReview,
        onSuccess: (_, deletedId) => {
            reviewsQuery.updateCache((old) =>
                old?.filter((review) => review._id !== deletedId) || []
            );
            toast.success('Review deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete review');
        },
    });

    return {
        ...reviewsQuery,
        updateReview: updateReviewMutation.mutateAsync,
        deleteReview: deleteReviewMutation.mutateAsync,
        isUpdating: updateReviewMutation.isPending,
        isDeleting: deleteReviewMutation.isPending,
    };
}

export function useUsersCache(initialData?: User[]) {
    const queryClient = useQueryClient();

    if (initialData && !queryClient.getQueryData(queryKeys.users)) {
        queryClient.setQueryData(queryKeys.users, initialData);
    }

    const usersQuery = useCachedData(
        queryKeys.users,
        userApi.getAllUsers
    );

    const createUserMutation = useMutation({
        mutationFn: userApi.createUser,
        onSuccess: (newUser) => {
            usersQuery.updateCache((old) => [...(old || []), newUser]);
            toast.success('User created successfully');
        },
        onError: () => {
            toast.error('Failed to create user');
        },
    });

    const updateUserMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            userApi.updateUser(id, data),
        onSuccess: (updatedUser) => {
            usersQuery.updateCache((old) =>
                old?.map((user) => (user.user_id === updatedUser.user_id ? updatedUser : user)) || []
            );
            toast.success('User updated successfully');
        },
        onError: () => {
            toast.error('Failed to update user');
        },
    });

    const deleteUserMutation = useMutation({
        mutationFn: userApi.deleteUser,
        onSuccess: (_, deletedId) => {
            usersQuery.updateCache((old) =>
                old?.filter((user) => user.user_id !== deletedId) || []
            );
            toast.success('User deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete user');
        },
    });

    return {
        ...usersQuery,
        createUser: createUserMutation.mutateAsync,
        updateUser: updateUserMutation.mutateAsync,
        deleteUser: deleteUserMutation.mutateAsync,
        isCreating: createUserMutation.isPending,
        isUpdating: updateUserMutation.isPending,
        isDeleting: deleteUserMutation.isPending,
    };
}

export function useMessagesCache() {
    return useCachedData(
        queryKeys.messages,
        chatApi.getAllMessages,
        { staleTime: 30 * 1000 } // 30 seconds for real-time feel
    );
}

export function useDashboardStatsCache() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: queryKeys.dashboardStats,
        queryFn: getDashboardStats,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });

    const invalidateCache = () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats });
    };

    const refreshData = () => {
        return queryClient.refetchQueries({ queryKey: queryKeys.dashboardStats });
    };

    return {
        ...query,
        invalidateCache,
        refreshData,
    };
}

// Global cache invalidation for when data changes across the app
export function useGlobalCacheInvalidation() {
    const queryClient = useQueryClient();

    const invalidateAll = () => {
        queryClient.invalidateQueries();
    };

    const invalidateRelated = (type: 'booking' | 'package' | 'user' | 'review') => {
        // Invalidate dashboard stats when any data changes
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats });

        switch (type) {
            case 'booking':
                queryClient.invalidateQueries({ queryKey: queryKeys.bookings });
                break;
            case 'package':
                queryClient.invalidateQueries({ queryKey: queryKeys.packages });
                break;
            case 'user':
                queryClient.invalidateQueries({ queryKey: queryKeys.users });
                break;
            case 'review':
                queryClient.invalidateQueries({ queryKey: queryKeys.reviews });
                break;
        }
    };

    return {
        invalidateAll,
        invalidateRelated,
    };
}