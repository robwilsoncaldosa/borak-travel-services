import { Package } from '@/lib/backend_api/package';
import { Review } from '@/lib/backend_api/review';
import { User } from '@/lib/backend_api/user';

const baseUrl = process.env.NEXT_PUBLIC_SERVER_ENDPOINT || 'http://localhost:5000';

// Helper function to check if we're in build time
const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.NEXT_RUNTIME;

// Server-side data fetching with build-time fallbacks
export async function getPackagesServer() {
    // Return empty array during build time to prevent timeouts
    if (isBuildTime) {
        console.log('Build time detected, returning empty packages array');
        return [];
    }

    try {
        const response = await fetch(`${baseUrl}/api/packages`, {
            next: { 
                revalidate: 1800, // Cache for 30 minutes
                tags: ['admin-packages']
            },
            cache: 'force-cache',
            // Add timeout to prevent hanging
            signal: AbortSignal.timeout(10000) // 10 second timeout
        });

        if (!response.ok) {
            throw new Error('Failed to fetch packages');
        }

        const data: Package[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching packages:', error);
        return [];
    }
}

export async function getBookingsServer() {
    if (isBuildTime) {
        console.log('Build time detected, returning empty bookings array');
        return [];
    }

    try {
        const response = await fetch(`${baseUrl}/api/bookings`, {
            next: { 
                revalidate: 600, // Cache for 10 minutes
                tags: ['admin-bookings']
            },
            cache: 'force-cache',
            signal: AbortSignal.timeout(10000)
        });

        if (!response.ok) {
            throw new Error('Failed to fetch bookings');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return [];
    }
}

export async function getReviewsServer() {
    if (isBuildTime) {
        console.log('Build time detected, returning empty reviews array');
        return [];
    }

    try {
        const response = await fetch(`${baseUrl}/api/reviews`, {
            next: { 
                revalidate: 900, // Cache for 15 minutes
                tags: ['admin-reviews']
            },
            cache: 'force-cache',
            signal: AbortSignal.timeout(10000)
        });

        if (!response.ok) {
            throw new Error('Failed to fetch reviews');
        }

        const data: Review[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
}

export async function getUsersServer() {
    if (isBuildTime) {
        console.log('Build time detected, returning empty users array');
        return [];
    }

    try {
        const response = await fetch(`${baseUrl}/api/users`, {
            next: { 
                revalidate: 1800, // Cache for 30 minutes
                tags: ['admin-users']
            },
            cache: 'force-cache',
            signal: AbortSignal.timeout(10000)
        });

        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        const data: User[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

// Dashboard stats calculation with build-time fallbacks
export async function getDashboardStats() {
    if (isBuildTime) {
        console.log('Build time detected, returning default dashboard stats');
        return {
            totalUsers: 0,
            totalRevenue: 0,
            totalBookings: 0,
            activeBookings: 0,
            totalPackages: 0,
            totalReviews: 0
        };
    }

    try {
        // Use Promise.allSettled to handle individual failures gracefully
        const results = await Promise.allSettled([
            getPackagesServer(),
            getBookingsServer(),
            getUsersServer(),
            getReviewsServer()
        ]);

        // Extract successful results or use empty arrays as fallbacks
        const packages = results[0].status === 'fulfilled' ? results[0].value : [];
        const bookings = results[1].status === 'fulfilled' ? results[1].value : [];
        const users = results[2].status === 'fulfilled' ? results[2].value : [];
        const reviews = results[3].status === 'fulfilled' ? results[3].value : [];

        // Calculate revenue from bookings
        const totalRevenue = bookings.reduce((sum: number, booking: any) => {
            return sum + (booking.paid_amount || 0);
        }, 0);

        // Count active bookings
        const activeBookings = bookings.filter((booking: any) => 
            booking.status === 'VERIFIED' || booking.status === 'INPROGRESS'
        ).length;

        return {
            totalUsers: users.length,
            totalRevenue: totalRevenue,
            totalBookings: bookings.length,
            activeBookings: activeBookings,
            totalPackages: packages.length,
            totalReviews: reviews.length
        };
    } catch (error) {
        console.error('Error calculating dashboard stats:', error);
        return {
            totalUsers: 0,
            totalRevenue: 0,
            totalBookings: 0,
            activeBookings: 0,
            totalPackages: 0,
            totalReviews: 0
        };
    }
}