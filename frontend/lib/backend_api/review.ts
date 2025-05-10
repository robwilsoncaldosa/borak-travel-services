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
      const response = await instance.get<Review[]>('/api/reviews');
      return response.data;
    },

    getReviewById: async (id: string) => {
      const response = await instance.get<Review>(`/api/reviews/${id}`);
      return response.data;
    },

    getPackageReviews: async (packageId: string) => {
      const response = await instance.get<Review[]>(`/api/packages/${packageId}/reviews`);
      return response.data;
    },

    createReview: async (reviewData: Omit<Review, '_id' | 'created_at' | 'updated_at'>) => {
      const response = await instance.post<Review>('/api/reviews/create', reviewData);
      return response.data;
    },
    
    updateReview: async (id: string, reviewData: Omit<Review, '_id' | 'created_at' | 'updated_at'>) => {
      const response = await instance.put<Review>(`/api/reviews/${id}`, reviewData);
      return response.data;
    },

    deleteReview: async (id: string) => {
      const response = await instance.delete(`/api/reviews/${id}`);
      return response.data;
    }
}