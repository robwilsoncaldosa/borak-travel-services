import { Package } from '@/lib/backend_api/package';
import { Review } from '@/lib/backend_api/review';
import { User } from '@/lib/backend_api/user';

const baseUrl = process.env.NEXT_PUBLIC_SERVER_ENDPOINT || 'http://localhost:5000';

// Server-side data fetching with caching
export async function getPackagesServer() {
    try {
        const response = await fetch(`${baseUrl}/api/packages`, {
            next: { 
                revalidate: 1800, // Cache for 30 minutes
                tags: ['admin-packages']
            },
            cache: 'force-cache'
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
    try {
        const response = await fetch(`${baseUrl}/api/bookings`, {
            next: { 
                revalidate: 300, // Cache for 5 minutes (more frequent updates for bookings)
                tags: ['admin-bookings']
            },
            cache: 'force-cache'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch bookings');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return [];
    }
}

export async function getReviewsServer() {
    try {
        const response = await fetch(`${baseUrl}/api/reviews`, {
            next: { 
                revalidate: 900, // Cache for 15 minutes
                tags: ['admin-reviews']
            },
            cache: 'force-cache'
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
    try {
        const response = await fetch(`${baseUrl}/api/users/getAll`, {
            next: { 
                revalidate: 1800, // Cache for 30 minutes
                tags: ['admin-users']
            },
            cache: 'force-cache'
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

export async function getMessagesServer() {
    try {
        const response = await fetch(`${baseUrl}/api/messages`, {
            next: { 
                revalidate: 60, // Cache for 1 minute (frequent updates for messages)
                tags: ['admin-messages']
            },
            cache: 'force-cache'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch messages');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
}

// Dashboard stats calculation
export async function getDashboardStats() {
    try {
        const [packages, bookings, users, reviews] = await Promise.all([
            getPackagesServer(),
            getBookingsServer(),
            getUsersServer(),
            getReviewsServer()
        ]);

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