import { instance } from '../axios';

export interface Review {
    _id: string;
    guest_id: string;
    package_id: string;
    review: string;
    rating: number;
    status: string;
    created_at: string;
    updated_at: string;
} 

export const reviewApi = {
    getAllReviews: async () => {
        try {
            const response = await instance.get<Review[]>('/api/reviews');
            return response.data || [];
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
            return []; // Return empty array on error
        }
    },

    getReviewById: async (id: string) => {
        try {
            const response = await instance.get<Review>(`/api/reviews/${id}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch review:', error);
            throw error;
        }
    },

    getPackageReviews: async (packageId: string) => {
        try {
            const response = await instance.get<Review[]>(`/api/packages/${packageId}/reviews`);
            return response.data || [];
        } catch (error) {
            console.error('Failed to fetch package reviews:', error);
            return []; // Return empty array on error
        }
    },

    createReview: async (reviewData: Omit<Review, '_id' | 'created_at' | 'updated_at'>) => {
        try {
            const response = await instance.post<Review>('/api/reviews/create', reviewData);
            return response.data;
        } catch (error) {
            console.error('Failed to create review:', error);
            throw error;
        }
    },
    
    updateReview: async (id: string, reviewData: Omit<Review, '_id' | 'created_at' | 'updated_at'>) => {
        try {
            const response = await instance.put<Review>(`/api/reviews/${id}`, reviewData);
            return response.data;
        } catch (error) {
            console.error('Failed to update review:', error);
            throw error;
        }
    },

    deleteReview: async (id: string) => {
        try {
            const response = await instance.delete(`/api/reviews/${id}`);
            return response.data;
        } catch (error) {
            console.error('Failed to delete review:', error);
            throw error;
        }
    }
}